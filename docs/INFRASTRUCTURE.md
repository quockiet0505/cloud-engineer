# Infrastructure as Code (IaC)
Cloud Engineer Internship – Infrastructure Phase

---

## 1. What is Infrastructure as Code?

Infrastructure as Code (IaC) is the practice of managing
cloud infrastructure using code instead of manual console operations.

Instead of:
- Clicking in GCP Console
- Manually creating resources

We define infrastructure in code and deploy it consistently.

---

## 2. Why IaC?

Benefits:

- Reproducibility
- Version control
- Environment consistency
- Automated deployments
- Reduced human error
- Easy rollback

Without IaC:
Infrastructure drift occurs.

---

## 3. Declarative vs Imperative

### Imperative

Step-by-step instructions:

"Create VPC"
"Create Cloud Run"
"Attach IAM role"

Example:
Manual CLI commands

---

### Declarative

Define desired state:

"I want a Cloud Run service with this image and these permissions."

The system ensures that state.

IaC tools are usually declarative.

---

## 4. Tools for IaC

Common tools:

- Terraform
- Pulumi
- Cloud Deployment Manager
- SST (Serverless Stack)

In this internship plan, we will use:

SST (TypeScript-based IaC)

---

## 5. Infrastructure Components in This Project

Planned infrastructure:

- Artifact Registry repository
- Cloud Run service
- Service Accounts
- IAM bindings
- Logging & Monitoring setup

All defined as code.

---

## 6. Environment Strategy

We should support multiple environments:

- dev
- staging
- production

Each environment should have:

- Separate Cloud Run service
- Separate image tags
- Separate configuration
- Isolated IAM policies

---

## 7. Naming Convention Strategy

Consistent naming improves clarity.

Example:

cloud-engineer-dev  
cloud-engineer-staging  
cloud-engineer-prod  

Repository naming:

app-repo-dev  
app-repo-prod  

---

## 8. State Management

IaC tools maintain state of deployed infrastructure.

State ensures:

- What is deployed
- What changed
- What needs updating

State must be stored securely.

---

## 9. Deployment Flow with IaC

Code change
  ↓
Commit to Git
  ↓
CI/CD pipeline
  ↓
Deploy infrastructure changes
  ↓
Deploy new application version
  ↓
New revision active

---

## 10. Drift Prevention

Manual changes in Console should be avoided.

If someone modifies infrastructure manually:
- IaC state becomes inconsistent
- Hard to reproduce environment

Best practice:
All changes via code only.

---

## 11. Security in IaC

- Avoid hardcoded secrets
- Use Secret Manager
- Use least privilege IAM
- Review changes before deployment

---

## 12. Final Target Architecture (After IaC)

Infrastructure defined in code:
- Artifact Registry
- Cloud Run
- IAM
- Logging
- Monitoring

Application deployment fully automated.

---

End of Infrastructure Documentation
