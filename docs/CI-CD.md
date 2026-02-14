# CI/CD Pipeline & Automation
Cloud Engineer Internship – Deployment Automation Phase

---

## 1. What is CI/CD?

CI = Continuous Integration  
CD = Continuous Deployment (or Delivery)

CI/CD automates:

- Build
- Test
- Containerization
- Push image
- Deployment

Goal:
Reduce manual steps and deployment errors.

---

## 2. CI vs CD

### Continuous Integration (CI)

Automatically:

- Runs on every push
- Installs dependencies
- Builds Docker image
- Runs tests

Ensures code does not break main branch.

---

### Continuous Deployment (CD)

Automatically:

- Pushes Docker image to registry
- Deploys to Cloud Run
- Updates revision

No manual server interaction required.

---

## 3. Planned CI/CD Architecture

Developer pushes code
        ↓
GitHub
        ↓
GitHub Actions
        ↓
Build Docker image
        ↓
Tag image with version
        ↓
Push to Artifact Registry
        ↓
Deploy to Cloud Run

---

## 4. GitHub Actions Workflow Design

We will have:

.github/workflows/ci.yml  
.github/workflows/cd.yml  

---

## 5. CI Workflow Responsibilities

CI will:

1. Checkout repository
2. Install Bun
3. Build Docker image
4. Tag image
5. Run tests (optional)

Example logic:

- Trigger: push to main
- Validate build success

---

## 6. CD Workflow Responsibilities

CD will:

1. Authenticate with GCP
2. Configure Docker authentication
3. Push image to Artifact Registry
4. Deploy to Cloud Run
5. Output deployed service URL

---

## 7. Secrets Management

Never store secrets in repository.

GitHub Secrets will store:

- GCP Project ID
- Service Account credentials
- Region
- Registry URL

Example:

GCP_PROJECT_ID  
GCP_SA_KEY  
REGION  

---

## 8. Image Versioning in CI/CD

Version strategy:

Option 1: Semantic version (manual bump)  
Option 2: Git commit SHA  
Option 3: Timestamp-based version  

Recommended:

- Tag with semantic version
- Also tag with commit SHA for traceability

Example:

cloud-engineer:1.0.0  
cloud-engineer:sha-abc123  

---

## 9. Rollback Strategy

Rollback options:

- Redeploy previous Cloud Run revision
- Re-deploy previous Docker image tag

Never rely only on:

latest

Always keep versioned tags.

---

## 10. CI/CD Failure Scenarios

Build failure:
- Dependency issue
- Docker build error

Push failure:
- Authentication issue
- Missing IAM role

Deploy failure:
- Wrong image URL
- API not enabled

---

## 11. Security Best Practices

- Use least privilege service account
- Avoid static service account keys if possible
- Rotate credentials regularly
- Use Workload Identity in production

---

## 12. Final Automated Flow (Target State)

Code push
  ↓
CI build & validate
  ↓
CD push image
  ↓
Deploy to Cloud Run
  ↓
Traffic routed to new revision
  ↓
Monitor logs & metrics

---

End of CI/CD Documentation
