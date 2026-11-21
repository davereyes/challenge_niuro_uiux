# app/ — Contexto

**Composition root.** Arranca la app y conecta las piezas.

| Archivo | Rol |
| --- | --- |
| `App.tsx` | `AppProviders` + `RouterProvider`. |
| `providers/AppProviders.tsx` | StrictMode + `UseCasesProvider` (contenedor creado una vez). |
| `di/container.ts` | **Único lugar** que instancia adaptadores (hoy mocks) y casos de uso. Cambiar un mock por el real = cambiar una línea aquí. |
| `router/router.tsx` | React Router 8: `/` landing · `/apply/{contact,name,income,business,ownership,checking,address,identity}` con `StepGuard` · `/apply/not-eligible` (2E) · `/apply/next/{gig,ownership,bank}` (placeholders). |

## Reglas

- Puede importar de todas las capas (es la capa más externa). Solo cableado: nada de UI ni reglas.
