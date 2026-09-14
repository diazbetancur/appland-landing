# Specification Quality Checklist: Standalone Migration

**Purpose**: Validar completitud y calidad de la especificación
**Created**: 2026-08-31
**Feature**: [Feature specification](../spec.md)

## Content Quality

- [x] El problema central, la pérdida del `scrollOffset`, se identificó **antes** de migrar, leyendo el código del router
- [x] El inventario de providers a preservar se tomó del código real antes de tocarlo
- [x] La alternativa descartada está registrada con su motivo
- [x] Todas las secciones obligatorias completas

## Requirement Completeness

- [x] No quedan marcadores de aclaración pendiente
- [x] FR-008 exige demostrar que cada guardia reescrito puede fallar
- [x] El alcance está acotado, con lo excluido enumerado
- [x] Riesgos identificados con mitigación concreta

## Evidence Quality

- [x] `withInMemoryScrolling` se leyó en su implementación, no en su documentación, para confirmar que ignora `scrollOffset`
- [x] Se verificó que `provideRouter` no provee `ROUTER_CONFIGURATION` ni `ROUTER_SCROLLER`
- [x] Se verificó que `provideAppInitializer` y `ViewportScroller.setOffset` existen con la firma necesaria
- [x] Se verificó que los servicios de CDK a11y son `providedIn: 'root'` antes de retirar `A11yModule` del arranque
- [x] La limitación del guardia de opciones de scroll está declarada en el propio archivo de prueba, no escondida
- [x] R-006 se midió empíricamente y el resultado se registró sin aplicarlo, por estar fuera de alcance

## Feature Readiness

- [x] Cero `standalone: false`, cero `@NgModule`, cero inyección por constructor
- [x] Los cuatro guardias se demostraron capaces de fallar
- [x] El inventario de providers se confirmó uno por uno contra la configuración final
- [x] Los criterios de éxito automatizables se verificaron con salidas reales de comando
- [ ] El usuario confirmó en navegador que la navegación a secciones cae donde debe (SC-009)
- [ ] El usuario revisó los documentos escritos del spec

## Por qué el orden de los cinco specs importó

Este spec habría perdido el `scrollOffset` en silencio si se hubiera ejecutado primero. Lo que lo impidió:

- El **spec 002** puso el linter que midió la deuda y que ahora la declara cerrada.
- El **spec 003** puso el builder sobre el que corre todo.
- El **spec 004** puso el runner con el que se verificó cada paso.
- El **spec 005** puso el guardia que detiene exactamente esta regresión, y lo dejó demostrado.

El riesgo más grave del spec, la pérdida de `provideZoneChangeDetection`, **no lo detectó ninguna prueba**: lo detectó el inventario escrito de providers. Vale la pena registrarlo: no todo se cubre con automatización.

## Puntos de parada

- [x] T015, demostración de fallo de los guardias reescritos: cumplida y registrada.
- [ ] T022, verificación en navegador por parte del usuario.
- [ ] T023, autorización de commit.
