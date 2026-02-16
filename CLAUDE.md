# Claude Code Configuration

**Primary Rules:** Read `rules/BASE_RULES.md` for all tasks.

**Specialized Skills:** Available in `rules/skills/` directory. Load relevant skills based on task context:
- `security_audit.md` - Security reviews, vulnerability scanning
- `prototyping.md` - Fast iteration, proof-of-concept builds
- `ui_design.md` - Interface design and styling
- `database_design.md` - Schema design, migrations, queries
- `testing.md` - Test strategy and implementation
- `production.md` - Deployment, monitoring, alerts

**Project-Specific Rules:** See `AI_RULES.md` for dependency policies, output format requirements, and repo commands.

**Skill Selection:** If your task involves security, read `security_audit.md`. If prototyping, read `prototyping.md`. If uncertain which skill applies, start with BASE_RULES.md only and ask for clarification.