# Tasks: Linting and Formatting Baseline

**Input**: Design documents from `specs/002-linting-and-formatting/`

**Prerequisites**: `spec.md`, `plan.md`, `checklists/requirements.md`

**Tests**: El único archivo con cambio funcional en este spec es `src/app/components/service/service.component.ts` (eliminación del `any`). Su especificación existente se ajusta o completa para cubrir ese cambio, según la regla acordada con el usuario. Los cambios de formato no requieren pruebas nuevas.

**Organization**: Cinco fases secuenciales. La fase 2 termina en un punto de parada obligatorio: el inventario real de violaciones se reporta al usuario antes de resolver nada.

## Format

- Cada tarea declara su dependencia real, los archivos concretos y el resultado esperado.
- [P] indica que la tarea puede correr en paralelo con otras listas porque usa archivos distintos.
- Ninguna afirmación de completitud se emite sin la salida del comando que la respalda.

---

## Phase 1 — Preparación y baseline

**Goal**: Cerrar el baseline con evidencia y resolver la condición preexistente del árbol de trabajo antes de instalar nada.

- [x] T001 Confirmar con el usuario la rama de trabajo para este spec y crearla si corresponde. Depende de: ninguna. Resultado: la rama queda decidida por el usuario, no asumida. **Resuelto 2026-08-31**: el usuario eligió rama nueva `002-linting-and-formatting`, creada desde el HEAD de `001-appland-home-redesign`; los cambios del árbol de trabajo viajaron sin pérdida y `001-appland-home-redesign` quedó intacta.
- [x] T002 Resolver la condición de `src/assets/images/clients/GrupoTerra.png`, modificado en el árbol de trabajo y ajeno a este trabajo, según indique el usuario. Depende de: ninguna. Resultado: el commit de este spec no arrastra un cambio de activo no relacionado. **Resuelto 2026-08-31**: el usuario confirmó que el reemplazo es intencional. Queda pendiente como commit de activo separado, sin comitear hasta indicación explícita, y fuera del alcance de los commits de este spec.
- [x] T003 Registrar el baseline de compilación ejecutando `npm run build` y capturando resultado y tamaños de bundle. Depende de: ninguna. Resultado: existe evidencia de compilación previa contra la cual comparar, complementando el baseline de pruebas ya capturado (87 pasando). **Ejecutado 2026-08-31**: código de salida 0; total inicial 444.15 kB, transferencia estimada 111.13 kB, 23.3 s (`main` 403.84 kB, `polyfills` 35.59 kB, `styles` 3.82 kB, `runtime` 892 B).

**Checkpoint**: Baseline de pruebas y de compilación registrados; árbol de trabajo sin cambios ajenos; ningún paquete instalado todavía.

---

## Phase 2 — ESLint: instalación e inventario

**Goal**: Dejar el linter funcionando y medir la realidad, sin resolver nada aún.

- [x] T004 Instalar como devDependencies ESLint, `@eslint/js`, `typescript-eslint@8.68.0` y `angular-eslint@21.4.0`, y verificar que npm no reporta conflictos de peer dependencies. Depende de: T003. Resultado: dependencias presentes y compatibles con Angular 21.2 y TypeScript 5.9.3 (FR-011). **Ejecutado 2026-08-31**: el primer intento con `eslint@9.39.5` recibió `npm warn deprecated eslint@9.39.5: This version is no longer supported`, lo que invalidó la decisión D-002 original. Se corrigió a `eslint@10.9.1` y `@eslint/js@10.0.1`; segunda instalación con código de salida 0, cero avisos de deprecación y cero conflictos de peer. Versiones finales: eslint 10.9.1, @eslint/js 10.0.1, typescript-eslint 8.68.0, angular-eslint 21.4.0.
- [x] T005 Crear `eslint.config.js` en CommonJS con el contenido definido en `plan.md`. Depende de: T004. Resultado: configuración que cubre TypeScript, templates separados y templates inline (FR-002, FR-003, FR-004, FR-005, D-011). **Verificado empíricamente**: la configuración carga y analiza sin errores de configuración.
- [x] T006 Añadir el target `lint` a `angular.json` con `@angular-eslint/builder:lint` y `lintFilePatterns`, y los scripts `lint` y `lint:fix` a `package.json`. Depende de: T005. Resultado: existe un comando único de análisis con código de salida significativo (FR-001, D-010). **Verificado**: `npm run lint` devolvió 1 con errores presentes.
- [x] T007 Ejecutar `npm run lint`, capturar el inventario completo y contrastarlo contra la predicción del baseline medido. Depende de: T006. Resultado: inventario real documentado, incluyendo toda diferencia frente a la predicción (SC-006). **Ejecutado 2026-08-31**: 46 problemas (4 errores, 42 advertencias) frente a los 36 predichos. Desglose real: `prefer-standalone` 29, `prefer-inject` 13, `no-explicit-any` 2, `no-useless-assignment` 1, `no-unused-expressions` 1. Las cuatro diferencias frente a la predicción se documentaron como fallas del método de medición: conteo de archivos en vez de ocurrencias, constructores multilínea con varios parámetros marcados por separado, regex que no cubría `Observable<any>`, y una regla core de ESLint 10 no considerada. Reportado al usuario y alcance confirmado.

**Checkpoint obligatorio**: El inventario se reporta al usuario y se confirma el alcance de resolución antes de modificar código de aplicación. No se avanza a la fase 3 sin esa confirmación.

---

## Phase 3 — Resolución de violaciones

**Goal**: Llevar los errores a cero resolviendo, no silenciando.

- [x] T008 Inspeccionar el uso real de `services` en `src/app/components/service/service.component.ts` y en su template, y reemplazar el tipo `any[]` por el tipo correcto. Depende de: T007. Resultado: `no-explicit-any` resuelto en ese archivo sin supresiones (FR-009). **Resuelto 2026-08-31**: causa raíz identificada. El tipo correcto ya existía pero sin exportar: `interface ServiceDescription { key, image, title, description }` en `card-template.ts`, consumidor declarado del input. Verificado que los datos calzan: `ourServiceDescription` en `src/assets/i18n/es.json` son 9 objetos con esas mismas 4 claves. Solución: añadir `export` a la interface e importarla, en vez de duplicar el tipo o dejar `any`.
- [x] T009 Ajustar o completar `src/app/components/service/service.component.spec.ts` para cubrir el tipado introducido en T008. Depende de: T008. Resultado: el archivo con cambio funcional queda cubierto por pruebas, según la regla acordada. **Ejecutado 2026-08-31**: dos pruebas nuevas. Una fija el camino de traducción no-array (`services` queda en `[]`); otra verifica que las descripciones traducidas llegan con las cuatro claves que consume el template, con una anotación `ServiceDescription` que rompe la compilación si el tipo cambia de forma. El primer intento falló a compilación real (`TS2322`: `setTranslation` de ngx-translate v18 exige un tipo con índice de string, que una `interface` no recibe implícitamente); se corrigió moviendo la anotación al valor esperado. Suite: **89 pasando**, código de salida 0, frente a las 87 del baseline.
- [x] T008b Resolver `no-useless-assignment` en `src/app/components/home-services/home-services.component.ts:31`. Depende de: T007. Resultado: verdadero positivo inofensivo eliminado. Las cinco ramas del `if` en `onTabKeydown` asignan `nextIndex` o retornan, así que el inicializador `= index` nunca se leía. Cambiado a `let nextIndex: number;`, sin cambio de comportamiento.
- [x] T008c Resolver `@typescript-eslint/no-unused-expressions` en `src/app/components/menu/menu.component.ts:64`. Depende de: T007. Resultado: el ternario usado como sentencia (`this.isMenuOpen ? this.closeMenu() : this.openMenu();`) se convirtió en `if/else`. Se prefirió cambiar el código antes que aflojar la regla con `allowTernary`, según FR-009. Sin cambio de comportamiento.
- [ ] T010 Resolver el resto de violaciones de error que haya revelado el inventario de T007, sin usar comentarios de supresión. Depende de: T007. Resultado: cero errores de lint por causas ajenas a las migraciones (FR-009).
- [ ] T011 Configurar `prefer-standalone` y `prefer-inject` en `warn` con comentario que declare su destino a `error` en el spec 006, y fijar `maxWarnings` en `angular.json` al número exacto de advertencias del inventario. Depende de: T010. Resultado: la deuda de modernización queda registrada con techo que no puede crecer en silencio (FR-010, D-005, D-010).
- [ ] T012 Ejecutar `npm run lint` y `npm test -- --watch=false --browsers=ChromeHeadless`, capturando ambas salidas. Depende de: T011. Resultado: lint en cero errores y 87 pruebas pasando sin haber modificado aserciones existentes (SC-001, SC-004, NFR-001).

**Checkpoint**: Lint verde en errores, pruebas intactas, deuda de modernización acotada y trazable.

---

## Phase 4 — Prettier

**Goal**: Unificar el formato del código de aplicación en un solo movimiento.

- [x] T013 Instalar `prettier@3.9.6` como devDependency. Depende de: T012. Resultado: formateador disponible. **Ejecutado**: código de salida 0, versión 3.9.6.
- [x] T014 [P] Crear `.prettierrc.json` y `.prettierignore`. Depende de: T013. Resultado: formato alineado a `.editorconfig` y a la evidencia del código, con alcance acotado (FR-007, D-006, D-007, D-008, D-009). **Hallazgo durante la tarea**: Prettier solo infiere el parser `angular` para archivos `*.component.html`. `card-template.html` no sigue esa convención y caía en el parser `html` genérico, pese a contener `@for`, `[src]` y `| translate`. Verificado con `prettier --file-info` antes de formatear. Se añadió un override por ruta (`src/app/**/*.html`), más robusto que depender del nombre, dejando `src/index.html` fuera a propósito porque no es un template de Angular. Override confirmado con `--file-info`.
- [x] T015 [P] Añadir los scripts `format` y `format:check` a `package.json`. Depende de: T013. Resultado: existe un comando que escribe y otro que solo verifica (FR-006).
- [x] T016 Ejecutar `npm run format:check` antes de escribir nada y registrar cuántos archivos no cumplen. Depende de: T014, T015. Resultado: alcance del formateo medido antes de aplicarlo. **Medido**: 74 de 93 archivos no cumplían.
- [x] T017 Ejecutar `npm run format` sobre `src/**/*.{ts,html,scss}`. Depende de: T016. Resultado: código de aplicación formateado (FR-008). **Ejecutado**: código de salida 0, 72 archivos modificados, +1142 / -669 líneas. Se tomó respaldo completo de `src` antes de escribir, usado después para la verificación de T019.
- [x] T018 Ejecutar las cuatro verificaciones capturando sus salidas. Depende de: T017. Resultado: formateo verificado y confirmación de que no alteró comportamiento ni compilación (SC-002, SC-004, SC-005, FR-012, NFR-002). **Ejecutado 2026-08-31**: `format:check` código 0 con "All matched files use Prettier code style!"; `lint` código 0 con 0 errores y 42 advertencias; `test` código 0 con 95 pasando; `build` código 0 con total inicial 444.16 kB y transferencia 111.17 kB, frente a 444.15 / 111.13 del baseline.

**Checkpoint**: Repositorio formateado, pruebas y compilación verdes.

---

## Phase 5 — Cierre

**Goal**: Dejar el spec cerrado con evidencia y el repositorio listo para el spec 003.

- [x] T019 Verificar que el formateo no alteró espacios significativos en los templates. Depende de: T018. Resultado: R-002 verificado. **Método sustituido y ampliado**: la tarea original preveía inspección visual en navegador. No hay navegador disponible en el entorno de ejecución, así que se hizo comparación programática de los 19 templates contra el respaldo previo al formateo, que además cubre más que una muestra a ojo. Resultados:
  - **0 diferencias de espaciado adyacente a elementos inline**, que es la superficie real de riesgo.
  - Toda diferencia restante se clasificó en seis clases inertes: reflujo de líneas, posición del `>` de cierre, estilo de comillas dentro de expresiones (`@case ("x")` a `@case ('x')`), auto-cierre de elementos vacíos (`<br>` a `<br />`), espacio inicial/final dentro de elementos de bloque (`<h1>`, `<p>`), y espacio dentro de expresiones de binding de Angular.
  - Se validó el supuesto de CSS en el que se apoya la clase 5: no existe ninguna regla `white-space: pre*` en el proyecto (solo dos `nowrap`, que colapsa espacios igual), y ni `h1` ni `p` tienen su `display` sobrescrito.
  - Se cerró el hueco de la clase 1: se enumeraron todos los selectores del proyecto con `display: inline-flex` o `inline-block` (`.footer__logo`, `.footer__social a`, `.contact__details a`, `.menu__brand`, `.menu__brand-mark`, `.menu__link`, `.compact-menu__close`, `.menu__meeting--desktop`, `.menu__toggle`, `.menu__meeting--compact`, `.btn-primary`) y se confirmó que todos son `<a>`, `<img>`, `<span>` o `<button>`, es decir dentro del conjunto ya verificado con 0 diferencias.
  - **Limitación declarada**: esto es análisis estático, no comparación de píxeles. Una pasada visual en navegador sigue siendo la confirmación final y queda a cargo del usuario.
- [x] T020 Actualizar `.specify/feature.json` para apuntar a `specs/002-linting-and-formatting`. Depende de: T018. Resultado: el estado de spec-kit refleja la feature en curso. **Ejecutado**.
- [x] T021 Registrar las salidas reales de los comandos de verificación. Depende de: T019, T020. Resultado: cada criterio de éxito respaldado por evidencia citable. **Registrado en T018 y en la tabla de cierre de este documento.**
- [x] T022 Marcar la checklist contra el estado real, dejando sin marcar todo lo que no se cumplió. Depende de: T021. Resultado: cierre honesto del spec.
- [ ] T023 Presentar al usuario el resumen de commits propuestos y esperar su indicación explícita para comitear y hacer push. Depende de: T022. Resultado: el usuario conserva el control de commit y push, según lo acordado.

---

## Cierre: criterios de éxito contra evidencia

| Criterio | Comando | Resultado |
|---|---|---|
| SC-001 lint sin errores | `npm run lint` | código 0, **0 errores**, 42 advertencias |
| SC-002 formato verificado | `npm run format:check` | código 0, "All matched files use Prettier code style!" |
| SC-003 advertencias solo de modernización | `npm run lint` | 29 `prefer-standalone` + 13 `prefer-inject` = 42, ninguna otra regla |
| SC-004 pruebas verdes | `npm test -- --watch=false --browsers=ChromeHeadless` | código 0, **95 pasando** (87 del baseline + 8 nuevas) |
| SC-005 compilación exitosa | `npm run build` | código 0, 444.16 kB / 111.17 kB |
| SC-006 inventario registrado | — | 46 problemas reales frente a 36 predichos, con las cuatro discrepancias explicadas en T007 |

### Desviaciones respecto al plan original

1. **D-002 corregida durante la ejecución**: ESLint 9 se descartó porque npm lo reporta sin soporte. Se usó ESLint 10.9.1.
2. **SC-003 cumplido con un número distinto al previsto**: el plan anticipaba 35 advertencias (27 más 8); el real es 42 (29 más 13). `maxWarnings` se fijó en 42, el valor medido.
3. **NFR-001 superado en vez de solo cumplido**: el plan pedía conservar las 87 pruebas; hay 95, porque los archivos tocados recibieron pruebas nuevas según la regla acordada con el usuario.
4. **T019 cambió de método**: de inspección visual a comparación programática, por ausencia de navegador en el entorno. La limitación queda declarada.
5. **Tareas añadidas no previstas**: T008b y T008c, por los dos errores de lint que la predicción del baseline no había detectado.

**Checkpoint**: Spec 002 cerrado con evidencia; el spec 003 puede escribirse.

---

## Dependency Summary

- Fase 1 no depende de nada y debe cerrar antes de instalar paquetes.
- T007 es un punto de parada obligatorio con el usuario.
- La fase 3 no puede empezar sin el inventario de T007 confirmado.
- La fase 4 no puede empezar sin lint verde en errores y pruebas intactas (T012).
- T023 es el único punto donde se proponen commits.
