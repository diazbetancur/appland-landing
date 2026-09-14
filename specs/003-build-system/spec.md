# Feature Specification: Build System Migration

**Feature Branch**: `003-build-system`

**Created**: 2026-08-31

**Status**: Ready for Implementation

**Input**: User description: "Modernizar la configuración de Angular 21. El proyecto corre paquetes de Angular 21 con configuración de varias versiones atrás."

## Scope

### Business Goal

El proyecto ejecuta Angular 21.2 pero construye con `@angular-devkit/build-angular:browser`, el builder basado en webpack. Migrarlo a `@angular/build:application`, basado en esbuild, cumple tres cosas a la vez:

1. **Es prerequisito técnico del spec 004.** El builder `unit-test`, que habilita Vitest, valida su `buildTarget` y advierte que está diseñado para funcionar con `@angular/build:application`, con riesgo de fallos si se usa otro.
2. **Alinea la configuración con la versión instalada.** El builder webpack es el camino legacy en Angular 21.
3. **Probablemente elimina las cinco vulnerabilidades del proyecto.** Las cinco provienen del árbol de `@angular-devkit/build-angular`, y la migración elimina ese paquete del `package.json`.

### Position in the Migration Sequence

Segunda de cinco. La primera (`002-linting-and-formatting`) quedó cerrada con lint en 0 errores, 95 pruebas y build verde.

| Spec | Frente | Estado |
|---|---|---|
| 002 | Linting y formato | Cerrado |
| **003** | **Sistema de build** | **Este** |
| 004 | Karma a Vitest | Bloqueado por este |
| 005 | Red de seguridad de pruebas | Pendiente |
| 006 | Standalone e `inject()` | Pendiente |

### In Scope

- Parche de versión dentro de Angular 21, de 21.2.19 a 21.2.22.
- Migración de los cuatro targets del workspace al paquete `@angular/build`.
- Resolución de la caída que provoque el cambio de motor de compilación, si la hay.
- Actualización del README si cambia la ruta de los artefactos.
- Conservación de las 95 pruebas sobre el runner Karma, todavía sin cambiarlo.

### Out of Scope

- Cambiar el runner de pruebas. Es el spec 004.
- Migrar arquitectura a standalone. Es el spec 006.
- Subir a Angular 22.
- Integración continua.
- Cualquier cambio de código de aplicación que no sea consecuencia directa de la migración.

### Inherited Baseline

Medido al cierre del spec 002, sobre el commit `f931554`:

| Métrica | Valor |
|---|---|
| Pruebas | 95 pasando, código de salida 0 |
| Lint | 0 errores, 42 advertencias, `maxWarnings` en 42 |
| Formato | `format:check` en 0 |
| Build | código 0; **444.16 kB** iniciales, **111.17 kB** de transferencia |
| Vulnerabilidades | 5 (4 altas, 1 moderada), todas de `@angular-devkit/build-angular` |
| Angular | core 21.2.19, cli 21.2.20, build 21.2.20, devkit 21.2.20 |

Ruta de salida actual: `dist/appland`.

## Requirements

### Functional Requirements

- **FR-001**: Los paquetes de Angular deben quedar en la última versión de parche de la línea 21.2, sin cambio de versión mayor ni menor.
- **FR-002**: El target de compilación debe usar el builder basado en esbuild del paquete `@angular/build`.
- **FR-003**: Los targets de servidor de desarrollo, extracción de i18n y pruebas deben quedar en el mismo paquete, sin referencias colgantes al paquete eliminado.
- **FR-004**: El paquete del builder legacy debe quedar fuera de las dependencias del proyecto.
- **FR-005**: Ninguna opción de configuración vigente debe perderse en silencio. Las que el builder nuevo no soporte deben quedar registradas con su motivo.
- **FR-006**: El comando de servidor de desarrollo debe seguir funcionando.
- **FR-007**: Si la ruta de los artefactos cambia, la documentación del proyecto debe reflejarlo.
- **FR-008**: El comportamiento observable de la aplicación no debe cambiar.

### Non-Functional Requirements

- **NFR-001**: Las 95 pruebas deben seguir pasando, sobre Karma, sin modificar sus aserciones.
- **NFR-002**: El lint debe seguir en 0 errores y no más de 42 advertencias.
- **NFR-003**: El formato debe seguir verificándose limpio.
- **NFR-004**: El tamaño del bundle debe quedar registrado y comparado contra el baseline. Un aumento no bloquea, pero debe explicarse.

## Success Criteria

- **SC-001**: `npm run build` termina en 0.
- **SC-002**: `npm test` reporta 95 pasando.
- **SC-003**: `npm run lint` termina en 0.
- **SC-004**: `npm run format:check` termina en 0.
- **SC-005**: `npm start` levanta el servidor de desarrollo y sirve la aplicación.
- **SC-006**: `angular.json` no contiene ninguna referencia a `@angular-devkit/build-angular`, y `package.json` tampoco.
- **SC-007**: El tamaño del bundle queda comparado contra 444.16 kB / 111.17 kB, con la diferencia explicada.
- **SC-008**: El resultado de `npm audit` queda registrado, confirmando o refutando la desaparición de las cinco vulnerabilidades.
- **SC-009**: El usuario confirma por observación en navegador que la aplicación se comporta igual.

## Assumptions

- **A-001**: No existe integración continua, Dockerfile, configuración de hosting ni script de despliegue que dependa de la ruta de los artefactos. Verificado por inspección de la raíz del repositorio y del README.
- **A-002**: El runner de pruebas permanece Karma durante este spec.
- **A-003**: La arquitectura NgModule permanece intacta.

## Risks

- **R-001**: El presupuesto `anyComponentStyle` está declarado con `maximumError` en 6 kb, no como advertencia. esbuild calcula el tamaño de los estilos de componente de forma distinta a webpack, así que un SCSS que hoy pasa podría superar el umbral y **hacer fallar el build**. Es el riesgo más probable del spec. Mitigación: si ocurre, se decide con el usuario entre reducir el estilo o ajustar el umbral, sin ajustarlo por conveniencia sin avisar.
- **R-002**: La compilación de hojas de estilo cambia de motor. La migración incluye utilidades de reescritura de `@import` de CSS, señal de que interviene en las hojas. El proyecto tiene una hoja global, una parcial de tokens y 21 hojas de componente. Mitigación: revisión del diff que produzca la migración sobre archivos SCSS, más verificación visual.
- **R-003**: Las 95 pruebas correrán por primera vez sin webpack. Mitigación: es un paso aislado; si fallan, el fallo es atribuible únicamente a este cambio.
- **R-004**: El tamaño del bundle puede cambiar en cualquier dirección. Mitigación: se compara y se explica; no se acepta un aumento sin entender su causa.
- **R-005**: La verificación en navegador depende del usuario. Ninguna prueba automatizada del proyecto cubre estilos, assets ni arranque real. Mitigación: SC-009 queda explícitamente a cargo del usuario y el spec no se declara cerrado sin él.
