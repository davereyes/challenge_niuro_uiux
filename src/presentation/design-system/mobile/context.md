# mobile/ — Contexto

Plataforma **activa**. Componentes pensados para 360–430px de ancho, táctiles, con safe areas de iOS.

## Inventario

Stories = variantes visuales. Controles = estados y modificadores. Actualizar al cambiar un componente.

### Atoms ✅ (Fase 2)
| Componente | Stories (variantes) | Controles principales |
| --- | --- | --- |
| `Button` | Primary, Secondary, Tertiary, Inverse, Destructive (propuesta 2C) | `label`, `showBackIcon` (+`onBack`), `loading`, `disabled`, `type` |
| `IconButton` | Back, Close | `icon`, `label`, `size` (md 44 / lg 48), `disabled` |
| `Icon` | Default, Gallery | `name`, `size` (xs/sm/md/lg), `label` |
| `Text` | Display, Title, Heading, Section, Stat, Headline, Lead, Body, BodySmall, Callout, Caption, Micro (+ Scale) | `tone`, `align`, `weight`, `truncate` |
| `InputText` | Text, Phone, Email, Secret (SSN) | `value`, `invalid`, `disabled`, `readOnly`, `icon`, `mask`, `revealable` |
| `SelectInput` | Default | `value`, `invalid`, `disabled` |
| `PickerField` | Default | `value`, `active`, `invalid`, `disabled` |
| `Checkbox` | Default | `checked`, `invalid`, `disabled` |
| `Spinner` | Brand, Current | `size`, `label` |
| `ProgressBar` | Default, OnImage | `value` (0–100) |
| `Logo` | Brand, White | `size` |
| `FabChat` | Default | `label` |
| `Tag` | Default | `label` |
| `IconCircle` | Surface, Brand, Danger, Success, OnBrand | `icon`, `size` (md 40 / lg 64) |
| `TextLink` | Inline, Standalone | `tone`, `href` / `onClick` |
| `ScanIllustration` | Default | — (decorativa, respeta reduced motion) |

### Molecules ✅ (Fase 3)
| Componente | Stories | Controles / notas |
| --- | --- | --- |
| `TextField` | Default, WithError | InputText + `helperText` / `errorMessage` (aria-describedby, role="alert") |
| `CheckboxLabel` | Default | `checked`, `invalid`, `disabled` |
| `OptionCard` | Default | `selected`, `icon`, copy. Usar dentro de `OptionCardGroup` |
| `InlineNotice` | Info (1H), Hint (1D), Secure (1I), Error (2I) | `title`, texto |
| `SuggestionList` | Default | `activeIndex`; patrón combobox (teclado en el input) |
| `WheelPicker` | Default | columnas con scroll-snap; ítems `disabled` rebotan |
| `StatusItem` | Default | `status` pending/active/done |
| `MessageBlock` | Page (2E/2F), Sheet (2C/2D) | `icon`, `tone`, copy |
| `FeatureCard` | Brand, Neutral, Image | landing "Who we work with" |
| `StatItem` | Default | landing "facts" |
| `StepCard` | Brand, Neutral | landing "What to expect" |
| `AccordionItem` | Default | `open` |
| `SectionHeader` | Default | `eyebrow`, `title` + `titleMuted`, `description` |

### Organisms ✅ (Fase 3)
| Componente | Stories | Controles / notas |
| --- | --- | --- |
| `TopBar` | Title, Logo, LogoOnImage, Large | `showBack` (off en el flujo), `showClose`, `showStepper`, `progress` |
| `BottomActionBar` | StepCta, Saving (2H), TwoActions (2E) | Anclado + sobre el teclado; publica `--bottom-bar-height` |
| `DraggableFab` | Default | Arrastrable, se pega a los lados, se oculta con teclado |
| `OptionCardGroup` | Default | radiogroup con flechas (1D, 1G) |
| `BottomSheet` | Default | `<dialog>` nativo: Escape, tap afuera, swipe down, `showClose` |
| `PickerSheet` | — (base) | Cancel · Title · Done + WheelPicker |
| `MonthYearPickerSheet` | Default | `max` (mes actual), `minYear` (1F) |
| `DatePickerSheet` | Default | `max` (hoy − 18 años), `defaultValue` 1990-01-01 (1J) |
| `ConfirmSheet` | Leave (2C), Resume (2D) | acciones apiladas |
| `StatusChecklist` | Default | live region (1G→) |
| `Hero` | Default | landing 1A |
| `Accordion` | Default | FAQ, uno abierto a la vez |
| `Footer` | Default | landing |

### Templates ✅ (Fase 3)
| Componente | Stories | Notas |
| --- | --- | --- |
| `StepScreen` | FormStep, Automatic, WithErrorBanner | TopBar sin back + contenido + CTA anclado + FAB + overlays |
| `LandingPage` (+ `LandingSection`) | Default | hero · secciones · footer |

> Accesibilidad: `#6A7282` sobre `#F4F5F7` da 4.43:1 (falla AA). Para texto muted sobre superficies grises
> se usa `--color-text-muted-on-subtle` (#636B7B, 4.91:1). Desviación mínima del canvas, documentada.

## Reglas específicas de mobile

- Touch target mínimo `--touch-target-min` (44px) en todo lo interactivo.
- Inputs con `font-size` ≥ 16px (evita zoom en iOS).
- Respetar `env(safe-area-inset-*)` en barras fijas (ya aplicado en TopBar / BottomActionBar).
- Gutter horizontal: `--mobile-gutter` (24px, como el canvas).
- Viewports de Storybook: `mobile` (390×844, por defecto) y `mobileSmall` (360×740) para probar textos largos.
