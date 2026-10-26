# Security and data

RLS plus server authorisation; tenant-consistent database references; verify all operations/roles and private storage. Elevated Supabase keys bypass row restrictions and must be narrowly scoped server-only. Never put secrets in client bundles, logs, commits, screenshots or agent knowledge.

Secure cookie/session handling, cross-site mutation defences, safe redirects, validated inputs, scoped errors, rate/usage/concurrency controls, idempotency and conflict handling. Restrict privileged functions/search paths/grants. UI permissions are not security boundaries.

Private uploads: validate signature/type/size; safe paths; bounded parsing/malware risks; short-lived authorised downloads; delete/retention covering DB/objects/derived text/embeddings/exports with explicit backup limitations. No confidential documents in analytics. Use synthetic fixtures until authorised real-data testing.

AI: approve provider data flow/retention/training terms and region; disclose uncertainty; no blanket no-training guarantee. Untrusted document text cannot issue tool commands or approval. Store source versions and human attestations truthfully.

Operations: least-privilege IAM, rotation, alerts verified, protected audit metadata, no sensitive payloads. Specify DB and storage backup coverage separately; demonstrate isolated restore/rollback. Owner approves recovery objectives/retention, no invented SLA. Maintain incident/support ownership.

Privacy: map personal/confidential data and subprocessors; prepare privacy/terms/DPA/AI notices for review; do not claim legal sign-off or automatic GDPR compliance. Select analytics/cookies deliberately and review requirements. No fabricated certifications/testimonials.
