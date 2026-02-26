#!/bin/bash
apt-get update
apt-get install -y docker.io 
systemctl enable docker
systemctl start docker
gcloud auth configure-docker asia-southeast1-docker.pkg.dev --quiet
docker swarm init || true

# --- SETUP MONITORING (GRAFANA + PROMETHEUS) ---
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
  prometheus:
    image: prom/prometheus:latest
    ports:                   
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    deploy:
      resources:
        limits:
          memory: 256M
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
    deploy:
      resources:
        limits:
          memory: 128M
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    deploy:
      resources:
        limits:
          memory: 256M
EOF

docker stack deploy -c docker-compose.yml obs_stack