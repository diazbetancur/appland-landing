# Specification Quality Checklist: Build System Migration

**Purpose**: Validar completitud y calidad de la especificación antes de implementar
**Created**: 2026-08-31
**Feature**: [Feature specification](../spec.md)

## Nota de adaptación

Igual que en el spec 002, el ítem "no implementation details" de la plantilla del 001 no aplica: esta feature es infraestructura de build, así que builders y versiones son su contenido legítimo. Se sustituye por el requisito de que toda elección esté respaldada con evidencia verificable.

## Content Quality

- [x] Cada elección técnica está justificada con evidencia verificable
- [x] El objetivo de negocio está declarado, incluyendo por qué este spec va antes que el 004
- [x] Legible por alguien que no participó en la exploración
- [x] Todas las secciones obligatorias completas

## Requirement Completeness

- [x] No quedan marcadores de aclaración pendiente
- [x] Los requisitos son verificables y no ambiguos
- [x] Los criterios de éxito se expresan como resultado observable de un comando, salvo el visual, que declara quién lo ejecuta
- [x] El alcance está acotado, con lo excluido enumerado
- [x] Dependencias y supuestos identificados
- [x] Riesgos identificados con mitigación concreta

## Evidence Quality

- [x] El comportamiento de la migración se verificó leyendo su código fuente, no su documentación
- [x] La compatibilidad de opciones del builder de pruebas se verificó contra su `schema.json`
- [x] El supuesto de que nada depende de la ruta de salida se verificó por inspección del repositorio
- [x] El baseline heredado del spec 002 está citado con cifras
- [x] Lo que no se puede afirmar sin medir queda declarado como pendiente de medición, no como hecho

## Feature Readiness

- [x] Cada requisito funcional tiene criterio de aceptación claro
- [x] El riesgo más probable está identificado y con plan de reporte al usuario en vez de resolución silenciosa
- [x] Los criterios de éxito automatizables se verificaron con salidas reales de comando
- [x] El usuario confirmó el comportamiento de la aplicación en navegador (SC-009)
- [ ] El usuario revisó los documentos escritos del spec

## Limpieza asociada, autorizada por el usuario

`tmp/` contenía 12.477 archivos y 66 MB, en su mayoría directorios de perfil de usuario de Chrome generados por las validaciones del spec 001. Se eliminaron 18 directorios de perfil y quedaron 73 archivos con 16 MB.

Se conservó deliberadamente todo lo que constituye evidencia: 53 capturas, los dos `report.json` (uno de ellos citado en `specs/001-appland-home-redesign/quickstart.md`), los scripts `acceptance_validate.py` y `cdp_validate.py`, y los logs de servidor. `tmp/` está en `.gitignore` y git nunca rastreó ninguno de esos archivos, así que la limpieza no afecta al repositorio ni a su historia.

## Precisión sobre la predicción del plan

El `plan.md` acertó en el comportamiento de la migración porque se leyó su código fuente antes de ejecutarla: los cuatro builders, el renombre de `main`, la conversión de `outputPath`, la eliminación de `buildOptimizer` y `vendorChunk`, y la preservación íntegra de las opciones del target de test. Cero discrepancias en esa parte.

Falló en tres puntos, todos registrados:

1. No previó que la migración modifica `tsconfig.json`.
2. No previó que `ng update --migrate-only` sin fijar la mayor descarga un CLI temporal de la última mayor y aplica su tabla de versiones. Ese fue el incidente del spec.
3. Esperaba que desaparecieran las cinco vulnerabilidades; desaparecieron cuatro.

## Decisiones tomadas sin consultar, sujetas a veto del usuario

- [x] Ruta de salida: se acepta el default `dist/appland/browser` en vez de forzar la ruta plana. Justificado en D-002 por la ausencia de cualquier configuración que dependa de la ruta. El usuario fue informado antes de implementar.
- [x] Rama: se creó `003-build-system` siguiendo la convención establecida en el spec 002, una rama por spec.

## Puntos de parada previstos

- [ ] T008: si el presupuesto `anyComponentStyle` hace fallar el build, se reporta antes de tocar el umbral.
- [ ] T018: verificación en navegador por parte del usuario.
- [ ] T019: autorización de commit.
