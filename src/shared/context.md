# shared/ — Contexto

Utilidades **transversales y agnósticas**. Cualquier capa puede importarlas; `shared` no importa nada del proyecto ni React.

| Archivo | Uso |
| --- | --- |
| `types/result.ts` | `Result<T, E>`, `ok()`, `err()` — errores explícitos en domain/application. |
| `utils/cx.ts` | Une classNames condicionales (reemplazo mínimo de `clsx`). |

## Reglas

- Solo funciones puras y tipos. Si algo necesita React → `presentation/hooks`. Si es de negocio → `domain`.
- Cada utilidad con su `*.test.ts`.
