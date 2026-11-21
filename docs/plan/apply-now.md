# Plan — Apply Now (bloques 1 y 2) · Mobile first

> Fuente de diseño: canvas "App Mobile — Canvas" en Claude Design, página **Mainflow** (bloque `1 · Flow`)
> y página **Design System**. Reglas de negocio: `docs/plan/business-logic-block-1.md`.
> El diseño puede cambiar: **al iniciar cada fase se vuelve a leer el canvas** y se actualiza este plan.
> El usuario autorizó avanzar todas las fases sin pausas de aprobación (sigue el cierre con `npm run check`).

## Cómo se trabaja

- Una fase a la vez. Cada fase termina con `npm run check` en verde, revisión del usuario y commit.
- Orden por dependencias: tokens → design system (Storybook) → dominio → infraestructura → pantallas.
  Ninguna pantalla se construye con un componente que no exista en Storybook.
- Estado de cada fase: ⬜ pendiente · 🟨 en curso · ✅ hecha (revisada).

## Inventario del diseño (bloque 1)

| Id | Pantalla (artboard) | Stepper | Notas |
| --- | --- | --- | --- |
| 1A | Landing (`Main`) | — | Hero con imagen, CTA "Get Your Advance", audiencias, cifras, pasos, FAQ, footer |
| 1B | Contact (`Testing-Stepper-Copy`) | 1/7 · 14% | Teléfono (máscara US), email, 2 consentimientos, legal SMS |
| 1C | Name (`Flow-Name`) | 2/7 · 29% | Nombre y apellido |
| 1D | Income source (`Testing-Work-Clean`) | 3/7 · 43% | 3 option cards + hint |
| 1E | Business (`Flow-Business`) | 4/7 · 57% | Nombre del negocio + helper, fecha de inicio (abre 1F) |
| 1F | Month/Year picker (`Testing-Business-Month`) | — | Bottom sheet con wheels; meses futuros deshabilitados y rebotan |
| 1G | Ownership (`Flow-Ownership`) | 5/7 · 71% | 2 option cards |
| 1G→ | Checking (`Flow-Checking`) | 79% | Automática, sin botón; checklist animado |
| 1H | Home address (`Flow-AboutYou`) | 6/7 · 86% | Autocomplete → llena city/state/ZIP; select de estado |
| 1I | Identity (`Flow-Identity`) | 7/7 · 100% | Fecha de nacimiento (abre 1J), SSN, nota legal |
| 1J | DOB picker (`Flow-Identity-DOB`) | — | Wheels mes/día/año; 18+, fechas inválidas rebotan |

### Bloque 2 · Process (edge cases) — agregado al canvas durante la Fase 2

| Id | Pantalla | Qué define |
| --- | --- | --- |
| 2A | Contact — Keyboard open | CTA sobre el teclado; FAB oculto con teclado abierto; foco visible |
| 2B | Contact — Invalid email | Validar al blur y al Continue, nunca al tipear. Error = borde rojo + ícono + mensaje |
| 2C | Exit — Leave confirmation | X abre sheet "Leave your application?" · "Yes, leave" (variante *destructive* propuesta) / "Keep going". Salir guarda el progreso en silencio (30 días) |
| 2D | Resume — Coming back | Sheet al volver: "Welcome back, {name}" · "Continue application" / "Start over" |
| 2E | Income — Not a fit | Pantalla no elegible: "Change my answer" (→1D) / "Explore other options" (destino indefinido) |
| 2F | Checking — Account found | "Welcome back, {name}" + Continue al primer paso faltante. El progreso nunca retrocede |
| 2G | Address — State not available | Error inline en State (CA/NY), Continue deshabilitado, link "Notify me when it's available" |
| 2H | Address — Saving | Continue en loading, inputs bloqueados; a los 10 s "Still working…" bajo el botón |
| 2I | Address — Connection error | Banner de error arriba, datos conservados, botón "Try again"; Back y X siguen funcionando |

## Reglas transversales (además de las de negocio)

1. **CTA anclado** al bottom y por encima del teclado (VisualViewport), con safe-area de iOS.
2. El CTA **siempre** lleva el botón back a la izquierda (`Button` con `showBackIcon`, como en el DS del canvas).
3. **Sin back en el TopBar** del flujo: solo título "Step N of 7", cerrar (X) y stepper.
4. Copy de UI en **inglés** (producto US), como en el diseño.
5. El TopBar del canvas trae `showBack` en `true` por defecto. En el flujo se usa en `false`.

## Fases

### Fase 0 — Plan ✅
Este documento + reglas de negocio versionadas.

### Fase 1 — Foundations ✅
- Tokens reales del canvas (`Tokens / Colors`, tipografía, radios, espaciado) → `primitives.css` / `semantic.css`.
- Íconos del diseño (relleno, 24×24) → `icons/registry`. Se agregan `eye` / `eye-off` (toggle del SSN, no están dibujados).
- Assets: logo marca/blanco, imágenes del landing, sellos del footer.
- Limpieza: se eliminan componentes placeholder que **no** existen en el diseño (Avatar, Badge, Divider, ListItem, Alert, MobileScreen).
- Foundations en Storybook actualizadas. Convención de copy → inglés.

**Resultado:** tokens del canvas en `primitives.css`/`semantic.css`; 32 íconos del canvas + `eye`/`eye-off`;
logo, sellos e imágenes en `assets/`; nuevas páginas *Typography*, *Iconography* y *Brand assets*;
placeholders eliminados. Los átomos que quedan (Button, Text, Input…) ya usan los tokens nuevos pero
**se reescriben en la Fase 2** para igualar el canvas (ej. Button pill de 48px con back como IconButton aparte).

### Fase 2 — Atoms ✅
`Button` (primary/secondary/tertiary/inverse · back a la izquierda · loading), `IconButton` (back/close, md/lg),
`Icon`, `Text`, `InputText` (label flotante, estados, clear, máscara phone/ssn/zip, revelar), `SelectInput` (select nativo),
`PickerField` (campo que abre sheet), `Checkbox`, `Spinner`, `ProgressBar`, `Logo`, `FabChat`, `Tag`, `ScanIllustration`,
`IconCircle` (40/64 px, tonos), `TextLink`. `Button` suma la variante `destructive` (propuesta en 2C).

### Fase 3 — Molecules · Organisms · Templates ✅
- Molecules: `TextField` (InputText + helper/error), `CheckboxLabel`, `OptionCard`, `InlineNotice` (boxed/plain),
  `SuggestionList`, `WheelPicker`, `StatusItem`, `FeatureCard`, `StatItem`, `StepCard`, `AccordionItem`, `SectionHeader`.
- Organisms: `TopBar` (title/logo/logo-white/large + stepper), `BottomActionBar` (anclado a teclado),
  `OptionCardGroup` (radiogroup), `BottomSheet`, `DatePickerSheet` (month-year / full-date), `StatusChecklist`,
  `DraggableFab`, `Footer`, `Hero`, `Accordion`.
- Templates: `StepScreen` (flujo), `LandingPage`.
- Del canvas actualizado: los pasos ya no llevan Footer; CTA anclado con back al lado; FAB encima de la barra;
  sheet de salida con X arriba a la derecha y "Keep going" en tertiary. Nuevas: `MessageBlock`, `ConfirmSheet`.

### Fase 4 — Domain + Application ✅
- Value objects: `Email`, `UsPhone`, `PersonName`, `BusinessName`, `MonthYear`, `UsAddress`/`ZipCode`/`UsState`, `DateOfBirth`, `Ssn`.
- Reglas del flujo: orden de pasos, numeración del stepper, progreso que nunca baja, ramas (income/ownership), elegibilidad por estado.
- Puertos: `ApplicationDraftRepository`, `ApplicantCheckService`, `AddressAutocompleteService`, `Clock`.
- Casos de uso por paso (`submitContact`, …, `runApplicantCheck`, `searchAddresses`, `getDraft`). Todo con tests unitarios.

### Fase 5 — Infrastructure + DI + Routing ✅
- Mocks intercambiables: autocomplete (sugerencias del prototipo), chequeo de cliente (nuevo / recurrente), reloj del sistema.
- Persistencia del borrador en `localStorage` **sin SSN ni fecha de nacimiento** (solo en memoria).
- React Router 8: rutas `/`, `/apply/*`, guardas que redirigen al primer paso incompleto (`StepGuard`).
- Modos QA: `?mock=slow` (2H) y `?mock=offline` (2I).

### Fase 6 — Pantallas del bloque 1 (+ estados del bloque 2) ✅
1A → 1J + view-models. Back conserva datos; Close sale al landing con el progreso guardado.
Destinos fuera del prototipo (gig, 50% o menos, "a job", estado no servido, conexión bancaria) → una única
página placeholder neutra, marcada como pendiente de diseño.

### Fase 7 — Bloque 2 ✅
Estados del bloque 2 integrados en las pantallas (sheets de salida/reanudar, no elegible, cuenta encontrada,
estado no servido, carga lenta, error de red, teclado).

### Fase 8 — QA 🟨
Hecho: axe en modo `error` sobre todas las stories (171 tests en verde), recorrido completo en el navegador
a 375×812 (1A→1J, 2B, 2C, 2D, 2E, 2F, 2G, 2H, 2I, deep link, Start over), build de app y Storybook.

**Pendiente (requiere dispositivo real):** comportamiento del CTA sobre el teclado en iOS Safari y Android Chrome
(la lógica usa VisualViewport + `interactive-widget=resizes-content`; en el navegador de escritorio no hay teclado virtual).

## Cómo probar los casos borde

| Caso | Cómo |
| --- | --- |
| 2B email inválido | Escribir `maria@gmail` y salir del campo |
| 2C salir | Tocar la X en cualquier paso |
| 2D reanudar | Avanzar unos pasos, "Yes, leave" y volver a "Get Your Advance" |
| 2E no elegible | 1D → "A job or other income" |
| 2F cliente recurrente | Email que empiece con `returning` (ej. `returning@fundo.test`) → salta 1H |
| 2G estado no servido | En 1H escribir `742 market` y elegir San Francisco, CA |
| 2H conexión lenta | Abrir la app con `?mock=slow` |
| 2I error de red | Abrir con `?mock=offline` o cortar la conexión |

## Casos borde que se aplican (no están dibujados)

- Teléfono: acepta pegado con `+1`/`1` inicial; área y central no empiezan en 0/1 (NANP).
- Nombres: letras Unicode + espacios, guion y apóstrofo internos (`O'Brien`, `Mary-Jane`); máx. 50.
- Email: trim + minúsculas.
- Errores: el CTA deshabilitado es el principal feedback; además, un mensaje inline **solo al salir del campo**
  y si el valor está completo pero es inválido (ej. email mal escrito). Pendiente de confirmar (ver abajo).
- DOB: el 18+ se valida al día exacto (el prototipo solo bloquea por mes).
- SSN: rechaza números inválidos (000/666/9xx, grupo 00, serie 0000); se muestra `XXX-XX-XXXX` al revelar.
- Checking: tiempo mínimo para que la animación se lea; si el servicio falla, continúa como cliente nuevo (no bloquea).
- Deep link a un paso sin completar los anteriores → redirige al primer paso incompleto.
- FAB de chat: nunca queda sobre el CTA anclado.

## Decisiones abiertas (requieren confirmación)

1. **Landing — legal**: el copy dice "…and to receive offers by email", lo que **agrupa marketing con Términos**
   y contradice la regla de negocio. **Aplicado:** se quita esa frase (confirmar con producto).
2. ~~Progreso que nunca baja~~ → resuelto por 2F: el progreso nunca retrocede (se muestra el máximo alcanzado).
3. ~~Errores inline~~ → resuelto por 2B: al blur y al Continue.
4. ~~Bloque 2~~ → existe; integrado en las Fases 2, 3 y 6.
5. **Botón con back**: los frames del bloque 2 muestran el CTA sin back; manda la regla del usuario (siempre con back).
6. **"Explore other options"** (2E) y **"Notify me"** (2G): destinos no definidos → se dejan como acciones sin destino (callback) y se registran.
