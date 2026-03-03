#!/bin/bash
apt-get update
apt-get install -y docker.io 
systemctl enable docker
systemctl start docker
gcloud auth configure-docker asia-southeast1-docker.pkg.dev --quiet
docker swarm init || true

docker network create -d overlay --attachable app_network || true
