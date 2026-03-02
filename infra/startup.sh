#!/bin/bash
apt-get update
apt-get install -y docker.io 
systemctl enable docker
systemctl start docker
gcloud auth configure-docker asia-southeast1-docker.pkg.dev --quiet
docker swarm init || true

docker network create -d overlay --attachable app_network || true

#  SETUP STACK: MONITORING & DATABASE 
mkdir -p /root/monitoring
cd /root/monitoring

cat << 'EOF' > prometheus.yml
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node-exporter:9100']
EOF

cat << 'EOF' > docker-compose.yml
version: '3.8'

services:
  # 0. Traefik Reverse Proxy
  traefik:
    image: traefik:v3.6
    command:
      - "--api.insecure=true"
      - "--providers.swarm.endpoint=unix:///var/run/docker.sock"
      - "--providers.swarm.watch=true"
      - "--providers.swarm.exposedbydefault=false"
      - "--providers.swarm.network=app_network"
      - "--entrypoints.web.address=:80"
    ports:
      - target: 80
        published: 80
        protocol: tcp
        mode: host
      - target: 8080
        published: 8080
        protocol: tcp
        mode: host
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - app_network
    deploy:
      placement:
        constraints:
          - node.role == manager

  # 1. Self-Hosted PostgreSQL (PITR Enabled)
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: adminpassword
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data
      - wal_archive:/var/lib/postgresql/wal_archive
    command: >
      postgres
      -c wal_level=replica
      -c archive_mode=on
      -c archive_timeout=60
      -c archive_command='test ! -f /var/lib/postgresql/wal_archive/%f && cp %p /var/lib/postgresql/wal_archive/%f'
      -c max_wal_senders=3
      -c wal_keep_size=128MB
    networks:
      - app_network

  # 2. Prometheus (Internal Only)
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    networks:
      - app_network
    deploy:
      resources:
        limits:
          memory: 128M

  # 3. Node Exporter (Internal Only)
  node-exporter:
    image: prom/node-exporter:latest
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - app_network
    deploy:
      resources:
        limits:
          memory: 64M

  # 4. Grafana 
  grafana:
    image: grafana/grafana:latest
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      # configure grafana 
      - GF_SERVER_ROOT_URL=%(protocol)s://%(domain)s:%(http_port)s/grafana/
      - GF_SERVER_SERVE_FROM_SUB_PATH=true
    volumes:
      - grafana_data:/var/lib/grafana  # save data
    networks:
      - app_network
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.grafana.rule=PathPrefix(`/grafana`)"
        - "traefik.http.services.grafana.loadbalancer.server.port=3000"
      resources:
        limits:
          memory: 512M 

networks:
  app_network:
    external: true

volumes:
  pgdata:
  grafana_data:
  wal_archive:

EOF

docker stack deploy -c docker-compose.yml core_stack 