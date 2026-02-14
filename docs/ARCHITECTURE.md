# Cloud Architecture & Cloud Run Deployment Model
Cloud Engineer Internship – GCP Architecture Phase

---

## 1. High-Level Architecture

Deployment flow:

Developer
  ↓
Build Docker Image
  ↓
Push to Artifact Registry
  ↓
Deploy to Cloud Run
  ↓
Users access service

Architecture components:

- Docker (containerization)
- Artifact Registry (image storage)
- Cloud Run (serverless execution)
- IAM (access control)
- Logging & Monitoring (observability)

---

## 2. What is Cloud Run?

Cloud Run is a fully managed serverless container platform.

It allows you to:

- Deploy Docker containers
- Auto-scale based on traffic
- Pay only for usage
- Avoid managing servers

Cloud Run runs stateless containers.

---

## 3. How Cloud Run Executes Containers

Flow:

1. Cloud Run pulls image from Artifact Registry
2. Creates container instance
3. Injects environment variables
4. Routes HTTP traffic to container
5. Scales instances automatically

Important:

Container must:
- Listen on 0.0.0.0
- Use the PORT environment variable
- Be stateless

---

## 4. Cloud Run Revisions

Each deployment creates a new Revision.

Revision properties:

- Immutable
- Versioned
- Can split traffic between revisions
- Can rollback to previous revision

Example:

Revision 1 → v1.0.0  
Revision 2 → v1.1.0  

Traffic split:
- 90% to v1.1.0
- 10% to v1.0.0

---

## 5. Auto Scaling Model

Cloud Run scales based on:

- Number of concurrent requests
- CPU usage
- Traffic volume

Scale to zero supported.

When no traffic:
- No running containers
- No cost

---

## 6. Stateless Design

Cloud Run containers must be stateless.

Not allowed:
- Storing data in local container filesystem
- Expecting persistent memory

Allowed:
- External database
- Cloud Storage
- External services

---

## 7. Public vs Private Services

Public service:
- Accessible via HTTPS endpoint
- Can allow unauthenticated access

Private service:
- Requires IAM authentication
- Used for internal microservices

---

## 8. Environment Variables & Secrets

Environment variables can be:

- Injected manually
- Loaded from Secret Manager
- Managed per revision

Never store secrets in Docker image.

---

## 9. Deployment Flow (Planned)

Future real flow:

1. Build image
2. Tag image
3. Push to Artifact Registry
4. Deploy to Cloud Run
5. Verify service URL
6. Monitor logs

---

## 10. Common Cloud Run Issues

Container not starting:
- Not listening on correct port
- Crashing on startup

Permission denied:
- Missing IAM role

Image not found:
- Wrong region
- Wrong registry URL

---

## 11. Final Target Architecture

User
  ↓ HTTPS
Cloud Run
  ↓
Container (Bun + Express)
  ↓
Logs → Cloud Logging
Metrics → Cloud Monitoring

---

End of Cloud Architecture Documentation
