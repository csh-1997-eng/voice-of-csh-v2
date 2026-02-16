# Codex Agent Configuration

**Core Rules:** `rules/BASE_RULES.md` — Always read this first.

**Skills Library:** `rules/skills/` contains specialized workflows:
- `security_audit.md` - Security-focused reviews
- `prototyping.md` - Rapid prototyping mode
- `ui_design.md` - UI/UX implementation
- `database_design.md` - Database architecture
- `testing.md` - Testing patterns
- `production.md` - Production operations

**Project Config:** `AI_RULES.md` defines dependency rules, diff policies, and repo-specific commands.

**How to Use Skills:** Load skills as needed based on task type. For example, when reviewing authentication code, read BASE_RULES.md + security_audit.md. When building a quick demo, read BASE_RULES.md + prototyping.md.