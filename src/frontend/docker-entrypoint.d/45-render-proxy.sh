#!/bin/sh
# Render the GraphQL reverse-proxy location from environment. The API is NOT exposed through
# the gateway; the SPA calls same-origin /graphql and nginx proxies it to the in-cluster API
# Service. Runs (as the unprivileged nginx user) before nginx starts; writes to a writable
# tmpfs so the root filesystem can stay read-only. nginx includes this file (see nginx.conf).
set -eu

: "${API_UPSTREAM:?API_UPSTREAM must be set (e.g. http://finplan-api:8080)}"

mkdir -p /tmp/frontend
cat > /tmp/frontend/proxy.conf <<EOF
location /graphql {
    proxy_pass ${API_UPSTREAM};
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;

    # GraphQL incremental delivery / subscriptions arrive as text/event-stream or
    # multipart/mixed: stream responses straight through instead of buffering, and don't
    # forward a hop-by-hop Connection header so SSE stays open.
    proxy_set_header Connection "";
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
EOF

echo "[45-render-proxy] wrote /tmp/frontend/proxy.conf (upstream=${API_UPSTREAM})"
