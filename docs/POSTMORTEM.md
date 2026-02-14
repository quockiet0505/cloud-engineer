# Incident Postmortem Template
Cloud Engineer Internship – Production Readiness

---

## 1. Incident Summary

Brief description of what happened.

Example:
Cloud Run service returned 500 errors after deployment.

---

## 2. Timeline

Time | Event
-----|-------
10:00 | Deployment started
10:02 | Error rate increased
10:05 | Alert triggered
10:10 | Rollback initiated
10:15 | Service restored

---

## 3. Impact

- Duration of outage
- Number of affected users
- Business impact

---

## 4. Root Cause

Describe the technical reason.

Example:
Incorrect environment variable caused application crash.

---

## 5. Resolution

What was done to fix the issue?

Example:
Rolled back to previous stable Docker image version.

---

## 6. Preventive Actions

What changes will prevent recurrence?

- Add pre-deployment validation
- Improve monitoring alerts
- Add automated tests

---

## 7. Lessons Learned

- Always verify environment variables
- Do not rely only on latest tag
- Monitor logs immediately after deployment

---

## 8. Follow-Up Tasks

- Update CI/CD validation
- Improve documentation
- Review IAM policies

---

End of Postmortem Template
