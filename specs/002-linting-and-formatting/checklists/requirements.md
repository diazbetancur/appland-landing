# Specification Quality Checklist: Linting and Formatting Baseline

**Purpose**: Validar completitud y calidad de la especificación antes de implementar
**Created**: 2026-08-31
**Feature**: [Feature specification](../spec.md)

## Nota de adaptación

La plantilla del spec 001 incluye el ítem "No implementation details (languages, frameworks, APIs)". Aquí no aplica y no se marca como cumplido por conveniencia: esta feature **es** infraestructura de desarrollo, así que herramientas y versiones son su contenido legítimo. El ítem se sustituye por su equivalente útil en este contexto: que toda elección técnica esté justificada con evidencia verificable en vez de preferencia.

## Content Quality

- [x] Cada elección técnica está justificada con evidencia verificable, no con preferencia
- [x] Enfocada en el valor para el flujo de trabajo del equipo
- [x] Legible por alguien que no participó en la exploración
- [x] Todas las secciones obligatorias completas

## Requirement Completeness

- [x] No quedan marcadores de aclaración pendiente
- [x] Los requisitos son verificables y no ambiguos
- [x] Los criterios de éxito son medibles
- [x] Los criterios de éxito se expresan como resultado observable de un comando
- [x] El alcance está claramente acotado, con lo excluido enumerado
- [x] Dependencias y supuestos identificados
- [x] Riesgos identificados con mitigación concreta

## Evidence Quality

- [x] Las cifras del baseline provienen de medición, no de estimación
- [x] El método de medición está declarado
- [x] Las restricciones de versión se contrastaron contra lo instalado en el proyecto
- [x] Lo que no se pudo medir sin instalar está declarado como tal, no omitido
- [x] Las condiciones preexistentes ajenas al trabajo quedan registradas

## Feature Readiness

- [x] Cada requisito funcional tiene criterio de aceptación claro
- [x] La posición de este spec en la secuencia de cinco está justificada
- [x] La deuda que este spec deja abierta tiene destino explícito
- [x] Los criterios de éxito se verificaron con salidas reales de comando
- [ ] El usuario revisó los documentos escritos del spec

  Sin marcar a propósito. El usuario aprobó el diseño en conversación y autorizó arrancar, pero no ha leído `spec.md`, `plan.md` ni `tasks.md` como documentos. Queda pendiente de su revisión.

## Open Decisions Requiring User Input

Todas resueltas por el usuario durante la ejecución:

- [x] Rama de trabajo (T001): rama nueva `002-linting-and-formatting`, creada desde el HEAD de `001-appland-home-redesign`.
- [x] Destino del cambio preexistente en `src/assets/images/clients/GrupoTerra.png` (T002): reemplazo intencional, va como commit de activo separado.
- [x] Alcance de resolución tras el inventario real de lint (T007): confirmado; los cuatro errores se resuelven en el código, sin supresiones.
- [x] `LanguageService`, código muerto que contradice el spec 001: se tipa y se deja en el árbol. El soporte multiidioma, si alguna vez se conecta, requiere su propio spec. La deuda queda registrada en `plan.md` y en el encabezado de `language.service.spec.ts`.

## Deuda registrada para specs posteriores

- 42 advertencias de modernización arquitectural, con destino a `error` en el spec 006.
- Cuatro archivos de especificación declaran componentes stub con `standalone: false` y también deberán migrarse en el spec 006.
- `angular.json` fija `"skipTests": true` para ocho tipos de schematic. Es la causa raíz de los archivos sin pruebas y corresponde decidirla en el spec 005.
- `LanguageService` sigue siendo código muerto; su conexión o eliminación es un spec propio.
- No existe `.gitattributes` con `core.autocrlf` en `true`. Hoy sin daño observable; condición latente.
- Cinco vulnerabilidades de `npm audit`, todas preexistentes y provenientes de `@angular-devkit/build-angular`. Probable resolución colateral en el spec 003.
- `card-template.ts` y `card-template.html` no siguen la convención `*.component.*` del resto del proyecto, lo que ya causó que Prettier eligiera el parser equivocado. Renombrar queda fuera de alcance aquí.
