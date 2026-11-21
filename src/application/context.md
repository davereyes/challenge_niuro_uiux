# application/ — Contexto

Orquesta el dominio en **casos de uso**. No sabe de React ni de HTTP.

## Contenido

| Archivo | Rol |
| --- | --- |
| `use-cases/UseCases.ts` | **Contrato** expuesto a la UI (`useUseCases()`): `clock` + `apply.*`. |
| `use-cases/apply/StepPersistence.ts` | Commit común de un paso: API → draft → progreso → caché sin identity. |
| `use-cases/apply/SubmitSteps.ts` | `Submit{Contact,Name,IncomeSource,Business,Ownership,HomeAddress,Identity}UseCase`. |
| `use-cases/apply/RunApplicantCheckUseCase.ts` | 1G→: cuenta existente + pasos saltables. Si falla, sigue como cliente nuevo. |
| `use-cases/apply/DraftLifecycle.ts` | `GetApplicationDraft` (reanudar, expira a 30 días) y `StartOver`. |
| `use-cases/apply/AddressUseCases.ts` | `SearchAddresses` (≥3 caracteres) y `NotifyWhenAvailable` (2G). |
| `ports/` | `Clock`, `ApplicationApi`, `ApplicantCheckService`, `AddressAutocompleteService`, `WaitlistService`, `ServiceError`. |
| `dto/StepSubmission.ts` | Resultado `{ draft, destination }` y error `validation` / `network`. |

## Reglas

- Solo importa `@domain/*` y `@shared/*`.
- Sin parameter properties en constructores (`erasableSyntaxOnly`): campos explícitos.
- Devuelven `Result`; nunca lanzan por errores esperables (validación, red).
- Cada caso de uso tiene test con fakes en memoria (`applyUseCases.test.ts`).

## Agregar un caso de uso

1. Clase en `use-cases/<feature>/` + test. 2. Agregarlo a `UseCases.ts`. 3. Instanciarlo en `app/di/container.ts`.
