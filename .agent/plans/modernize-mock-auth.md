# Implementation Plan - Modernize Mock Authentication

The current mock authentication relies on a stateful middleware and a specific endpoint (`/auth/fake`) to "log in" users during tests. This approach is prone to race conditions and makes tests harder to run in parallel. A more modern approach uses stateless middleware that stubs the user object based on request headers or cookies.

## Proposed Changes

### 1. Refactor `spec/support/mock-auth.js`
- Remove global state (variables `role`, `id`, `email` in closure).
- Change middleware to be stateless: look for user data in request headers (e.g., `x-test-user-id`).
- Provide a helper function to easily apply this to `supertest` requests.
- Keep the `/auth/fake` route for backward compatibility with older tests but refactor its implementation.

### 2. Modern Usage Pattern
Instead of:
```javascript
await request(app).get("/auth/fake?userId=1&role=admin");
await request(app).post("/topics/create").send(...);
```
The new way will be:
```javascript
await request(app)
  .post("/topics/create")
  .set("x-test-user-id", "1")
  .set("x-test-role", "admin")
  .send(...);
```
Or using a helper:
```javascript
import { asUser } from "../support/mock-auth";
await asUser(request(app).post("/topics/create"), user).send(...);
```

### 3. Consistency with `supertest` + `vitest`
The project is already moving towards `vitest` and `supertest`. This refactor aligns with that by making tests more isolated and less dependent on server state.

## Steps
1. Update `spec/support/mock-auth.js` with the new stateless implementation.
2. Update `src/config/route-config.js` if necessary (though it already correctly imports and calls it).
3. Demonstrate usage in an existing test (e.g., `spec/integration/advert.spec.js`).
