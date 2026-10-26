# Implementation specification

## Modules and routes
Marketing /, /features, /pricing, /security, /contact, /privacy, /terms, /ai-policy.
Auth /sign-in, /sign-up, /auth/callback, /auth/error, /onboarding.
App /dashboard, /tenders, /tenders/new, /tenders/[id] with documents, requirements, responses, evidence, review, readiness, export tabs; /library; /evidence; /settings/organisation, team, usage, billing when enabled.

Keep callback path consistent across client, server and allowlists. Choose framework-supported cookie/session/proxy conventions for installed version. Thin routes/pages, domain services under src/features, server-only integrations, typed Zod validation, generated DB types and reproducible scripts.

## Data model — implement migrations, not just diagrams
UUIDs; non-null tenant ownership where applicable; timestamps/indexes; scoped uniqueness; database-enforced tenant-consistent parent references using composite keys or equivalently strong enforcement.
- organisations: name/slug/sector/lifecycle/retention.
- memberships: unique organisation/user, owner/admin/editor/viewer, active state. Atomic create-org/create-owner; no invalid default role or orphan ownership.
- tenders: buyer/reference/title/deadline/timezone/regime/applicability/lifecycle/creator.
- documents and versions: tenant/tender/private key/hash/type/size/source filename/parser version.
- processing_jobs: version/idempotency/attempts/states/error/timestamps.
- source_fragments: version/text/offset/section/page only if supported.
- requirements: source links/type/mandatory/evaluation/word-page limits/human confirmation/version.
- content blocks/versions: categories/tags/text/approval/reviewer/expiry.
- evidence/versions: private files/type/expiry/verification attestation.
- requirement_evidence: explicit tenant-consistent version links.
- responses/versions: one stable answer identity per requirement plus immutable versions, current pointer, content/author/AI metadata. Optimistic concurrency.
- response_sources: exact content/evidence/source versions used.
- reviews: human actor/decision/reviewed version/time/comment.
- readiness runs/results: input snapshot/checker version/status/rationale/stale flag.
- disclosure versions: tools/tasks/review attestations/training yes-no-unknown/source of statements.
- exports: exact response/run/disclosure versions, draft-final, format/hash/private key.
- audit events: protected append-oriented actor/action/entity/version/request/time; no confidential payloads.
- usage/entitlements: idempotent counts/quotas/pilot or billing state.

## Permissions
Viewer read only. Editor uploads/drafts/edits, cannot self-escalate. Admin manages team/content review as explicitly authorised. Owner manages organisation/billing. Default approver owner/admin; record any delegation. Solo SME self-review policy must be explicit, not silently require a second employee. RLS covers each tenant table and storage; test reads/inserts/updates/deletes. Privileged functions have restricted grants/search_path and verified identity. Do not use service-role as general tenant access.

## API contract conventions
Every protected route/action/job verifies session, membership and role; actor never comes from payload. Client org IDs are untrusted. Safe request IDs/errors, bounded schemas/body sizes, idempotency for costly actions. 401 unauthenticated; 403 forbidden; scoped 404 against enumeration; 409 stale edit; 413 size; 422 validation; 429 rate; 503 provider unavailable. Cross-site mutation defences.

Minimum endpoints:
POST /api/organisations {name,sector?} → atomic onboarding.
POST /api/tenders {title,buyer_name?,reference?,deadline?,timezone?} → verified tenant.
POST /api/tenders/:id/documents → validated private upload/finalisation.
POST /api/documents/:id/process → 202 persisted job; GET scoped status.
GET/POST/PATCH /api/tenders/:id/requirements → correction/confirmation/source refs.
POST /api/requirements/:id/draft {expected_requirement_version} → draft/job with citations.
PATCH /api/responses/:id {content,expected_version} → new version or 409.
POST /api/responses/:id/review {version,decision,comment?} → authorised review.
POST /api/tenders/:id/readiness → versioned snapshot run.
POST /api/tenders/:id/exports {format:docx|pdf,mode:draft|final,run_id?} → gated export job.
POST disclosure version → truthful validated attestations.
GET scoped export/evidence download → authorised short-lived link.
GET /api/health → liveness without sensitive diagnostics.

## Ingestion
Real PDF/DOCX, not pasted text alone. Verify signatures/MIME/size, safe filenames, resource/malware risks and hashing. Reject unsupported legacy formats clearly. Scan/OCR detection must return configured OCR or actionable needs_review, never empty-success. States uploaded/queued/processing/needs_review/completed/failed. Async long jobs, bounded retries/idempotency; no duplicate logical requirements. Preserve real provenance, no invented page numbers. User confirms extracted requirements.

## AI
Choose actual provider/model with verified availability/data terms and configure server-side. Tenant-filtered approved/current knowledge only; semantic retrieval/index dimensions depend on selected embedding model. Store exact sources/model/prompt version; show citations. Missing evidence → explicit gap, not invented certifications, statistics, names or commitments. Validate structured outputs, defend prompt injection, cap time/cost/rate/concurrency. Provider failures cannot be saved as valid answers. Human edits persist; approval ties to exact version and is invalidated after changed content. AI cannot approve or invoke privileged tools.

## Readiness/disclosure
Buyer-confirmed requirements drive checks: linked current evidence, limits, forms, approvals, unresolved blockers and deadlines/timezone. pass/fail/warning/not_checked/not_applicable with sources/rationale; unavailable checks are not passes. No arbitrary short-answer word threshold as a legal rule. Keep current run separate from history; mark stale on input edits. Counts use unique requirements/current versions. Disclosures distinguish yes/no/unknown; never assert no-training or human review without evidence.

## Export
Actual DOCX and PDF, independently validated. Correct tender/organisation metadata, reviewed response versions, relevant disclosure/checklist. Draft labels/missing items visible. Final export blocked by applicable missing approvals/failed or stale gates. Explain unsupported buyer-template fidelity/page checking. Store privately; no public document URLs; no automatic portal submission.
