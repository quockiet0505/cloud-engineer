# IAM (Identity & Access Management)
Cloud Engineer Internship – GCP Foundations

---

## 1. What is IAM?

IAM (Identity & Access Management) controls:

- Who can access resources
- What actions they can perform
- On which resources

IAM is based on:

Principal + Role + Permission

---

## 2. Core IAM Concepts

### Principal

An identity that can access resources.

Types:
- User (email account)
- Service Account (machine identity)
- Group

---

### Role

A collection of permissions.

Examples:
- Artifact Registry Writer
- Cloud Run Admin
- Viewer

Roles can be:
- Basic (Owner, Editor, Viewer)
- Predefined
- Custom

---

### Permission

A specific action.

Example:
- run.services.create
- artifacts.repositories.uploadArtifacts

---

### Policy

A mapping between:

Principal → Role

Policies define who has access to what.

---

## 3. Project Structure in GCP

Hierarchy:

Organization  
→ Folder  
→ Project  
→ Resources  

All resources belong to a project.

IAM can be applied at:
- Organization level
- Folder level
- Project level

Inheritance applies downward.

---

## 4. Service Accounts

Service Accounts are used by:

- CI/CD pipelines
- Cloud Run
- Virtual Machines
- Automation scripts

They represent machine identities.

---

## 5. Two Service Accounts We Will Use

### 1. Deployer Service Account

Used by:
- CI/CD
- Docker push
- Cloud Run deploy

Needs roles:
- Artifact Registry Writer
- Cloud Run Admin
- Service Account User

---

### 2. Runtime Service Account

Used by:
- Cloud Run service during execution

Needs roles:
- Logging Writer
- Monitoring Metric Writer

---

## 6. Principle of Least Privilege

Never assign:

Owner

To CI/CD or services.

Instead:
Assign only required roles.

This reduces security risk.

---

## 7. Authentication Flow (Theory)

User login:

gcloud auth login

Docker authentication:

gcloud auth configure-docker <region>-docker.pkg.dev

CI/CD authentication:
- Uses Service Account credentials
- Uses workload identity (recommended)

---

## 8. Common IAM Errors

Permission denied  
→ Missing role

Unauthenticated  
→ Not logged in

API not enabled  
→ Service API disabled

---

## 9. IAM Matrix (Planned Design)

| Principal            | Role                         | Purpose                |
|----------------------|------------------------------|------------------------|
| CI Service Account   | Artifact Registry Writer     | Push images            |
| CI Service Account   | Cloud Run Admin              | Deploy service         |
| Runtime Service SA   | Logging Writer               | Write logs             |
| Runtime Service SA   | Monitoring Metric Writer     | Export metrics         |

---

End of IAM Documentation
