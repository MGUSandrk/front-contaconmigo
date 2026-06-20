# Sales Create Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a sale creation view that submits clients, products, quantities, and balanced payments to `/sales/create`.

**Architecture:** Add a dedicated `VentaServicio` for sales API calls, a focused `AddVentaComponent` for sale creation, a route in `App.js`, and a sidebar entry. Keep client/product/payment searching and balance validation local to the component.

**Tech Stack:** React, React Router, Jest, Testing Library, existing Axios service pattern.

---

### Task 1: Sale Creation Flow

**Files:**
- Create: `src/servicios/VentaServicio.js`
- Create: `src/componentes/ventas/AddVentaComponent.js`
- Create: `src/componentes/test/AddVentaComponent.test.js`
- Modify: `src/App.js`
- Modify: `src/componentes/dashboard/SideBarComponent.js`

- [ ] **Step 1: Write failing tests**

Create tests for selecting a client, adding a product with quantity, adding payments until pending is zero, and submitting the expected `/sales/create` payload through `VentaServicio.crearVenta`.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- --runTestsByPath src/componentes/test/AddVentaComponent.test.js --watchAll=false`

Expected: fail because the component and service do not exist yet.

- [ ] **Step 3: Implement service and component**

Create `VentaServicio` with `crearVenta(sale)` posting to `${REACT_APP_API_BASE_URL}/sales/create`.

Create `AddVentaComponent` that loads clients, products, and payment types; supports filtered selects; manages added products and payments; computes totals; blocks save until pending is zero; and submits the payload with `payments[].id` from internal `typePaymentId`.

- [ ] **Step 4: Wire navigation**

Add `/add-venta` route guarded for `USER` and add a `Ventas` sidebar link.

- [ ] **Step 5: Run verification**

Run: `npm test -- --runTestsByPath src/componentes/test/AddVentaComponent.test.js src/componentes/test/SideBarComponent.test.js --watchAll=false`

Expected: pass.
