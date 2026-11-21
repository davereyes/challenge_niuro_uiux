# presentation/ — Contexto

Todo lo que es React.

## Contenido

| Carpeta | Qué hay |
| --- | --- |
| `design-system/` | **Atomic Design = Storybook.** UI pura. Ver su `context.md`. |
| `features/landing/` | 1A · Landing (Hero, secciones, FAQ, Footer). |
| `features/apply/` | Flujo Apply Now (1B–1J + estados del bloque 2). |
| `di/` | `UseCasesProvider` + `useUseCases()`. |
| `hooks/` | `keyboardHandoff` (mantiene el teclado abierto entre pantallas en iOS) y `useAutoFocusField` (enfoca el primer campo de texto al entrar). |
| `assets/images/` | Fotos de contenido (landing). |

## features/apply

| Carpeta | Rol |
| --- | --- |
| `ApplyLayout.tsx` | Layout de `/apply/*`: carga el borrador (Suspense + `use()`), ofrece reanudar (2D) y remonta tras "Start over". |
| `state/` | `ApplyFlowProvider` / `useApplyFlow()`: borrador en memoria (identity solo vive aquí). |
| `routing/` | `paths.ts` (StepId ↔ URL, destinos) y `StepGuard` (deep links → primer paso incompleto). |
| `components/ApplyStep.tsx` | Shell de cada pantalla sobre el template `StepScreen`: "Step N of 7", progreso que no baja, CTA con back, sheet de salida (2C), banner de red (2I), "Still working…" (2H), autofocus del primer campo (teclado activo). |
| `components/StepForm.tsx` | `<form>` para que "Ir" del teclado envíe el paso. |
| `hooks/useBlurValidation.ts` | Errores al blur y al Continue, nunca al tipear (2B). |
| `hooks/useStepSubmit.ts` | Loading, slow (10 s), error de red y navegación al destino. |
| `copy/` | Textos de UI (inglés) y mensajes por código de error del dominio. |
| `pages/` | Una página por pantalla: Contact, Name, IncomeSource, NotEligible (2E), Business, Ownership, Checking (+2F), Address (+2G), Identity, Outcome (placeholders). |

## Reglas

- **Nunca** importar `@infrastructure` (oxlint lo bloquea). Casos de uso vía `useUseCases()`.
- Las páginas solo componen componentes del DS; si falta algo visual se crea primero en Storybook.
- Validación en vivo con los validadores del **dominio** (`@domain/services/stepValidation`); envío con los casos de uso.
- Las features no se importan entre sí, salvo rutas públicas (`landing` usa `APPLY_PATH`).
- Placeholders (sin diseño): `OutcomePage` (gig, ≤50%, conexión bancaria) y "Explore other options" → landing.
