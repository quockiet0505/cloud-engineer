#!/bin/bash
apt-get update
apt-get install -y docker.io 
systemctl enable docker
systemctl start docker
gcloud auth configure-docker asia-southeast1-docker.pkg.dev --quiet
docker swarm init || true

docker network create -d overlay app_network || true

# --- SETUP STACK: MONITORING & DATABASE ---
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
  # 1. Self-Hosted PostgreSQL (Internal Only - No Ports Exposed)
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: adminpassword
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data 
    networks:
      - app_network
    deploy:
      resources:
        limits:
          memory: 128M

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
    ports:
      - "3001:3000" 
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    networks:
      - app_network
    deploy:
      resources:
        limits:
          memory: 128M

  # internet and volume
networks:
  app_network:
    external: true

volumes:
  pgdata:
EOF

docker stack deploy -c docker-compose.yml core_stack