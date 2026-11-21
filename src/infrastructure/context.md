# infrastructure/ — Contexto

**Adaptadores** que implementan los puertos de `domain` / `application`. Hoy son **mocks** intercambiables
(no hay backend todavía). Para pasar a producción se reemplaza el adaptador en `app/di/container.ts`.

| Archivo | Implementa | Notas |
| --- | --- | --- |
| `storage/LocalStorageDraftRepository.ts` | `ApplicationDraftRepository` | Caché del borrador (`fundo.apply.draft`, versión de esquema). Nunca guarda identity. Tolera storage bloqueado o corrupto. |
| `api/MockApplicationApi.ts` | `ApplicationApi` | Guarda cada paso con latencia simulada. |
| `services/MockApplicantCheckService.ts` | `ApplicantCheckService` | Email que empieza con `returning` → cliente existente "Maria" con dirección (salta 1H, 2F). |
| `services/MockAddressAutocompleteService.ts` | `AddressAutocompleteService` | Como el prototipo: conserva el número y ofrece calles; "742 market" → San Francisco, CA (prueba 2G). |
| `services/MockWaitlistService.ts` | `WaitlistService` | "Notify me" (2G). |
| `clock/SystemClock.ts` | `Clock` | `new Date()`. |
| `http/networkSimulation.ts` | — | Latencia (`VITE_MOCK_LATENCY_MS`, default 600 ms) y modos QA por URL. |

## Modos de QA (query string)

- `?mock=slow` → respuestas de 12 s: botón en loading, inputs bloqueados y "Still working…" a los 10 s (2H).
- `?mock=offline` → todas las peticiones fallan: banner de error + "Try again" (2I). También si el dispositivo está offline.

## Reglas

- Puede importar `@domain`, `@application`, `@shared`. **Nunca** `@presentation` ni `@app`.
- Variables de entorno solo aquí o en `app/` (`import.meta.env.VITE_*`).
- Datos sensibles (SSN, fecha de nacimiento) no se escriben en ningún storage del dispositivo.
