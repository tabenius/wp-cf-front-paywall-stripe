# OSS Scope Manifest (wp-cf-front)

## Goal
Define a practical open-source baseline for `wp-cf-front` while keeping private/exploratory work out of this repository.

## OSS v1 Scope (Keep)
- Headless WordPress storefront rendering via WPGraphQL with runtime fallback logic.
- Authentication and user session flows (email/password and optional OAuth providers).
- Stripe checkout and webhook-based access granting for protected content and digital products.
- Admin operations needed to run storefront basics: health, products, pricing/VAT, storage, uploads, support basics.
- Combined media library baseline (WordPress + R2 listing/upload/edit metadata) as currently implemented in this repo.
- Cloudflare Workers deployment and build scripts.
- WordPress companion plugin in `packages/ragbaz-articulate-plugin/`.

## Private/Experimental Scope (Do Not Include)
- Tenant-specific overrides and customer hardcoding.
- Companion control-plane services and phone-home workflows.
- Social/avatar/feed protocols and related profile graphs.
- AI-assisted admin features (chat/image generation) if productized separately.
- Internal collaboration logs and agent-specific local workflows.

## Hard Exclusions Applied In This Repo
The following paths were removed from repository history:
- `AGENTS.md`
- `claude+codex-coop.md`
- `.claude/agents/edge-runtime-reviewer.md`
- `.claude/settings.json`
- `.claude/skills/cf-tail/SKILL.md`
- `.claude/skills/i18n-sync/SKILL.md`

## Strict Bare-Essentials Pass (Applied)
The following AI/chat paths were removed in the strict OSS pass:
- `src/app/api/chat/`
- `src/app/api/admin/generate-image/`
- `src/lib/ai.js`
- `src/lib/chat/`
- `src/components/admin/ChatPanel.js`
- `src/components/admin/ChatMessage.js`
- `src/components/admin/ChatMarkdown.js`
- `src/components/admin/ImageGenerationPanel.js`
- `src/lib/adminImageGenerationState.js`
- related feature tests under `tests/` for these modules

Admin navigation was rewired to remove the Chat tab and all dependent tab wiring.

## History-Safe Extraction Process
Use this process when creating future public cuts from a private source repo:
1. Clone only `main` to an isolated directory.
2. Rewrite history for explicit excludes using index-filter.
3. Remove remote refs/backups and run aggressive gc.
4. Verify stripped paths are absent in both current tree and full history.
5. Push only the rewritten branch to the public remote.
