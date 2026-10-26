# bidsmith.co.uk — New Project Delivery Pack

Version 3.0 | 24 October 2026 | Owner: Donny

## Status and purpose
This is a NEW project named bidsmith.co.uk. This package contains the implementation specification, agent instructions, launch plan and configuration templates. It is not a finished application or an automatic installer. No application tests, cloud resources or deployment have been verified by preparing this pack.

## Start here — VS Code
1. Extract the ZIP. Open the extracted bidsmith.co.uk folder in VS Code.
2. Keep all files together. They are already in the correct root; do not move them into another nested project folder.
3. Open your execution-capable coding agent and paste the contents of AGENT_PROMPT.txt.
4. The agent reads the root instructions/specifications, inventories tools and begins Phase 0, then creates the real application in this root.
5. If application files already exist, the agent inspects them first and preserves work. Do not overwrite uncommitted files.
6. Credentials belong in secure local/cloud configuration, not chat.

## Project identity
Display name and workspace folder: bidsmith.co.uk.
Use npm package name bidsmith.co.uk (valid lowercase package identifier); the agent must check tooling compatibility and document any internal-only resource-name adaptation. Google Cloud project IDs, backend IDs and repository names have their own naming/uniqueness constraints; do not assume the display name can be used unchanged for every cloud identifier. Inspect existing authorised resources before creating anything.

## Architecture
Next.js App Router, React, TypeScript and Tailwind. Firebase App Hosting. Supabase PostgreSQL/Auth/private Storage/RLS. Google OAuth through Supabase. GitHub for source control. Configurable server-side AI provider. No alternative hosting/database/auth substitutions without owner approval.

## Product
Supplier-side UK public-sector tender response preparation: document intake, source-linked requirements, approved company knowledge, evidence-backed drafts, human review, readiness and genuine DOCX/PDF exports. Support compliance readiness under applicable Procurement Act 2023 requirements; never guarantee legal compliance or wins.

## Read order
AGENTS.md → PROJECT_BRIEF.md → IMPLEMENTATION_SPEC.md → TASKS.md → TEST_PLAN.md → INSTALL_AND_DEPLOY.md → SECURITY_AND_DATA.md → PROCUREMENT_POLICY.md → GO_TO_MARKET.md → RELEASE_CHECKLIST.md.

## Execution state
All work is initially PLANNED or UNVERIFIED. Use PLANNED / IMPLEMENTED / VERIFIED / BLOCKED. Actual checks must be recorded against commit/environment. A build alone is not production readiness.

## Structure after implementation (proposed)
Application source under src/, migrations under supabase/migrations/, tests under tests/, operational documentation under docs/. Keep this initial documentation accessible and update references if reorganised. Templates are examples, not live root configuration.

## Rights
No public source-code licence has been selected by the owner. Do not infer permission to publish or choose a licence silently. Verify third-party dependency licences.
