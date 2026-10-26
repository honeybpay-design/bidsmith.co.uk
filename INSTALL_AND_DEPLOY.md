# Installation and deployment runbook

## Workspace
Open extracted bidsmith.co.uk in VS Code. Read root documents. Inspect git status, files and actual tools. Check node/npm/git versions when available; select currently supported runtime compatible with Next.js/Firebase adapter. Inspect existing code before modifying. If only documentation, scaffold in this root safely, retaining documents; a temporary scaffold-and-merge is acceptable. No nested project folder.

Implement actual package scripts, dependencies/lockfile, application/config/migrations/tests. Do not pin an old framework simply because an example used it. Use package name bidsmith.co.uk; adapt cloud identifiers only where service syntax requires, recording mapping.

## Development configuration
Copy templates/.env.example to ignored .env.local. Use only selected provider variables. Never ask for values in chat. Implement typed environment validation and informative missing-provider states. Add .gitignore before secrets or builds. A template is not runnable application configuration.

## Supabase
Inspect existing authorised resources. Obtain approval for creating resources or paid activation. Select isolated development project/region and record actual ID. Implement complete migrations with constraints/RLS/storage, seed synthetic fixtures, test clean install and upgrade. Use supported CLI workflow and verify target before writes. Do not apply migrations twice through both SQL editor and CLI. Local Supabase may need Docker; check prerequisite.

Set actual URL/publishable key (or supported legacy anon key per implementation). Elevated keys server-only and narrowly justified. Generate DB types. Test role policies with authenticated tokens rather than admin-only queries.

## Google sign-in
Use intended actual Google Cloud/Firebase project, avoid duplicate provisioning. Configure consent/audience/branding and web OAuth client. Use exact provider callback shown by Supabase for Google's redirect URI; set client ID/secret in Supabase provider. Application /auth/callback is distinct from provider /auth/v1/callback. Set exact local/staging allowlists and actual site URL. Configure testing/publishing audience appropriately. Verify login, refresh, logout and redirect validation.

## Local checks
After real scripts exist: install via lockfile, run lint/typecheck/unit/DB/E2E/build as implemented; save observed output. Missing credentials block live integration, not all local code development. Do not mock cloud configuration silently.

## Firebase App Hosting staging
Verify actual project, supported region/runtime/framework, billing and IAM. Obtain approval before billable provisioning/cloud changes. Connect actual GitHub repository/root/branch securely. Use App Hosting, not static hosting instructions. Inspect rollout policy to prevent accidental production deployments.

Implement actual apphosting.yaml based on verified schema; templates/apphosting.example.yaml is illustrative. Separate BUILD/RUNTIME public variables; configure Secret Manager references and least-privilege secret access. No raw secret values in YAML. Use actual console backend URL, no invented patterns. Update exact callback allowlist and test real staging journey/job execution.

## Production
Prepare isolated secrets/data, reviewed migrations, restore/rollback plan, operational alerts, entitlements and owner-approved legal/commercial details. Owner approves exact deployment/migration target and timing. Verify actual production endpoint and smoke tests. Budget alerts notify; scaling/provider caps are separate controls and not perfect universal spend caps.

## Domain connection
Connecting bidsmith.co.uk is a separate approved deployment step. Inspect DNS first, back up records, follow current Firebase App Hosting verification/certificate process, use exact supplied records and verified proxy requirements. Preserve email/unrelated records. Update auth allowlists before connection. Request approval for exact DNS edits, verify HTTPS/canonical host/login/uploads/AI/exports, monitor and retain recovery configuration.

## Handover
Record actual repository/branch/commit, resource-ID mappings, scripts, safe configuration locations, test evidence, known risks and exact next action. Never include secrets.
