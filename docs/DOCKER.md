# Docker Fundamentals & Containerization
Cloud Engineer Internship – Week 1

---

## 1. Why Docker?

Docker packages:

- Application code
- Runtime (Bun)
- Dependencies
- System libraries

Into a portable container to ensure:

- Environment consistency
- Reproducible builds
- Faster deployment
- Simplified CI/CD

---

## 2. Core Concepts

### Image
- Immutable
- Layered
- Versioned using tags
- Blueprint for containers

### Container
- Running instance of an image
- Ephemeral by default
- Shares host OS kernel

### Registry
Storage system for images.

Example:
- Google Artifact Registry

---

## 3. Layer Caching Strategy

Optimized Dockerfile order:

1. COPY dependency files
2. Install dependencies
3. COPY application source

Behavior:

- If source changes → fast rebuild
- If dependencies change → reinstall (expected)

Improves CI/CD performance.

---

## 4. Multi-Stage Build

Purpose:

- Smaller runtime image
- No build tools in production
- Reduced attack surface
- Better security

Pattern:

FROM builder-image AS builder  
(build steps)

FROM slim-image  
COPY --from=builder ...

---

## 5. Project Implementation (Bun + Express)

### Stack

- Bun runtime
- Express API
- /health endpoint

### Project Structure

cloud-engineer/
├── app/
│   ├── src/
│   ├── package.json
│   └── bun.lockb
├── Dockerfile
├── .dockerignore
└── docs/

---

## 6. Dockerfile Used

```dockerfile
# Stage 1 – Builder
FROM oven/bun:1.1.45 AS builder
WORKDIR /app

COPY app/package.json app/bun.lockb* ./
RUN bun install --frozen-lockfile

COPY app/src ./src

# Stage 2 – Runtime
FROM oven/bun:1.1.45-slim
WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["bun", "src/server.js"]
```

---

## 7. Essential Commands

Build image:

docker build -t cloud-engineer:v1 .

Run container:

docker run -p 8080:3000 cloud-engineer:v1

Check running containers:

docker ps

View logs:

docker logs <container_id>

Enter container:

docker exec -it <container_id> sh

---

## 8. Image Versioning Strategy

Avoid relying only on `latest`.

Use Semantic Versioning:

cloud-engineer:1.0.0  
cloud-engineer:1.0.1  
cloud-engineer:latest  

Future Artifact Registry format:

region-docker.pkg.dev/project-id/repo/cloud-engineer:1.0.0

Benefits:

- Rollback capability
- Version traceability
- CI/CD stability

---

## 9. Artifact Registry Flow (Theory)

1. Build image
2. Tag with registry format
3. Authenticate Docker
4. Push image
5. Deploy from registry

Authentication:

gcloud auth configure-docker <region>-docker.pkg.dev

Required IAM roles:

- Artifact Registry Writer
- Artifact Registry Reader

---

## 10. Release & Rollback Strategy

Release:

1. Update code
2. Build image
3. Tag with semantic version
4. Push to registry
5. Deploy

Rollback:

- Redeploy previous version tag
- Never rely only on `latest`

---

## 11. Key Lessons Learned

- Layer order affects build speed
- Multi-stage improves security
- Version pinning prevents instability
- Use .dockerignore
- Do not copy node_modules from host
- Do not use floating base image tags

---

End of Docker Phase Documentation
