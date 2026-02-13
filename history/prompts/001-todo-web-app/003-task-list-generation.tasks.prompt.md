---
id: "003"
title: "Task List Generation"
stage: "tasks"
date_iso: "2026-02-13"
surface: "agent"
model: "Claude 3.5 Sonnet"
feature: "001-todo-web-app"
branch: "001-todo-web-app"
user: "user"
command: "/sp.tasks"
labels: ["tasks", "planning", "breakdown"]
links:
  spec: "specs/001-todo-web-app/spec.md"
  plan: "specs/001-todo-web-app/plan.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/001-todo-web-app/tasks.md"
tests_yaml: []
prompt_text: |
  Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.

  ## Outline

  1. **Setup**: Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

  2. **Load design documents**: Read from FEATURE_DIR:
     - **Required**: plan.md (tech stack, libraries, structure), spec.md (user stories with priorities)
     - **Optional**: data-model.md (entities), contracts/ (API endpoints), research.md (decisions), quickstart.md (test scenarios)
     - Note: Not all projects have all documents. Generate tasks based on what's available.

  3. **Execute task generation workflow**:
     - Load plan.md and extract tech stack, libraries, project structure
     - Load spec.md and extract user stories with their priorities (P1, P2, P3, etc.)
     - If data-model.md exists: Extract entities and map to user stories
     - If contracts/ exists: Map endpoints to user stories
     - If research.md exists: Extract decisions for setup tasks
     - Generate tasks organized by user story (see Task Generation Rules below)
     - Generate dependency graph showing user story completion order
     - Create parallel execution examples per user story
     - Validate task completeness (each user story has all needed tasks, independently testable)

  4. **Generate tasks.md**: Use `.specify/templates/tasks-template.md` as structure, fill with:
     - Correct feature name from plan.md
     - Phase 1: Setup tasks (project initialization)
     - Phase 2: Foundational tasks (blocking prerequisites for all user stories)
     - Phase 3+: One phase per user story (in priority order from spec.md)
     - Each phase includes: story goal, independent test criteria, tests (if requested), implementation tasks
     - Final Phase: Polish & cross-cutting concerns
     - All tasks must follow the strict checklist format (see Task Generation Rules below)
     - Clear file paths for each task
     - Dependencies section showing story completion order
     - Parallel execution examples per story
     - Implementation strategy section (MVP first, incremental delivery)

  5. **Report**: Output path to generated tasks.md and summary:
     - Total task count
     - Task count per user story
     - Parallel opportunities identified
     - Independent test criteria for each story
     - Suggested MVP scope (typically just User Story 1)
     - Format validation: Confirm ALL tasks follow the checklist format (checkbox, ID, labels, file paths)

  Context for task generation: 

  The tasks.md should be immediately executable - each task must be specific enough that an LLM can complete it without additional context.

  ## Task Generation Rules

  **CRITICAL**: Tasks MUST be organized by user story to enable independent implementation and testing.

  **Tests are OPTIONAL**: Only generate test tasks if explicitly requested in the feature specification or if user requests TDD approach.

  ### Checklist Format (REQUIRED)

  Every task MUST strictly follow this format:

  ```text
  - [ ] [TaskID] [P?] [Story?] Description with file path
  ```

  **Format Components**:

  1. **Checkbox**: ALWAYS start with `- [ ]` (markdown checkbox)
  2. **Task ID**: Sequential number (T001, T002, T003...) in execution order
  3. **[P] marker**: Include ONLY if task is parallelizable (different files, no dependencies on incomplete tasks)
  4. **[Story] label**: REQUIRED for user story phase tasks only
     - Format: [US1], [US2], [US3], etc. (maps to user stories from spec.md)
     - Setup phase: NO story label
     - Foundational phase: NO story label  
     - User Story phases: MUST have story label
     - Polish phase: NO story label
  5. **Description**: Clear action with exact file path

  **Examples**:

  - ✅ CORRECT: `- [ ] T001 Create project structure per implementation plan`
  - ✅ CORRECT: `- [ ] T005 [P] Implement authentication middleware in src/middleware/auth.py`
  - ✅ CORRECT: `- [ ] T012 [P] [US1] Create User model in src/models/user.py`
  - ✅ CORRECT: `- [ ] T014 [US1] Implement UserService in src/services/user_service.py`
  - ❌ WRONG: `- [ ] Create User model` (missing ID and Story label)
  - ❌ WRONG: `T001 [US1] Create model` (missing checkbox)
  - ❌ WRONG: `- [ ] [US1] Create User model` (missing Task ID)
  - ❌ WRONG: `- [ ] T001 [US1] Create model` (missing file path)
response_text: |
  Successfully generated an actionable, dependency-ordered tasks.md file for the Todo Web Application feature. The task list includes:

  - Phase 1: Setup (6 tasks) - Project initialization and configuration
  - Phase 2: Foundational Components (13 tasks) - Database models, authentication, and API setup
  - Phase 3: User Story 1 - Secure Todo Management (24 tasks) - Core CRUD functionality for todo items
  - Phase 4: User Story 2 - User Authentication (21 tasks) - Registration, login, and session management
  - Phase 5: User Story 3 - Responsive Web Interface (14 tasks) - Mobile-first responsive design
  - Phase 6: Polish & Cross-Cutting Concerns (12 tasks) - Final enhancements and deployment prep

  Total: 90 tasks organized by priority and dependency order.
  Each task follows the required checklist format with proper IDs, labels, and file paths.
  Parallel execution opportunities identified with [P] markers.
  User stories are properly labeled with [US1], [US2], [US3] tags.
outcome: "Successfully generated comprehensive task list with 90 tasks organized by user stories and dependencies."
evaluation: "The task breakdown is complete with all required elements. Each task is specific enough for an LLM to execute without additional context. Ready for implementation phase."
---

# Task List Generation for Todo Web Application

## Summary
Successfully generated an actionable, dependency-ordered tasks.md file for the Todo Web Application feature with 90 specific tasks organized across 6 phases.

## Task Distribution
- Phase 1: Setup (6 tasks)
- Phase 2: Foundational Components (13 tasks)
- Phase 3: User Story 1 - Secure Todo Management (24 tasks)
- Phase 4: User Story 2 - User Authentication (21 tasks)
- Phase 5: User Story 3 - Responsive Web Interface (14 tasks)
- Phase 6: Polish & Cross-Cutting Concerns (12 tasks)

## Key Features
- All tasks follow the required checklist format with proper IDs, labels, and file paths
- Parallel execution opportunities marked with [P] tags
- User stories properly labeled with [US1], [US2], [US3] tags
- Dependencies and execution order clearly defined
- MVP scope identified as User Story 1 with basic authentication

## Status
Task breakdown is complete and ready for implementation. Each task is specific enough for an LLM to execute without additional context.