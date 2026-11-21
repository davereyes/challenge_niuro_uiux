# CLAUDE.md — Niuro (challenge_niuro_uiux)

Reglas del proyecto para Claude y para cualquier persona del equipo. **Son obligatorias.**
Cada carpeta relevante tiene su propio `context.md`: **léelo antes de crear o modificar algo en esa carpeta.**

## Estado del proyecto

- Diseño en Claude Design: canvas **"App Mobile — Canvas"** (páginas *Mainflow* y *Design System*). Puede cambiar: releerlo al iniciar cada fase.
- Producto: **Fundo** — flujo "Apply Now" (adelanto de dinero para independientes en EE. UU.).
- Trabajo **por fases** según `docs/plan/apply-now.md`. Reglas de negocio en `docs/plan/business-logic-block-1.md`.
  No avanzar a la siguiente fase sin revisión del usuario.
- Plataforma activa: **mobile**. **Desktop** está reservado (estructura creada, sin componentes).

## Stack

| Herramienta | Versión | Notas |
| --- | --- | --- |
| React | 19.3 | `ref` como prop (sin `forwardRef`), `use()`, `<Context value>` |
| TypeScript | 7.0 | Modo estricto + `exactOptionalPropertyTypes` + `noUncheckedIndexedAccess` |
| Vite | 8 | Bundler y dev server |
| Storybook | 10.6 | `@storybook/react-vite`, addons docs, a11y, vitest |
| Vitest | 4.1 | Proyecto `unit` (node) + proyecto `storybook` (Chromium/Playwright) |
| oxlint | 1.9x | Lint + **reglas de fronteras de Clean Architecture** |
| Estilos | CSS Modules + CSS custom properties (tokens) | Sin librerías de UI |

Node ≥ 22.12. Gestor de paquetes: **npm**.

## Comandos

```bash
npm run dev              # app en http://localhost:5173
npm run storybook        # Storybook en http://localhost:6006
npm run typecheck        # tsc -b
npm run lint             # oxlint (incluye fronteras entre capas)
npm run test             # unit + todas las stories como tests (render, play, a11y)
npm run test:unit        # solo tests .test.ts
npm run test:stories     # solo stories
npm run check            # typecheck + lint + test  ← correr antes de cada commit
npm run build            # build de la app
npm run build-storybook  # build estático del Storybook
```

## Arquitectura (Clean Architecture)

```
src/
├── domain/          Entidades, value objects, interfaces de repositorio, errores. TS puro.
├── application/     Casos de uso, puertos, DTOs. Depende solo de domain.
├── infrastructure/  Adaptadores: HTTP, storage, implementaciones de repositorios, mappers.
├── presentation/    React: design-system (Storybook), features (pages + hooks), di.
├── app/             Composition root: DI container, providers, arranque.
└── shared/          Utilidades agnósticas (Result, cx). No depende de nada.
```

**Regla de dependencia** (apunta siempre hacia adentro; oxlint la hace cumplir):

```
app ──► presentation ──► application ──► domain
 │                                         ▲
 └────► infrastructure ────────────────────┘
          (implementa puertos de domain/application)
shared ◄── cualquiera
```

- `domain` no importa nada del proyecto salvo `@shared`. Sin React.
- `application` no importa `infrastructure`, `presentation` ni React.
- `presentation` **nunca** importa `infrastructure`. Obtiene casos de uso con `useUseCases()` (`@presentation/di`).
- `design-system` es UI pura: no importa `domain`, `application` ni `features`. Todo entra por props.
- Solo `app/di/container.ts` conoce las clases concretas y las conecta.

Aliases: `@app`, `@domain`, `@application`, `@infrastructure`, `@presentation`, `@ds` (= `presentation/design-system`), `@shared`.
Entre capas usa **siempre** el alias; dentro de la misma capa/componente, rutas relativas.

## SOLID aplicado

- **S** — Un componente/caso de uso/adaptador = una responsabilidad. Componentes de UI no hacen fetch ni lógica de negocio.
- **O** — Se extiende con props, slots (`leading`, `trailing`, `actions`) y registros (íconos), no editando el interior.
- **L** — Toda implementación de un puerto (`XRepository`) es intercambiable (HTTP, mock, storage) sin cambiar el caso de uso.
- **I** — Puertos pequeños y específicos; props mínimas por componente. Nada de "props bolsa".
- **D** — Casos de uso dependen de interfaces; la UI depende del contrato `UseCases`. La inyección ocurre en `app/di`.

## Atomic Design + Storybook (regla estricta)

**El Storybook es el Atomic Design y la fuente de verdad de la UI.**

1. Ninguna pantalla usa un componente visual que no exista en `src/presentation/design-system` con su story.
2. Si una pantalla necesita algo nuevo: **primero** se crea el componente + story en el nivel correcto, **después** se usa.
3. Niveles: `atoms` → `molecules` → `organisms` → `templates`. Los *pages* viven en `presentation/features/<feature>/pages`.
4. Un nivel solo importa de niveles inferiores (un átomo nunca importa una molécula).
5. Separación por plataforma: `design-system/mobile/*` y `design-system/desktop/*`. Títulos `Mobile/<Nivel>/<Componente>` y `Desktop/<Nivel>/<Componente>`.
6. Tokens compartidos en `design-system/tokens` (sección `Foundations` en Storybook).

### Variantes vs. controles

- **Story = variante visual real** (cambia la identidad del componente). Ej.: `Button` → `Primary`, `Secondary`, `Tertiary`.
- **Control = modificador o estado** aplicable a cualquier variante. Ej.: `showBackIcon`, `trailingIcon`, `size`, `loading`, `disabled`, `fullWidth`.
- No crear stories por combinaciones (`PrimaryWithBackIcon` ❌). Si cambia el elemento HTML o la semántica, sí es otra story (ej. `ListItem` → `Static` / `Navigable`).

### Anatomía obligatoria de un componente

```
ComponentName/
├── ComponentName.tsx          # Named export, props tipadas y documentadas (JSDoc)
├── ComponentName.module.css   # Solo tokens semánticos (var(--color-…), var(--space-…))
├── ComponentName.stories.tsx  # meta con ...mobileStory / ...desktopStory, args por defecto, play() si hay interacción
└── index.ts                   # Re-export del componente y sus tipos
```

Y agregarlo al barrel del nivel (`atoms/index.ts`, etc.).

## Convenciones

- **Named exports** siempre (default solo en stories y configs). Componentes como arrow functions.
- Archivos de componentes en `PascalCase`; hooks `useX.ts`; casos de uso `VerbNounUseCase.ts`; tests `*.test.ts` junto al archivo.
- Código, nombres, comentarios técnicos **y copy de UI** en **inglés** (producto US, igual que el diseño). Documentación del equipo en español.
- Estilos: **nunca** valores sueltos (hex, px) en componentes; usar tokens semánticos. Nuevos valores → `tokens/`.
- Props opcionales que pueden recibir `undefined` explícito se tipan `prop?: T | undefined`.
- Accesibilidad: touch target ≥ 44px, `focus-visible`, `aria-label` en botones de solo ícono, labels asociados a inputs. El addon a11y está en modo **`error`**: una violación rompe los tests.
- Errores de casos de uso como `Result<T, E>` (`@shared/types/result`), no `throw`.

## Definition of Done

- [ ] Componente nuevo/cambiado tiene story actualizada y controles correctos.
- [ ] `npm run check` pasa (typecheck, lint con fronteras, tests unit + stories + a11y).
- [ ] Lógica de dominio/aplicación con test unitario.
- [ ] Se actualizó el `context.md` de la carpeta si cambió alguna regla o decisión.

## Reglas de UI del flujo (no están en el canvas, son obligatorias)

- El CTA de cada paso va **anclado al bottom y por encima del teclado** (`BottomActionBar`).
- El CTA **siempre** lleva el back a la izquierda (`Button` con `showBackIcon`).
- El `TopBar` del flujo **no** muestra back: solo título "Step N of 7", cerrar y stepper.

## Probar el flujo

`npm run dev` → `/` (landing) → "Get Your Advance". Datos de demo y modos de QA (`?mock=slow`, `?mock=offline`,
email `returning@…`) en `docs/plan/apply-now.md` → "Cómo probar los casos borde".

## Mapa de context.md

| Archivo | Cuándo leerlo |
| --- | --- |
| `src/domain/context.md` | Entidades, reglas de negocio, interfaces de repositorio |
| `src/application/context.md` | Casos de uso, puertos, DTOs |
| `src/infrastructure/context.md` | APIs, storage, mappers |
| `src/presentation/context.md` | Features, pages, hooks, DI en React |
| `src/presentation/design-system/context.md` | Cualquier componente o story |
| `src/presentation/design-system/tokens/context.md` | Colores, tipografía, espaciado |
| `src/presentation/design-system/mobile/context.md` | Componentes mobile (inventario y API) |
| `src/presentation/design-system/desktop/context.md` | Cuando se active desktop |
| `src/app/context.md` | Providers, DI container, arranque |
| `src/shared/context.md` | Utilidades transversales |
| `docs/plan/apply-now.md` | Plan por fases, inventario del diseño, decisiones abiertas |
