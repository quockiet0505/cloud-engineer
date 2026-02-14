# Networking & Security Foundations
Cloud Engineer Internship – Networking Phase

---

## 1. Cloud Networking Overview

In cloud environments, networking controls:

- How services communicate
- Who can access services
- How traffic flows
- How resources are isolated

Even serverless platforms like Cloud Run rely on networking rules.

---

## 2. Public vs Private Services

### Public Service

- Accessible via HTTPS endpoint
- Can allow unauthenticated access
- Used for public APIs

Example:
https://service-xyz.run.app

---

### Private Service

- Requires IAM authentication
- Not accessible publicly
- Used for internal microservices

Best practice:
Default to private unless public access is required.

---

## 3. VPC (Virtual Private Cloud)

VPC is a logically isolated network inside GCP.

It controls:

- IP ranges
- Subnets
- Routing rules
- Firewall rules

Cloud Run can connect to VPC using Serverless VPC Connector.

---

## 4. Ingress & Egress

### Ingress

Incoming traffic to service.

Cloud Run ingress settings:

- Allow all
- Internal only
- Internal + Load Balancer

---

### Egress

Outgoing traffic from service.

Cloud Run egress options:

- All traffic
- Private ranges only
- None

---

## 5. Firewall Rules

Firewall rules control:

- Allowed protocols
- Allowed IP ranges
- Port access

Although Cloud Run is serverless,
firewall rules matter when connecting to VPC resources.

---

## 6. Zero Trust Model

Modern cloud security follows:

"Never trust, always verify"

Every request must:

- Be authenticated
- Be authorized

Even internal services require IAM permission.

---

## 7. Identity-Based Access

Instead of IP-based access,
Cloud Run can use:

IAM-based authentication.

Access granted based on:

- Service Account
- Assigned roles
- Identity tokens

---

## 8. Securing Cloud Run

Security best practices:

- Disable unauthenticated access (if not needed)
- Use least privilege IAM
- Restrict ingress settings
- Use HTTPS only
- Do not expose secrets in logs

---

## 9. Private Service-to-Service Communication

Flow:

Service A
  ↓ (Authenticated request)
Service B (Cloud Run)

Authentication via:

- Identity tokens
- Service account credentials

No shared secrets required.

---

## 10. Common Networking Mistakes

- Leaving service publicly accessible by default
- Hardcoding internal IP addresses
- Allowing broad firewall rules
- Ignoring IAM invocation permissions

---

## 11. Target Secure Architecture

User
  ↓ HTTPS
Cloud Run (Public API)
  ↓ IAM Auth
Internal Cloud Run (Private Service)
  ↓
Database / Storage

All secured by IAM and network controls.

---

End of Networking Documentation
