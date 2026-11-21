# desktop/ — Contexto

Plataforma **reservada**. Carpetas creadas para escalar; **no desarrollar todavía**.

## Cuando se active

- Misma anatomía y reglas que `mobile/` (ver `../context.md`).
- Stories: `title: 'Desktop/<Nivel>/<Componente>'` y `...desktopStory` (viewport 1440×900).
- Crear `desktop/index.ts` y los barrels por nivel (`atoms/index.ts`, …) al agregar el primer componente; importar como `@ds/desktop`.
- Reusar tokens. Tokens propios de desktop (gutters, anchos máximos) se agregan en `semantic.css` con prefijo `--desktop-`.
- Si un componente es igual en ambas plataformas, promoverlo a un nivel compartido en vez de duplicarlo.
- Documentar el inventario aquí, igual que en `mobile/context.md`.
