# Specification Quality Checklist: Karma to Vitest Migration

**Purpose**: Validar completitud y calidad de la especificación
**Created**: 2026-08-31
**Feature**: [Feature specification](../spec.md)

## Nota de adaptación

Como en los specs 002 y 003, el ítem "no implementation details" de la plantilla del 001 no aplica: esta feature es infraestructura de pruebas. Se sustituye por el requisito de que toda elección esté respaldada con evidencia verificable.

## Content Quality

- [x] Cada elección técnica está justificada con evidencia verificable
- [x] La decisión de entorno (navegador real frente a jsdom) está justificada con evidencia del código, no con preferencia
- [x] Legible por alguien que no participó en la exploración
- [x] Todas las secciones obligatorias completas

## Requirement Completeness

- [x] No quedan marcadores de aclaración pendiente
- [x] Los requisitos son verificables y no ambiguos
- [x] Los criterios de éxito se expresan como resultado observable de un comando
- [x] El alcance está acotado, con la paridad declarada como criterio en vez de la mejora
- [x] Dependencias y supuestos identificados
- [x] Riesgos identificados con mitigación concreta

## Evidence Quality

- [x] El inventario de API de Jasmine se midió con cadenas fijas, y se documentó que la medición anterior era falsa por un error de escape
- [x] La incompatibilidad de `matchMedia` con jsdom se verificó en el código, no se supuso
- [x] Las restricciones de versión se leyeron de los `peerDependencies` reales
- [x] El comportamiento del builder se verificó leyendo su `schema.json` y su código fuente
- [x] Los tres hallazgos de causa raíz están documentados con síntoma, causa e intentos fallidos

## Feature Readiness

- [x] Cada requisito funcional tiene criterio de aceptación claro
- [x] Los criterios de éxito se verificaron con salidas reales de comando
- [x] Las 95 pruebas pasan sobre el runner nuevo, sin cambios en sus aserciones
- [x] Cero código de aplicación tocado
- [ ] El usuario revisó los documentos escritos del spec

## Honestidad sobre los errores cometidos en este spec

Registrados porque el valor del documento depende de no maquillarlos:

1. **Medición previa falsa.** Se reportó al usuario "30 call sites, cero `spyOn`". El patrón `grep -E "spyOn("` tenía un paréntesis sin escapar y devolvía cero en silencio. Los valores reales: 35 call sites, 5 `spyOn`, 7 `tick`. Es el segundo error del mismo tipo en esta serie de specs; el primero fue con `\r` en la verificación de fines de línea del spec 002.
2. **Lectura incorrecta de un conteo.** Se afirmó que los errores AOT habían bajado de 121 a 72 gracias a una hipótesis propia. Falso: 121 era el total de líneas `ERROR` de cualquier tipo y los `NG` eran 72 antes y después. La hipótesis no había servido de nada.
3. **Hipótesis equivocada sostenida durante dos intentos.** Se atribuyó el fallo de `fakeAsync` a que faltaba declarar `zone.js/testing`, cuando el builder ya lo inyectaba automáticamente. Se resolvió al leer el código del builder en vez de seguir probando configuraciones.

## Puntos de parada

- [x] T005, ejecución previa a la conversión: cumplió su propósito y evitó confundir 72 errores de configuración con daño de la conversión.
- [x] T010, conteo exacto de 95: verificado.
- [ ] T018, autorización de commit del usuario.
