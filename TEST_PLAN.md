# Verification plan

Create real scripts for lint, typecheck, unit tests, DB/RLS integration, E2E and build compatible with actual dependencies. Label mock versus live integrations. Record commit/environment/command/output/status in records/TEST_EVIDENCE.md. No application tests have been run by this documentation pack.

AUTH: anonymous access denied; Google callback/session refresh/logout; unsafe redirect blocked; onboarding atomic.
TENANT: independent organisations A/B; owner/admin/editor/viewer operations; guessed IDs; direct DB/storage; cross-tenant parent refs; no self-escalation/orphan ownership.
DOCUMENT: real PDF/DOCX, scans handled explicitly, malformed/mislabelled/oversize denial, safe resource limits, idempotent retries, private links.
REQUIREMENTS: source locations real, corrections saved, confirmation required, duplicates prevented, versions tracked.
AI: approved same-tenant sources only, missing evidence flagged, exact citations, timeout/misconfiguration, prompt injection, usage limits, errors not saved as success.
REVIEW: refresh persistence, concurrent-save conflicts, AI cannot approve, changed versions invalidate approval, predictable current answer.
READINESS: unrelated files don't fulfil attachments, expired evidence, stale runs, unsupported checks not passed, word limits/timezone boundaries, unique requirement counts.
EXPORT: actual DOCX/PDF parsed/opened, expected contents and versions, final gate blocks missing/stale approval, draft labels, no secrets/internal logs.
DISCLOSURE: yes/no/unknown distinct, truthful review/training statements, correct exported version.
OPERATIONS: secret/dependency scanning, alert delivery, restore of defined DB/storage scope, rollback, retention/deletion.
COMMERCIAL: pilot/entitlement limits; if payments, verified/idempotent webhooks, scoped customer mapping, cancellation/refund/entitlement handling.

Staging journey: fresh synthetic user → Google login → organisation → tender → upload → processing → confirm requirements → approved content/evidence → real configured provider draft → edit/save/refresh/review → readiness → DOCX/PDF → sign out. Repeat cross-tenant denials. Mocks cannot substitute for this evidence.

Define performance/resource targets during Phase 0 based on agreed fixtures and measured baseline. Do not invent benchmarks. A build or 100% of a weak test suite is not production approval.
