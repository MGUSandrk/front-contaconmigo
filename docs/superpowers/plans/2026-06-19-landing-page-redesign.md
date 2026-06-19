# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `LandingPage.js` into a modern light/cyan landing page that presents ContaConmigo as an integrated sales, products, clients, and accounting system with academic project context.

**Architecture:** Keep the landing page as a self-contained React component following the current codebase pattern. Use small local arrays for repeated card content, inline style objects for local styling, and a component-local `<style>` block for CSS animations and responsive polish.

**Tech Stack:** React 19, react-scripts, React Testing Library, Bootstrap utility classes, react-icons.

---

### Task 1: Landing Content Test

**Files:**
- Create: `src/componentes/LandingPage.test.js`
- Test: `src/componentes/LandingPage.test.js`

- [x] **Step 1: Write the failing test**

```javascript
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

test('muestra el nuevo mensaje integral, servicios y contexto academico', () => {
    render(
        <MemoryRouter>
            <LandingPage />
        </MemoryRouter>
    );

    expect(screen.getByRole('heading', {
        name: /gestiona ventas, productos, clientes y contabilidad en un solo sistema/i,
    })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /iniciar sesion/i })).toHaveAttribute('href', '/login');

    expect(screen.getByRole('heading', { name: /ventas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /productos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /productos por lote/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /clientes/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /contabilidad/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /reportes/i })).toBeInTheDocument();

    expect(screen.getByText(/sistemas administrativos/i)).toBeInTheDocument();
    expect(screen.getByText(/nico alfaro/i)).toBeInTheDocument();
    expect(screen.getByText(/mirko sandrk/i)).toBeInTheDocument();
    expect(screen.getByText(/react/i)).toBeInTheDocument();
    expect(screen.getByText(/spring boot/i)).toBeInTheDocument();
    expect(screen.getByText(/postgresql/i)).toBeInTheDocument();
    expect(screen.getByText(/MGUSandrk\/front-contaconmigo/i)).toBeInTheDocument();
    expect(screen.getByText(/MGUSandrk\/back-contaconmigo/i)).toBeInTheDocument();
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -- --runTestsByPath src/componentes/LandingPage.test.js --watchAll=false`

Expected: FAIL because the current landing does not contain the new integrated hero title and academic section.

### Task 2: Landing Redesign

**Files:**
- Modify: `src/componentes/LandingPage.js`
- Test: `src/componentes/LandingPage.test.js`

- [x] **Step 1: Replace the landing component**

Implement:

- fixed light navbar with brand, section links, login CTA, and mobile menu state
- hero title and copy from the design spec
- CSS-only subtle animation
- mock dashboard visual built from cards
- six service cards from local arrays
- parallel accounting explanatory band
- academic project section with authors, stack, and repositories
- updated light footer

- [x] **Step 2: Run test to verify it passes**

Run: `npm test -- --runTestsByPath src/componentes/LandingPage.test.js --watchAll=false`

Expected: PASS.

### Task 3: Build Verification

**Files:**
- Verify: `src/componentes/LandingPage.js`
- Verify: `src/componentes/LandingPage.test.js`

- [x] **Step 1: Run production build**

Run: `npm run build`

Expected: PASS with a production build generated successfully.

- [x] **Step 2: Inspect git diff**

Run: `git diff -- src/componentes/LandingPage.js src/componentes/LandingPage.test.js docs/superpowers/plans/2026-06-19-landing-page-redesign.md`

Expected: Diff only contains the landing redesign, its test, and this plan.
