<!-- SYNC IMPACT REPORT:
Version change: N/A -> 1.0.0
Modified principles: None (new constitution)
Added sections: All principles and sections
Removed sections: None
Templates requiring updates: ⚠ pending - .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md
Follow-up TODOs: None
-->

# Hackathon II – Evolution of Todo Constitution

## Core Principles

### I. Spec-Driven Development
All features must be defined in specs before implementation. Every functionality begins with a comprehensive specification document that outlines requirements, acceptance criteria, and implementation approach before any code is written.

### II. AI-Native Workflow
No manual coding allowed - only Claude Code + Spec-Kit Plus outputs. All development must be driven through AI-assisted tools and automated generation from specifications, with manual coding reserved only for exceptional circumstances with proper justification.

### III. Security-First Approach
JWT-based authentication with Better Auth, enforcing strict user isolation. All endpoints must require authentication, with proper authorization checks to ensure users can only access their own data.

### IV. Scalability by Design
Monorepo organization for frontend + backend, with cloud-ready architecture. Systems must be designed to scale horizontally with minimal configuration changes and support cloud-native deployment patterns.

### V. Usability and Accessibility
Responsive UI with Next.js, Tailwind CSS, and clean API design. All interfaces must be intuitive, responsive, and accessible, with APIs designed for ease of use and clear documentation.

### VI. Test-Driven Development
All CRUD operations must be tested before implementation. Every feature requires comprehensive test coverage including unit, integration, and end-to-end tests before being considered complete.

## Technical Standards
All CRUD features (Add, Delete, Update, View, Mark Complete) implemented via REST API. Database persistence using Neon Serverless PostgreSQL with SQLModel ORM. Frontend API client must attach JWT token in headers for every request. Backend must verify JWT signature using shared secret (BETTER_AUTH_SECRET).

## Development Workflow
Monorepo structure with organized specs (/specs/features, /specs/api, /specs/database, /specs/ui). All deliverables include Constitution file, specs history, CLAUDE.md files, and working application. Frontend: Next.js 16+, TypeScript, Tailwind CSS. Backend: FastAPI, SQLModel, Neon DB. Authentication: Better Auth with JWT.

## Governance
This constitution governs all development activities for the Hackathon II project. All implementations must comply with these principles. Amendments require documentation of rationale and approval from project leadership. All PRs/reviews must verify constitutional compliance.

**Version**: 1.0.0 | **Ratified**: 2026-02-07 | **Last Amended**: 2026-02-07
