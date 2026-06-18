# Deploying FinPlan

The [`finplan`](finplan) chart deploys the full stack:

| Component | Workload | Image |
| --------- | -------- | ----- |
| API (GraphQL, .NET) | `Deployment` + migration `Job` | `ghcr.io/michielvanherreweghe/finplan-backend` |
| Frontend (React SPA) | `Deployment` (nginx) | `ghcr.io/michielvanherreweghe/finplan-frontend` |
| Database | CloudNativePG `Cluster` | (CNPG default Postgres image) |
| Ingress | Gateway API `HTTPRoute` (attached to an existing Envoy Gateway) | — |
| Network | `CiliumNetworkPolicy` per workload | — |

`/` routes to the SPA and `/graphql` to the API through one hostname, so the browser stays
same-origin (no CORS needed), matching the dev Vite proxy. The `Gateway` itself (listeners,
TLS, cert-manager) is owned **outside** this chart; the chart only attaches an `HTTPRoute`.

## Cluster prerequisites

These operators/CRDs must already be installed (the chart renders their CRs but does **not**
bundle them):

- **CloudNativePG** — <https://cloudnative-pg.io> (provides `postgresql.cnpg.io`)
- **Envoy Gateway** with a **`Gateway` already provisioned** (listeners + TLS). This chart only
  adds an `HTTPRoute` attached to it via `httpRoute.parentRefs` — <https://gateway.envoyproxy.io>
- **Cilium** as the CNI, with DNS-based (`toFQDNs`) policy enforcement — <https://cilium.io>

## Install

```bash
helm upgrade --install finplan oci://ghcr.io/michielvanherreweghe/charts/finplan \
  --version <chart-version> \
  --namespace finplan --create-namespace \
  --set 'httpRoute.hostnames[0]=finplan.example.com' \
  --set 'httpRoute.parentRefs[0].name=shared-gateway' \
  --set 'httpRoute.parentRefs[0].namespace=envoy-gateway-system' \
  --set 'httpRoute.parentRefs[0].sectionName=https' \
  --set api.auth0.authority=https://YOUR_TENANT.auth0.com/ \
  --set api.auth0.clientId=YOUR_API_CLIENT_ID \
  --set frontend.oidc.authority=https://YOUR_TENANT.auth0.com/ \
  --set frontend.oidc.clientId=YOUR_SPA_CLIENT_ID
```

For a single-node / dev cluster the database defaults to 1 instance with anti-affinity off.
For HA add `--set database.instances=3 --set database.affinity.enablePodAntiAffinity=true`.

Then point DNS for the hostname at your Gateway's address:

```bash
kubectl -n envoy-gateway-system get gateway
```

> The image tag defaults to the chart's `appVersion`. Override per environment with
> `--set api.image.tag=…` / `--set frontend.image.tag=…` if you decouple them.

## How it fits together

### Database & connection string
CloudNativePG creates the `finplan` database and a `finplan-db-app` secret. The API and the
migration Job read `host`/`port`/`dbname`/`username`/`password` from that secret and compose
`ConnectionStrings__Database` via Kubernetes `$(VAR)` interpolation, so CNPG keeps ownership of
the (rotating) password. To use an external Postgres instead:

```bash
--set database.enabled=false --set database.existingSecret=<secret-with-the-same-keys>
```

### Deployment ordering (sync waves)
A deploy runs in three phases, so the database is ready before migrations and migrations land
before the new code rolls out. Resources carry `argocd.argoproj.io/sync-wave` annotations
(configurable under `argocd.syncWaves`):

| Wave | Resources |
|------|-----------|
| `0` dependencies | ServiceAccount, ConfigMaps, CiliumNetworkPolicies, CNPG `Cluster` |
| `1` migration | EF Core migration `Job` |
| `2` workloads | API + frontend `Deployment`s, `Service`s, `HTTPRoute`, HPAs, PDBs |

ArgoCD advances to the next wave only once the current wave is **Healthy** (and the migration
hook has **succeeded**), so a failed migration blocks the rollout — the previous version keeps
running against the old (intact) schema.

> **ArgoCD prerequisite:** wave-0 gating only waits for the database if ArgoCD has a health
> check for the CNPG `Cluster`. Recent ArgoCD bundles one; if yours doesn't, add it to
> `argocd-cm` (in your ArgoCD install repo — not this chart):
> ```yaml
> data:
>   resource.customizations.health.postgresql.cnpg.io_Cluster: |
>     hs = {}
>     if obj.status ~= nil and obj.status.phase ~= nil then
>       if obj.status.phase == "Cluster in healthy state" then
>         hs.status = "Healthy"; hs.message = obj.status.phase; return hs
>       end
>       hs.status = "Progressing"; hs.message = obj.status.phase; return hs
>     end
>     hs.status = "Progressing"; hs.message = "Waiting for cluster"; return hs
> ```
> Without it ArgoCD marks the `Cluster` Healthy immediately and may run wave 1 before Postgres
> is up — the `migrations.waitForDb` initContainer and `backoffLimit` are the only safety net then.

### Migrations
EF Core migrations run as a `Job` that executes `dotnet FinPlan.Api.dll migrate` and exits, at
wave 1. A `wait-for-db` initContainer blocks until Postgres accepts connections so the migrate
container never starts against an unreachable DB. Disable the Job with
`--set migrations.enabled=false`; disable the wait with `--set migrations.waitForDb.enabled=false`.

`migrations.hookMode` selects how the Job is managed:
- **`argocd`** (default) — an ArgoCD `Sync` hook (`BeforeHookCreation`), re-created on each sync.
- **`helm`** — a `helm.sh/hook` (`post-install,pre-upgrade`) for plain `helm install/upgrade`,
  so Helm owns the Job lifecycle (avoids the immutable-`Job` error a re-applied Job would hit).
  Set this if you deploy with `helm` rather than ArgoCD.

**If the migration fails** it retries up to `migrations.backoffLimit` (5) times, then the Job
fails and wave 2 never runs. The failed Job is retained so you can inspect it:

```bash
kubectl -n finplan logs job/finplan-api-migrate
```

Fix the cause and re-sync. PostgreSQL DDL is transactional and EF wraps each migration in a
transaction, so a mid-way failure rolls back that migration and re-running resumes at the first
unapplied one. For plain Helm, deploy with `--atomic --timeout 10m` so a failed migration also
rolls the release back cleanly.

### Ingress / TLS
TLS termination and the HTTP→HTTPS redirect live on the **Gateway**, which is owned outside
this chart. The chart only attaches an `HTTPRoute` (`httpRoute.parentRefs`) to that Gateway's
TLS listener. Set `httpRoute.enabled=false` to skip the route entirely.

### Network policies (Cilium)
With `networkPolicy.defaultDeny=true` (default) each workload only accepts ingress from the
Envoy Gateway proxies. The API egresses only to the database (5432), kube-dns, and the Auth0
FQDNs (`networkPolicy.egressFqdns`); the frontend egresses only to DNS. Set
`networkPolicy.gateway.namespace`/`podSelector` if your Envoy Gateway proxies run elsewhere.

## Local validation

No cluster required — render and validate the manifests:

```bash
helm lint charts/finplan
helm template finplan charts/finplan \
  --set api.auth0.authority=https://t.auth0.com/ --set api.auth0.clientId=x \
  --set frontend.oidc.authority=https://t.auth0.com/ --set frontend.oidc.clientId=x \
  | kubeconform -strict -ignore-missing-schemas -summary
```

## Releases

Images and the chart are published to GHCR by the [`release-please`](../.github/workflows/release-please.yml)
workflow when release-please cuts a release for the matching component. See that workflow for details.
