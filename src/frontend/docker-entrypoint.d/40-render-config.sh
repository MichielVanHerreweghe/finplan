#!/bin/sh
# Render the SPA runtime config from environment variables. Runs (as the unprivileged nginx
# user) before nginx starts; writes to a writable tmpfs so the root filesystem can stay
# read-only. nginx serves this file at /config.js (see nginx.conf).
set -eu

mkdir -p /tmp/frontend
cat > /tmp/frontend/config.js <<EOF
window.__APP_CONFIG__ = {
  OIDC_AUTHORITY: "${OIDC_AUTHORITY:-}",
  OIDC_CLIENT_ID: "${OIDC_CLIENT_ID:-}",
  OIDC_SCOPE: "${OIDC_SCOPE:-}"
};
EOF

echo "[40-render-config] wrote /tmp/frontend/config.js (authority=${OIDC_AUTHORITY:-<empty>})"
