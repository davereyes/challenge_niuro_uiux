# Niuro — challenge_niuro_uiux

App React mobile-first con **Clean Architecture**, **SOLID** y **Atomic Design** documentado en **Storybook**.

> Producto: **Fundo — Apply Now** (bloques 1 y 2 del canvas de Claude Design). Plan y casos borde en `docs/plan/apply-now.md`.

## Requisitos

- Node ≥ 22.12
- npm

## Empezar

```bash
npm install
npm run storybook   # design system → http://localhost:6006
npm run dev         # app → http://localhost:5173
npm run check       # typecheck + lint + tests (unit, stories, a11y)
```

## Estructura

```
src/
├── domain/          # negocio puro
├── application/     # casos de uso
├── infrastructure/  # adaptadores (HTTP, storage)
├── presentation/
│   ├── design-system/   # Storybook: tokens, mobile/, desktop/
│   ├── features/        # pages + view-models
│   └── di/              # acceso a casos de uso
├── app/             # composition root
└── shared/          # utilidades
```

Reglas completas en [CLAUDE.md](CLAUDE.md) y en el `context.md` de cada carpeta.

## Probar casos borde

- `?mock=slow` → respuestas lentas ("Still working…")
- `?mock=offline` → error de red ("Try again")
- Email `returning@fundo.test` → cliente recurrente (salta la dirección)
- Dirección `742 market` → California (estado no servido)
