# Sales History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin-only sales history screen that lists records returned by `GET /sales`.

**Architecture:** Reuse the existing ContaConmigo React patterns: `VentaServicio` owns authenticated Axios calls, `ListarVentasComponent` owns loading/error/empty/table UI, `App.js` owns route protection, and `SideBarComponent` owns role-based navigation.

**Tech Stack:** React, react-router-dom, axios, react-icons, Bootstrap classes, Jest, React Testing Library.

---

### Task 1: Sales Service Contract

**Files:**
- Modify: `src/servicios/VentaServicio.js`
- Test: `src/servicios/VentaServicio.test.js`

- [ ] Write a failing Jest test that mocks `axios.get`, sets `localStorage.token`, calls `VentaServicio.listarVentas()`, and expects `GET ${REACT_APP_API_BASE_URL}/sales` with the authorization header.
- [ ] Run `npm test -- --watchAll=false src/servicios/VentaServicio.test.js` and verify it fails because `listarVentas` is missing.
- [ ] Add `listarVentas()` to `VentaServicio` using `axios.get(VENTA_BASE_REST_API_URL, this.getAuthHeaders())`.
- [ ] Re-run the service test and verify it passes.

### Task 2: Sales History Component

**Files:**
- Create: `src/componentes/ventas/ListarVentasComponent.js`
- Test: `src/componentes/test/ListarVentasComponent.test.js`

- [ ] Write failing component tests for rendering returned sales, formatting dates and ARS totals, showing an empty state, and showing API errors.
- [ ] Run `npm test -- --watchAll=false src/componentes/test/ListarVentasComponent.test.js` and verify it fails because the component does not exist.
- [ ] Create `ListarVentasComponent` with the standard sidebar/card layout, `useEffect` load, `cargando`, `error`, and `ventas` states.
- [ ] Render a responsive table with ID, date, client, seller, entity, and total columns.
- [ ] Re-run the component test and verify it passes.

### Task 3: Route And Navigation

**Files:**
- Modify: `src/App.js`
- Modify: `src/componentes/dashboard/SideBarComponent.js`
- Test: `src/componentes/test/SideBarComponent.test.js`

- [ ] Add a failing sidebar assertion that admins see `/ventas` and sellers do not.
- [ ] Run the sidebar test and verify the new assertion fails.
- [ ] Import `ListarVentasComponent` into `App.js` and add `/ventas` inside the admin `PrivateRoute`.
- [ ] Add a `Historial de Ventas` admin-only menu item to `SideBarComponent`.
- [ ] Re-run the sidebar test and verify it passes.

### Task 4: Verification

**Files:**
- Review all touched files with `git diff -- src/App.js src/servicios/VentaServicio.js src/componentes/ventas/ListarVentasComponent.js src/componentes/dashboard/SideBarComponent.js src/componentes/test/ListarVentasComponent.test.js src/componentes/test/SideBarComponent.test.js src/servicios/VentaServicio.test.js`.

- [ ] Run `npm test -- --watchAll=false src/servicios/VentaServicio.test.js src/componentes/test/ListarVentasComponent.test.js src/componentes/test/SideBarComponent.test.js`.
- [ ] Run `npm run build`.
- [ ] Report the exact verification outcome and any pre-existing dirty worktree files left untouched.
