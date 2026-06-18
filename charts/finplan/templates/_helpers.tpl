{{/* Chart name, overridable. */}}
{{- define "finplan.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/* Release-prefixed fullname. */}}
{{- define "finplan.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- define "finplan.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/* Common labels applied to every resource. */}}
{{- define "finplan.labels" -}}
helm.sh/chart: {{ include "finplan.chart" . }}
app.kubernetes.io/name: {{ include "finplan.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/part-of: finplan
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{/* ---------- Component names ---------- */}}
{{- define "finplan.api.fullname" -}}{{ include "finplan.fullname" . }}-api{{- end -}}
{{- define "finplan.frontend.fullname" -}}{{ include "finplan.fullname" . }}-frontend{{- end -}}
{{- define "finplan.db.fullname" -}}{{ include "finplan.fullname" . }}-db{{- end -}}

{{/* ---------- API labels/selectors ---------- */}}
{{- define "finplan.api.selectorLabels" -}}
app.kubernetes.io/name: {{ include "finplan.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: api
{{- end -}}
{{- define "finplan.api.labels" -}}
{{ include "finplan.labels" . }}
app.kubernetes.io/component: api
{{- end -}}

{{/* ---------- Frontend labels/selectors ---------- */}}
{{- define "finplan.frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "finplan.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: frontend
{{- end -}}
{{- define "finplan.frontend.labels" -}}
{{ include "finplan.labels" . }}
app.kubernetes.io/component: frontend
{{- end -}}

{{/* ServiceAccount name. */}}
{{- define "finplan.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
{{- default (include "finplan.fullname" .) .Values.serviceAccount.name -}}
{{- else -}}
{{- default "default" .Values.serviceAccount.name -}}
{{- end -}}
{{- end -}}

{{/* Image refs. */}}
{{- define "finplan.api.image" -}}
{{- $tag := .Values.api.image.tag | default .Chart.AppVersion -}}
{{- printf "%s/%s:%s" .Values.image.registry .Values.api.image.repository $tag -}}
{{- end -}}
{{- define "finplan.frontend.image" -}}
{{- $tag := .Values.frontend.image.tag | default .Chart.AppVersion -}}
{{- printf "%s/%s:%s" .Values.image.registry .Values.frontend.image.repository $tag -}}
{{- end -}}

{{/* Image pull secrets block. */}}
{{- define "finplan.imagePullSecrets" -}}
{{- with .Values.image.pullSecrets }}
imagePullSecrets:
{{- range . }}
  - name: {{ . }}
{{- end }}
{{- end }}
{{- end -}}

{{/*
Name of the secret holding database credentials. CloudNativePG generates "<cluster>-app"
for the bootstrap owner; external mode uses the user-provided secret.
*/}}
{{- define "finplan.db.secretName" -}}
{{- if .Values.database.enabled -}}
{{- printf "%s-app" (include "finplan.db.fullname" .) -}}
{{- else -}}
{{- required "database.existingSecret is required when database.enabled=false" .Values.database.existingSecret -}}
{{- end -}}
{{- end -}}

{{/*
Database environment block, shared by the API Deployment and the migration Job.
Individual fields come from the credentials secret; the Npgsql connection string is composed
via kubelet $(VAR) interpolation so CNPG keeps ownership of the rotating password.
*/}}
{{- define "finplan.db.env" -}}
{{- $secret := include "finplan.db.secretName" . }}
- name: DB_HOST
  valueFrom:
    secretKeyRef:
      name: {{ $secret }}
      key: host
- name: DB_PORT
  valueFrom:
    secretKeyRef:
      name: {{ $secret }}
      key: port
- name: DB_NAME
  valueFrom:
    secretKeyRef:
      name: {{ $secret }}
      key: dbname
- name: DB_USER
  valueFrom:
    secretKeyRef:
      name: {{ $secret }}
      key: username
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: {{ $secret }}
      key: password
- name: ConnectionStrings__Database
  value: "Host=$(DB_HOST);Port=$(DB_PORT);Database=$(DB_NAME);Username=$(DB_USER);Password=$(DB_PASSWORD)"
{{- end -}}

{{/*
ArgoCD sync-wave annotation. Pass the wave value (a string), e.g.
  {{- include "finplan.syncWave" .Values.argocd.syncWaves.dependencies | nindent 4 }}
Ignored by plain Helm, so it is always safe to emit.
*/}}
{{- define "finplan.syncWave" -}}
argocd.argoproj.io/sync-wave: {{ . | quote }}
{{- end -}}

{{/*
Annotations that order + manage the migration Job, switched by .Values.migrations.hookMode:
  * "argocd": an ArgoCD Sync hook at the migration wave. BeforeHookCreation re-runs a fresh
    Job each sync (sidesteps the immutable Job spec.template error a re-applied Job hits).
  * "helm":   a Helm post-install/pre-upgrade hook for plain `helm install/upgrade`.
*/}}
{{- define "finplan.migrationHookAnnotations" -}}
{{- if eq .Values.migrations.hookMode "helm" -}}
helm.sh/hook: post-install,pre-upgrade
helm.sh/hook-weight: "-5"
helm.sh/hook-delete-policy: before-hook-creation,hook-succeeded
{{- else -}}
argocd.argoproj.io/hook: Sync
argocd.argoproj.io/hook-delete-policy: BeforeHookCreation
argocd.argoproj.io/sync-wave: {{ .Values.argocd.syncWaves.migration | quote }}
{{- end -}}
{{- end -}}
