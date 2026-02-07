---
id: 1
title: Create-project-constitution
stage: constitution
date: 2026-02-07
surface: agent
model: Qwen
feature: Hackathon-II-Evolution-of-Todo
branch: main
user: User
command: /sp.constitution
labels: [constitution, hackathon, todo, spec-driven-development]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

```
/sp.constitution

Project: Hackathon II – Evolution of Todo (Phase II: Full-Stack Web Application)

Core principles:
- Spec-Driven Development: All features must be defined in specs before implementation
- AI-Native Workflow: No manual coding, only Claude Code + Spec-Kit Plus outputs
- Security: JWT-based authentication with Better Auth, enforcing user isolation
- Scalability: Monorepo organization for frontend + backend, cloud-ready architecture
- Usability: Responsive UI with Next.js, Tailwind CSS, and clean API design

Key standards:
- All CRUD features (Add, Delete, Update, View, Mark Complete) implemented via REST API
- Authentication enforced on every endpoint (JWT required)
- Database persistence using Neon Serverless PostgreSQL with SQLModel ORM
- Monorepo structure with organized specs (/specs/features, /specs/api, /specs/database, /specs/ui)
- Frontend API client must attach JWT token in headers for every request
- Backend must verify JWT signature using shared secret (BETTER_AUTH_SECRET)
- Deliverables include Constitution file, specs history, CLAUDE.md files, and working app

Constraints:
- No manual coding allowed (spec refinement until Claude Code generates correct output)
- Frontend: Next.js 16+, TypeScript, Tailwind CSS
- Backend: FastAPI, SQLModel, Neon DB
- Authentication: Better Auth with JWT
- Deployment: Vercel (frontend), Docker Compose (local dev)
- Demo video ≤ 90 seconds

Success criteria:
- All CRUD operations functional and secured by JWT
- Multi-user isolation enforced (each user sees only their tasks)
- Specs complete and traceable in /specs folder
- Monorepo organized with CLAUDE.md files guiding implementation
- Working web app deployed and accessible via Vercel
- GitHub repo includes Constitution, specs, source code, and README
```

## Response snapshot

The constitution has been successfully created with all the required elements. Here's the final summary:

## Constitution Creation Summary

**New Version**: 1.0.0 (Initial release)
**Bump Rationale**: This is the initial version of the constitution for the Hackathon II project, establishing the foundational principles and guidelines.

**Files Updated**:
- `.specify/memory/constitution.md` - Created with the complete constitution

**Constitution Highlights**:
- Six core principles established covering Spec-Driven Development, AI-Native Workflow, Security-First Approach, Scalability by Design, Usability and Accessibility, and Test-Driven Development
- Technical Standards section outlining CRUD operations, database persistence, and authentication requirements
- Development Workflow section specifying the monorepo structure and technology stack
- Governance section establishing compliance and amendment procedures

**Follow-up Actions Required**:
- Update dependent templates: `.specify/templates/plan-template.md`, `.specify/templates/spec-template.md`, and `.specify/templates/tasks-template.md` to align with the new constitution principles
- Ensure all future development activities comply with the established principles

**Suggested Commit Message**: `docs: add project constitution v1.0.0 for Hackathon II`

The constitution is now ready for use and will guide all development activities for the Hackathon II project.

## Outcome

- ✅ Impact: Created the foundational constitution file for the Hackathon II project
- 🧪 Tests: none
- 📁 Files: 1 file created (.specify/memory/constitution.md)
- 🔁 Next prompts: Continue with spec creation based on the constitution
- 🧠 Reflection: The constitution successfully captures all specified principles and requirements

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin creating feature specifications based on the constitution