# Landing Page Redesign Design

## Context

ContaConmigo is a React frontend for an administrative/accounting app backed by Spring Boot and PostgreSQL. The current landing page is a single React component with Bootstrap classes, inline styles, a fixed navbar, a hero using an external dashboard image, a four-card features section, and a footer.

The redesign should make the app feel like a clear, modern product while also documenting that it is an academic practical assignment.

## Goals

- Present ContaConmigo as an integrated system for sales, products, product lots, clients, and accounting.
- Keep the visual identity light, clean, and based on soft cyan tones.
- Replace the current hero image with an app-like dashboard composition built in React/CSS.
- Add subtle motion without distracting from the content.
- Reorganize the services section to include sales, products, product lots, clients, accounting, and reports.
- Add an academic section explaining the assignment, authors, stack, and repositories.

## Non-Goals

- No new runtime dependencies.
- No changes to routing, authentication, services, or private app screens.
- No backend integration for the landing page.
- No large visual asset generation.

## Visual Direction

Use a "Dashboard Claro Moderno" direction:

- A bright hero with a white/cyan background.
- Left side: strong product message, short supporting copy, and two calls to action.
- Right side: a mock mini-dashboard made from cards for sales, product lots, clients, and accounting.
- Subtle background animation using CSS keyframes for small decorative shapes or very gentle floating dashboard elements.
- Professional product-first tone, with the academic information in its own later section.

## Palette

- Main background: `#F7FBFC`
- Surface: `#FFFFFF`
- Brand cyan: `#A8DADC`
- Active cyan: `#4FB3C8`
- Primary text: `#243447`
- Secondary text: `#64748B`
- Soft green accent: `#8BC6A7`
- Soft coral accent: `#F4A7A3`
- Border: `#E2EEF2`

## Page Structure

### Navbar

- Keep a fixed, light navbar.
- Show the ContaConmigo brand with an icon.
- Include navigation actions for "Funcionalidades", "Trabajo practico", and "Iniciar sesion".
- Mobile menu should continue using the existing `menuOpen` state.

### Hero

Hero message:

- Main title: "Gestiona ventas, productos, clientes y contabilidad en un solo sistema."
- Supporting text: explain that ContaConmigo connects daily operations with accounting records.
- Primary CTA: "Iniciar sesion" linking to `/login`.
- Secondary CTA: "Ver funcionalidades" scrolling to the services section.

Hero visual:

- A mock dashboard made with HTML/CSS cards instead of an external image.
- Cards should represent:
  - Ventas
  - Productos por lote
  - Clientes
  - Contabilidad
- Include a small badge or status line communicating that commercial data and accounting are saved in parallel.

Motion:

- Use CSS-only animation.
- Keep movement subtle and slow.
- Respect layout stability across desktop and mobile.

### Services Section

Replace the current four-card section with six service cards:

- Ventas: register commercial operations.
- Productos: manage the product catalog.
- Productos por lote: track product batches/lots.
- Clientes: manage client records connected to business activity.
- Contabilidad: work with plan de cuentas, journal entries, and accounting books.
- Reportes: read the system information visually.

Add a compact explanatory band after the cards:

- State that commercial management and accounting data are stored in parallel.
- Clarify that sales, clients, and products coexist with accounting information.

### Academic Section

Add a section titled "Trabajo practico academico".

Content:

- Subject: Sistemas Administrativos.
- Authors: Nico Alfaro and Mirko Sandrk.
- Frontend: React.
- Backend: Spring Boot.
- Database: PostgreSQL.
- Frontend repository: `MGUSandrk/front-contaconmigo`.
- Backend repository: `MGUSandrk/back-contaconmigo`.

Layout:

- Two columns on desktop.
- Academic context on one side.
- Technical stack and repository chips/cards on the other.
- Stack/repository links should be concise and visually secondary to the main product story.

### Footer

- Keep a light footer.
- Update copyright year to 2026.
- Keep branding consistent with the navbar.

## Implementation Notes

- Implement within `src/componentes/LandingPage.js`.
- Continue using React, Bootstrap utility classes, and `react-icons`.
- Prefer small data arrays for repeated cards to reduce duplicated JSX.
- Keep styles local to the component for now, matching the current file pattern.
- Use ASCII text in source copy unless the file already moves to accented Spanish consistently.

## Responsive Behavior

- Desktop: two-column hero, services in a responsive grid, academic section in two columns.
- Tablet/mobile: stacked hero, compact dashboard visual, services in one or two columns depending on width.
- Buttons and nav items must not overflow.
- Animated decorative elements must not cover text or controls.

## Verification

- Run the existing build or test command available in the project.
- Manually inspect the landing page at desktop and mobile widths.
- Confirm smooth scrolling works for section links.
- Confirm `/login` CTA still works.
- Confirm no external hero image dependency remains.

