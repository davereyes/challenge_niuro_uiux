# tokens/ — Contexto

Design tokens en **CSS custom properties**, tomados del canvas de Claude Design (`Tokens / Colors` + specs de componentes).
Los comentarios en `semantic.css` usan los nombres del canvas (`color.brand.primary`, `color.input.filled`, …).

| Archivo | Rol |
| --- | --- |
| `primitives.css` | Valores crudos: paleta, escala tipográfica, espaciado (grid 4pt), radios, motion. |
| `semantic.css` | Intención → primitivo (`--color-action-primary-bg: var(--color-brand-600)`). **Lo único que usan los componentes.** |
| `reset.css` | Reset global mínimo + `prefers-reduced-motion`. |
| `index.css` | Entrada única; la importan `main.tsx` y `.storybook/preview.tsx`. |
| `tokens.ts` | Solo **nombres** de tokens y la escala tipográfica para Foundations. Valores únicamente en CSS. |

## Reglas

- Componentes → solo tokens **semánticos**. Nunca primitivos ni valores literales.
- Nuevo color/espacio: agregar primitivo (si hace falta) + semántico, y documentarlo en `tokens.ts` si debe verse en Foundations.
- Si el canvas cambia un valor: se actualiza aquí; las APIs de componentes no cambian.
- Valores derivados (no están en el canvas): `--color-navy-600/700` (hover/pressed del primario). Confirmar con diseño.
- Pantallas en blanco (`--color-bg-canvas`); `--color-bg-page` (#F9FAFB) queda para fondos de página si se usan.
- Dark mode (futuro): redefinir semánticos bajo `[data-theme='dark']` / `prefers-color-scheme`, sin tocar componentes.
