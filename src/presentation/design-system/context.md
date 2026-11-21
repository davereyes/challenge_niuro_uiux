# design-system/ — Contexto

**Este directorio ES el Storybook y el Atomic Design del proyecto.** Fuente de verdad de la UI.
Storybook solo carga stories/MDX de esta carpeta (`.storybook/main.ts`).

## Estructura

```
design-system/
├── Introduction.mdx        # Portada del Storybook
├── foundations/            # MDX: Colors, Typography, Spacing & Radius, Iconography, Brand assets
├── tokens/                 # CSS variables (primitives + semantic) + nombres en TS
├── icons/                  # Registro de íconos del canvas (compartido por plataformas)
├── assets/                 # Logo (marca/blanco) y sellos del footer, exportados del canvas
├── storybook/              # Helpers: viewports y `mobileStory` / `desktopStory`
├── mobile/                 # atoms / molecules / organisms / templates  ← activo
└── desktop/                # misma jerarquía                            ← reservado
```

Import público: `import { Button, TopBar } from '@ds/mobile'`.

## Reglas (estrictas)

1. **UI pura**: sin `@domain`, `@application`, `@infrastructure`, `@app` ni `features` (oxlint lo bloquea). Datos y callbacks por props.
2. **Jerarquía**: un nivel solo importa de niveles inferiores. Atom ← Molecule ← Organism ← Template.
3. **Todo componente tiene story.** Sin story no existe.
4. **Stories**:
   - `title: 'Mobile/<Nivel>/<Componente>'` y `...mobileStory` en el meta (fija el viewport 390×844).
   - `satisfies Meta<typeof X>` + `args` por defecto para que todos los controles funcionen.
   - **Story = variante visual**. **Control = modificador/estado** (ver tabla abajo).
   - Ocultar del panel la prop que define la variante: `argTypes: { variant: { table: { disable: true } } }`.
   - Callbacks con `fn()`; si hay interacción, `play()` con `expect` (se ejecuta como test).
   - Stories solo-documentación: `tags: ['!test']`.
5. **Estilos**: CSS Modules + tokens semánticos. Nada de hex/px sueltos.
6. **A11y**: el addon está en `error`. Touch target ≥ 44px, `focus-visible`, nombre accesible siempre.
7. Si mobile y desktop terminan con un componente idéntico, se promueve a un nivel compartido (`design-system/shared/<nivel>`) en lugar de duplicar. Decidirlo cuando ocurra; hoy no existe.

## ¿Variante o control?

| Es **story/variante** si… | Es **control** si… |
| --- | --- |
| Cambia la identidad visual (primary vs secondary) | Es un booleano/modificador (`showBackIcon`, `fullWidth`) |
| Cambia el elemento/semántica (div vs button) | Es un estado (`disabled`, `loading`, `invalid`, `checked`) |
| Cambia el ícono/rol por defecto (Alert info vs danger) | Es tamaño, texto, ícono opcional, alineación |

## Checklist para un componente nuevo

1. Elegir nivel y plataforma.
2. Crear `Nombre/{Nombre.tsx, Nombre.module.css, Nombre.stories.tsx, index.ts}`.
3. Exportar en el barrel del nivel.
4. Actualizar el inventario en `mobile/context.md` (o desktop).
5. `npm run check`.
