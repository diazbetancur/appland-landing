# Tasks: Build System Migration

**Input**: Design documents from `specs/003-build-system/`

**Prerequisites**: `spec.md`, `plan.md`

**Tests**: Este spec no debería cambiar código de aplicación, así que no debería requerir pruebas nuevas. Si la migración toca algún `.ts`, se revisa el cambio y se le aplica la regla acordada: ajustar o completar las pruebas del archivo tocado.

**Organization**: Cuatro fases. Cada una cierra con verificación antes de la siguiente, para que cualquier fallo sea atribuible a un solo cambio.

---

## Phase 1 — Parche de versión

**Goal**: Quedar en el último parche de la línea 21.2 antes de cambiar de builder.

- [x] T001 Ejecutar `ng update @angular/core@21 @angular/cli@21` y registrar las versiones resultantes. Depende de: ninguna. Resultado: 21.2.22 instalado, sin cambio de mayor ni menor (FR-001). **Ejecutado 2026-08-31**: código de salida 0. Ocho paquetes actualizados a 21.2.22. `@angular/cdk` quedó en 21.2.14, que se verificó es el último parche de su propia línea 21.2. Requirió `--allow-dirty` porque los documentos de este spec estaban sin seguimiento; se confirmó antes que no había archivos modificados que el comando pudiera pisar, y se eligió esa vía en vez de comitear sin autorización del usuario.
- [x] T002 Revisar el diff completo del parche, confirmando que no toca código de aplicación. Depende de: T001. Resultado: alcance verificado, no supuesto. **Verificado**: solo `package.json` y `package-lock.json`.
- [x] T003 Verificar `build`, `test`, `lint` y `format:check` sobre el parche, todavía con webpack. Depende de: T002. Resultado: el parche queda aislado antes de la migración. **Ejecutado**: build código 0 con 447.21 kB / 111.94 kB; 95 pruebas; lint 0 errores y 42 advertencias; formato limpio.

**Checkpoint**: Parche verde sobre webpack. Cualquier fallo posterior es atribuible a la migración, no a la versión.

---

## Phase 2 — Migración del builder

**Goal**: Pasar los cuatro targets a `@angular/build`.

- [x] T004 Ejecutar la migración `use-application-builder`, capturando todas las advertencias. Depende de: T003. Resultado: los cuatro targets convertidos y `@angular-devkit/build-angular` eliminado (FR-002, FR-003, FR-004). **Ver el incidente registrado abajo: el primer intento introdujo una dependencia de Angular 22 y hubo que revertir y rehacer.** Comando final correcto: `npx ng update @angular/cli@21 --migrate-only --name=use-application-builder --allow-dirty`. Resultado: código 0, tres archivos modificados, con la advertencia esperada sobre el cambio de ruta de salida.
- [x] T005 Revisar el diff de `angular.json` contra lo que el `plan.md` predijo. Depende de: T004. Resultado: ninguna opción perdida en silencio (FR-005). **Verificado**: los cuatro builders convertidos exactamente como se predijo; `main` renombrado a `browser`; `outputPath` convertido a `{ "base": "dist/appland" }`; `buildOptimizer` y `vendorChunk` eliminados de la configuración `development`, conservando `optimization`, `extractLicenses`, `sourceMap` y `namedChunks`. El target de test conservó sus seis opciones íntegras. Cero discrepancias frente a la predicción.
- [x] T006 Revisar si la migración tocó archivos SCSS o de código. Depende de: T004. Resultado: R-002 atendido por revisión. **Verificado: no tocó ningún `.scss`, `.ts` ni `.html`.** El riesgo R-002 no se materializó. El único archivo no previsto en el mapa del `plan.md` fue `tsconfig.json`, con dos cambios: agrega `esModuleInterop: true` y elimina `downlevelIteration: true`, ambos coherentes con el objetivo esbuild del builder nuevo.

### Incidente: la migración introdujo una dependencia de Angular 22

**Qué pasó.** El primer intento se ejecutó como `npx ng update @angular/cli --migrate-only --name=use-application-builder`, **sin fijar la versión mayor**. El CLI respondió `The installed Angular CLI version is outdated. Installing a temporary Angular CLI versioned latest to perform the update` e instaló un CLI temporal de la línea 22 para correr la migración. Esa migración escribió en `package.json` la entrada `"@angular/build": "^22.1.6"`, porque su tabla interna de versiones apunta a Angular 22.

**Por qué era grave.** `@angular/build` 22.1.6 declara peers `@angular/core: ^22.0.0`, `@angular/compiler-cli: ^22.0.0` y `typescript: >=6.0 <6.1`. El proyecto tiene core 21.2.22 y TypeScript 5.9.3. npm lo instaló de todas formas, dejando una incompatibilidad dura y violando FR-001.

**Cómo se resolvió.** Se revirtieron los cuatro archivos tocados con `git checkout --`, se restauró `node_modules` con `npm ci` para volver exactamente al lockfile del cierre del spec 002, y se rehicieron ambas operaciones fijando la mayor en las dos: `@angular/core@21 @angular/cli@21` para el parche, y `@angular/cli@21` para la migración. Resultado: `"@angular/build": "^21.2.22"`.

**Por qué se rehízo entero en vez de corregir solo la línea.** Fijar a mano la versión habría dejado el resto del trabajo producido por la migración de Angular 22, no por la de Angular 21. Se prefirió no conservar salida de una migración de la mayor equivocada.

**Lección para los specs siguientes.** Toda invocación de `ng update` en este proyecto debe fijar `@21` explícitamente, incluidas las de `--migrate-only`. Sin el pin, el CLI usa un binario temporal de la última mayor y aplica su tabla de versiones.

**Checkpoint**: Configuración migrada y revisada; todavía sin verificar que compile.

---

## Phase 3 — Resolver la caída del cambio de motor

**Goal**: Llevar el proyecto a verde sobre esbuild.

- [x] T007 Ejecutar `npm run build` y registrar el resultado. Depende de: T006. Resultado: se conoce si el cambio de motor rompe algo (SC-001). **Ejecutado: código de salida 0 al primer intento**, 21.165 s. Salida en `dist/appland/browser/`.
- [x] T008 Atender el presupuesto `anyComponentStyle` si hace fallar el build. Depende de: T007. Resultado: **R-001 no se materializó.** El presupuesto de 6 kb aguantó bajo esbuild; el bundle de estilos quedó en 3.82 kB, igual que con webpack. No hubo nada que reportar ni que ajustar.
- [x] T009 Resolver cualquier otra caída del cambio de motor. Depende de: T007. Resultado: **no hubo ninguna.** El build pasó sin intervención.
- [x] T010 Comparar el tamaño del bundle contra el baseline y explicar la diferencia. Depende de: T007. Resultado: NFR-004 y SC-007 cubiertos.

  | Estado | Inicial | Transferencia |
  |---|---|---|
  | Cierre del spec 002 (webpack, 21.2.19) | 444.16 kB | 111.17 kB |
  | Fase 1 de este spec (webpack, 21.2.22) | 447.21 kB | 111.94 kB |
  | Fase 3 de este spec (esbuild, 21.2.22) | **450.02 kB** | **112.74 kB** |

  Incremento total de 5.86 kB en crudo y 1.57 kB de transferencia. Se reparte en dos causas: 3.05 kB atribuibles al parche de versión, medidos de forma aislada en la fase 1 y por tanto ajenos al cambio de builder; y 2.81 kB atribuibles al cambio de motor. Cambio estructural asociado: esbuild dejó de emitir el chunk `runtime` separado que webpack producía con 892 B, y el bundle de estilos quedó idéntico en 3.82 kB. El incremento es del orden del 1.3 % y está explicado, no aceptado a ciegas.

**Checkpoint**: Compila sobre esbuild.

---

## Phase 4 — Verificación y cierre

**Goal**: Confirmar que nada se degradó y dejar el spec cerrado con evidencia.

- [x] T011 Confirmar 95 pruebas pasando sobre `@angular/build:karma`. Depende de: T010. Resultado: NFR-001 y SC-002 verificados. **Ejecutado: código 0, `TOTAL: 95 SUCCESS`.** R-003 no se materializó: las pruebas corrieron sin webpack sin necesitar cambios.
- [x] T012 Ejecutar `npm run lint` y `npm run format:check`. Depende de: T010. Resultado: NFR-002, NFR-003, SC-003, SC-004. **Ejecutado**: lint código 0 con 0 errores y 42 advertencias; formato código 0.
- [x] T013 Ejecutar `npm audit` y registrar el resultado. Depende de: T010. Resultado: SC-008 medido, no prometido (D-005). **Medido: de 5 vulnerabilidades (4 altas, 1 moderada) a 1 alta.** Desaparecieron las que colgaban de `webpack-dev-server`, `less` e `image-size`. La que queda es `nanoid`, que ahora llega por otra ruta: `@angular/build` a `postcss@8.5.25` a `nanoid@3.3.17`. No es removible desde este proyecto y queda registrada como deuda.
- [x] T014 Confirmar que ni `angular.json` ni `package.json` mencionan `@angular-devkit/build-angular`. Depende de: T010. Resultado: SC-006. **Verificado: cero ocurrencias en ambos.**
- [x] T015 Actualizar `README.md` con la ruta real de los artefactos. Depende de: T010. Resultado: FR-007. **Hecho**: se documentó `dist/appland/browser/`, el motivo del cambio, y se añadió una sección de calidad de código con los comandos de lint y formato que el spec 002 introdujo y que el README no mencionaba.
- [x] T016 Actualizar `.specify/feature.json` a `specs/003-build-system`. Depende de: T010. Resultado: estado de spec-kit al día. **Hecho.**
- [x] T017 Registrar las salidas reales de los comandos de verificación. Depende de: T011 a T014. Resultado: cada criterio respaldado por evidencia. **Registrado en cada tarea y en la tabla de cierre.**
- [x] T018 Pedir al usuario la verificación en navegador con `npm start`. Depende de: T017. Resultado: SC-009 y R-005 atendidos por quien puede atenderlos. **El usuario confirmó que la aplicación corre.** Verificación complementaria hecha desde el entorno de ejecución: el servidor de desarrollo arranca, genera el bundle en 14.5 s, entra en modo watch, responde `HTTP 200` y sirve un HTML con `<app-root>` y el título `APPLAND | Soluciones digitales inteligentes`. La confirmación del usuario cubre lo que esa verificación no alcanza: estilos, assets y comportamiento visual bajo esbuild.
- [ ] T019 Presentar el resumen de commits propuestos y esperar indicación explícita para comitear. Depende de: T018. Resultado: el usuario conserva el control de commit y push.

**Checkpoint**: Verificación automatizada completa y verde. El spec no se declara cerrado hasta T018.

---

## Cierre: criterios de éxito contra evidencia

| Criterio | Comando | Resultado |
|---|---|---|
| SC-001 build | `npm run build` | código 0, 21.165 s |
| SC-002 pruebas | `npm test -- --watch=false --browsers=ChromeHeadless` | código 0, **95 pasando** |
| SC-003 lint | `npm run lint` | código 0, 0 errores, 42 advertencias |
| SC-004 formato | `npm run format:check` | código 0 |
| SC-005 dev server | `ng serve` | bundle en 14.5 s, watch activo, `HTTP 200`, HTML con `<app-root>` |
| SC-006 sin builder legacy | inspección | 0 ocurrencias en `angular.json` y `package.json` |
| SC-007 tamaño comparado | `npm run build` | 450.02 kB / 112.74 kB, diferencia desglosada en T010 |
| SC-008 auditoría | `npm audit` | de 5 vulnerabilidades a 1; la restante es `nanoid` vía `postcss` |
| SC-009 navegador | — | **pendiente del usuario** |

### Desviaciones respecto al plan

1. **Un archivo no previsto en el mapa**: `tsconfig.json`, con dos flags coherentes con esbuild.
2. **Un incidente de versiones**, documentado arriba, que obligó a revertir y rehacer con la mayor fijada.
3. **Dos riesgos no se materializaron**: R-001, el presupuesto de estilos, y R-002, el cambio de motor de SCSS, que no tocó ningún archivo.
4. **El README se amplió más allá de FR-007**: se añadió la sección de calidad de código, porque el spec 002 introdujo cuatro comandos que el README nunca documentó.
5. **SC-008 quedó parcial**: 4 de 5 vulnerabilidades desaparecieron, no las 5. La expectativa del `plan.md` era razonable pero no exacta.

---

## Dependency Summary

- La fase 1 debe cerrar verde antes de la fase 2, para aislar el parche de la migración.
- T008 es un punto de parada con el usuario si se materializa R-001.
- T018 es un punto de parada obligatorio: el spec no cierra sin verificación visual.
- T019 es el único punto donde se proponen commits.
