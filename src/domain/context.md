# domain/ — Contexto

**Capa más interna.** Reglas de negocio de "Apply Now" en TypeScript puro (sin React, sin I/O).
Fuente de reglas: `docs/plan/business-logic-block-1.md` + bloque 2 del canvas.

## Contenido

| Carpeta | Qué hay |
| --- | --- |
| `value-objects/` | `Email`, `UsPhone`, `PersonName`, `BusinessName`, `BusinessStartDate`, `DateOfBirth`, `Ssn`, `UsState`, `HomeAddress`, `CalendarDate`. Cada uno con `createX()` → `Result` y su test. |
| `entities/ApplicationDraft.ts` | Agregado del borrador + `StepId`, `IncomeSource`, `Ownership`. `toPersistable()` elimina `identity`. |
| `services/applyFlow.ts` | Orden de pasos, numeración del stepper, progreso (nunca baja), ramas, saltos de cliente recurrente, guardas de deep link, expiración (30 días). |
| `services/stepValidation.ts` | Validadores por paso (`validateContact`, …) que devuelven **todos** los errores de campo. La UI los usa para habilitar Continue y para errores al blur. |
| `repositories/ApplicationDraftRepository.ts` | Puerto del caché local del borrador. |
| `errors/ValidationError.ts` | `{ code }` estable; los textos viven en presentación. |

## Reglas clave implementadas

- Stepper: 7 pasos (Checking y pickers no cuentan). Progreso 14·29·43·57·71·79·86·100, siempre el máximo alcanzado.
- Income: business → 1E · gig → rama sin diseño · job → no elegible (2E).
- Ownership: 51%+ → Checking · 50% o menos → rama sin diseño.
- Estado CA/NY → error `notServed` en el campo State (2G).
- DOB: 18+ al día exacto; fechas inexistentes inválidas. SSN: rechaza 000/666/9xx, grupo 00, serie 0000.
- Nombres: letras Unicode con espacio, guion y apóstrofo internos (caso borde agregado).
- Identity **nunca** se persiste en el dispositivo.

## Reglas de la capa

- Solo importa `@domain/*` y `@shared/*` (oxlint lo bloquea).
- Fechas: se reciben como `today: CalendarDate`; nunca `new Date()` adentro de una regla.
