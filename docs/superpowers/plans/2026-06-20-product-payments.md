# Product Payments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add controlled payment allocation to product creation and submit the API's `payments` payload.

**Architecture:** Keep the change inside `AddProductoComponent` and its focused test. Reuse `PaymentTypeServicio` to fetch selectable payment types, maintain local payment draft state, compute purchase/payment totals from form state, and validate before calling `ProductoServicio.crearProducto`.

**Tech Stack:** React, React Router, Jest, Testing Library, existing service classes.

---

### Task 1: Product Creation Payments

**Files:**
- Modify: `src/componentes/test/AddProductoComponent.test.js`
- Modify: `src/componentes/productos/AddProductoComponent.js`

- [ ] **Step 1: Write the failing test**

Add a mock for `PaymentTypeServicio.listarTiposPago()`, select a payment type, type an amount equal to lot cost, add it, submit, and assert the payload includes:

```js
payments: [
    {
        id: '1',
        amount: '4000',
    },
]
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath src/componentes/test/AddProductoComponent.test.js --watchAll=false`

Expected: fail because the payment controls do not exist yet.

- [ ] **Step 3: Implement payment controls**

In `AddProductoComponent`, import `useEffect`, `FaCreditCard`, and `PaymentTypeServicio`. Add state for payment types, loading state, selected payment type, payment amount, and added payments.

Compute purchase total from lots and payment total from payments. Add handlers to add and remove payments. Load payment types on mount.

Render the controlled payment section below lots. Validate that payments exist and totals match before saving. Send `payments` as `{ id: String(payment.id), amount: String(payment.amount) }`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --runTestsByPath src/componentes/test/AddProductoComponent.test.js --watchAll=false`

Expected: pass.
