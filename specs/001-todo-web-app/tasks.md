# Tasks: Todo Web Application

**Input**: Design documents from `/specs/001-todo-web-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure with backend and frontend directories
- [X] T002 [P] Initialize backend with FastAPI, SQLModel, Neon dependencies in backend/requirements.txt
- [X] T003 [P] Initialize frontend with Next.js, TypeScript, Tailwind CSS in frontend/package.json
- [X] T004 Create docker-compose.yml for local development with Neon PostgreSQL
- [X] T005 Create .env.example with required environment variables
- [ ] T006 [P] Configure linting and formatting tools for both backend and frontend

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Setup database schema and migrations framework in backend/src/db/
- [X] T008 [P] Implement JWT authentication/authorization framework with Better Auth in backend/src/auth/
- [X] T009 [P] Setup API routing and middleware structure in backend/src/api/
- [X] T010 Create base models/entities that all stories depend on in backend/src/models/
- [X] T011 Configure error handling and logging infrastructure in backend/src/utils/
- [X] T012 Setup environment configuration management in backend/src/config/
- [X] T013 [P] Create API client in frontend/src/services/api.ts to attach JWT tokens
- [X] T014 [P] Implement authentication context in frontend/src/contexts/auth.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Todo Management (Priority: P1) 🎯 MVP

**Goal**: Allow authenticated users to perform all 5 CRUD operations (Add, Delete, Update, View, Mark Complete) on their own tasks while preventing access to other users' tasks.

**Independent Test**: The application allows a logged-in user to perform all 5 CRUD operations on their own tasks while preventing access to other users' tasks.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T015 [P] [US1] Contract test for GET /api/todos endpoint in backend/tests/contract/test_todos_api.py
- [ ] T016 [P] [US1] Contract test for POST /api/todos endpoint in backend/tests/contract/test_todos_api.py
- [ ] T017 [P] [US1] Contract test for PUT /api/todos/{id} endpoint in backend/tests/contract/test_todos_api.py
- [ ] T018 [P] [US1] Contract test for PATCH /api/todos/{id}/complete endpoint in backend/tests/contract/test_todos_api.py
- [ ] T019 [P] [US1] Contract test for DELETE /api/todos/{id} endpoint in backend/tests/contract/test_todos_api.py
- [ ] T020 [P] [US1] Integration test for user isolation in backend/tests/integration/test_todo_isolation.py

### Implementation for User Story 1

- [X] T021 [P] [US1] Create User model in backend/src/models/user.py
- [X] T022 [P] [US1] Create TodoItem model in backend/src/models/todo_item.py
- [X] T023 [US1] Implement TodoService in backend/src/services/todo_service.py (depends on T021, T022)
- [X] T024 [US1] Implement Todo API endpoints in backend/src/api/routes/todos.py
- [X] T025 [US1] Add validation and error handling to Todo API endpoints
- [X] T026 [US1] Add authentication checks to ensure users can only access their own todos
- [X] T027 [P] [US1] Create TodoList component in frontend/src/components/TodoList.tsx
- [X] T028 [P] [US1] Create TodoForm component in frontend/src/components/TodoForm.tsx
- [X] T029 [US1] Create TodoItem component in frontend/src/components/TodoItem.tsx
- [X] T030 [US1] Implement Todo page in frontend/src/pages/todos/index.tsx
- [X] T031 [US1] Add frontend API calls to interact with backend Todo endpoints
- [X] T032 [US1] Add loading and error states to Todo UI components

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Authentication and Session Management (Priority: P2)

**Goal**: Enable users to securely register, log in, maintain a session, and log out.

**Independent Test**: A user can register, log in, maintain a session, and log out securely.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T033 [P] [US2] Contract test for authentication endpoints in backend/tests/contract/test_auth_api.py
- [ ] T034 [P] [US2] Integration test for user registration flow in backend/tests/integration/test_auth_flow.py
- [ ] T035 [P] [US2] Integration test for login/logout functionality in backend/tests/integration/test_auth_flow.py

### Implementation for User Story 2

- [X] T036 [P] [US2] Enhance User model with authentication fields in backend/src/models/user.py
- [X] T037 [US2] Implement UserService authentication methods in backend/src/services/auth_service.py
- [X] T038 [US2] Implement authentication API endpoints in backend/src/api/routes/auth.py
- [X] T039 [US2] Add password hashing and verification utilities in backend/src/utils/auth.py
- [X] T040 [P] [US2] Create Login component in frontend/src/components/Login.tsx
- [X] T041 [P] [US2] Create Signup component in frontend/src/components/Signup.tsx
- [X] T042 [US2] Create Logout functionality in frontend/src/components/Logout.tsx
- [X] T043 [US2] Integrate authentication API calls in frontend authentication components
- [X] T044 [US2] Implement redirect logic for protected routes in frontend/src/utils/routeGuard.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Responsive Web Interface (Priority: P3)

**Goal**: Provide a responsive web interface that adapts to different screen sizes (mobile, tablet, desktop).

**Independent Test**: The web interface adapts appropriately to different screen sizes (mobile, tablet, desktop) and provides consistent functionality.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T045 [P] [US3] Responsive UI test for mobile view in frontend/tests/responsive/todoMobile.test.tsx
- [ ] T046 [P] [US3] Responsive UI test for tablet view in frontend/tests/responsive/todoTablet.test.tsx

### Implementation for User Story 3

- [ ] T047 [P] [US3] Update TodoList component with responsive layout in frontend/src/components/TodoList.tsx
- [ ] T048 [P] [US3] Update TodoForm component with responsive layout in frontend/src/components/TodoForm.tsx
- [ ] T049 [P] [US3] Update TodoItem component with responsive layout in frontend/src/components/TodoItem.tsx
- [ ] T050 [US3] Add responsive design to authentication components
- [ ] T051 [US3] Implement responsive navigation in frontend/src/components/Navigation.tsx
- [ ] T052 [US3] Add responsive utility classes and styles with Tailwind CSS

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T053 [P] Add comprehensive documentation in docs/
- [ ] T054 Code cleanup and refactoring across backend and frontend
- [ ] T055 Performance optimization for API responses and UI rendering
- [ ] T056 [P] Additional unit tests in backend/tests/unit/ and frontend/tests/unit/
- [ ] T057 Security hardening and audit
- [ ] T058 Run quickstart.md validation scenarios
- [ ] T059 Set up deployment configuration for Vercel (frontend) and Docker Compose (backend)
- [X] T060 Create README.md with setup and deployment instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for GET /api/todos endpoint in backend/tests/contract/test_todos_api.py"
Task: "Contract test for POST /api/todos endpoint in backend/tests/contract/test_todos_api.py"
Task: "Integration test for user isolation in backend/tests/integration/test_todo_isolation.py"

# Launch all models for User Story 1 together:
Task: "Create User model in backend/src/models/user.py"
Task: "Create TodoItem model in backend/src/models/todo_item.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence