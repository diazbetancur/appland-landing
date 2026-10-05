# Tasks: Karma to Vitest Migration

**Input**: Design documents from `specs/004-vitest/`

**Prerequisites**: `spec.md`, `plan.md`

**Tests**: Este spec no cambia código de aplicación, así que no añade pruebas. Su criterio es la paridad: las mismas 95 pruebas sobre el runner nuevo.

**Organization**: Cuatro fases. La instalación se verifica antes de tocar configuración, y la configuración antes de convertir las especificaciones, para que cualquier fallo sea atribuible.

---

## Phase 1 — Dependencias

- [x] T001 Instalar `vitest@4.1.11`, `@vitest/browser-playwright@4.1.11` y `playwright`. Depende de: ninguna. Resultado: peer exacto satisfecho (R-002, D-003). **Ejecutado**: código 0, 36 paquetes añadidos, cero conflictos de peer. Versiones: vitest 4.1.11, provider 4.1.11, playwright 1.62.1.
- [x] T002 Descargar los binarios de navegador de Playwright. Depende de: T001. Resultado: R-003 descartado (**no se materializó**). **Ejecutado**: `npx playwright install chromium` código 0; chromium presente en el almacén de Playwright.

**Checkpoint**: Dependencias instaladas y navegador disponible; configuración aún sin tocar.

---

## Phase 2 — Configuración del runner

- [x] T003 Cambiar el target `test` al builder `@angular/build:unit-test`. Depende de: T002. Resultado: FR-001, FR-002, D-001, D-004. **Ejecutado, con tres correcciones que el plan no había previsto** (ver el registro de hallazgos abajo): el builder no acepta `polyfills`, `assets`, `styles`, `scripts` ni `inlineStyleLanguage`, que ahora vienen del `buildTarget`; el nombre de navegador debe ser `ChromiumHeadless`, no `ChromeHeadless`, porque Playwright soporta `chromium` y no `chrome`; y hubo que crear una configuración `test` dedicada en el target `build` para los polyfills de zona.
- [x] T004 Actualizar `tsconfig.spec.json` a los tipos de Vitest. Depende de: T003. Resultado: FR-005. **Ejecutado**: `types` de `["jasmine"]` a `["vitest/globals"]`, verificando antes que `vitest/globals` existe como export del paquete.
- [x] T005 Ejecutar las pruebas **antes** de convertir, para separar el fallo de configuración del de API. Depende de: T004. Resultado: **la tarea justificó su existencia por completo.** La primera ejecución no falló por API de Jasmine sino con **72 errores de compilación AOT** (`NG8001`, `NG8002`, `NG8003`, `NG8004`) en 14 componentes: elementos y propiedades desconocidas. Sin este paso, esos 72 errores se habrían confundido con daño de la conversión sobre 25 archivos.

**Checkpoint**: El runner arranca y compila limpio. Los fallos restantes son de API.

### Hallazgo: el programa de TypeScript de pruebas no incluía la aplicación

**Síntoma.** 72 errores AOT en 14 componentes, todos del tipo "elemento desconocido" o "no puedo enlazar a esta propiedad". En una aplicación NgModule el scope de template de un componente lo aporta el módulo que lo declara.

**Primera hipótesis, incorrecta.** Se supuso que bastaba meter `AppModule` en el grafo importándolo desde un `setupFiles`. Se implementó y **no cambió nada**: los 72 errores siguieron. Se registró como error de lectura propio que en ese momento se interpretó una bajada de 121 a 72, cuando 121 era el total de líneas `ERROR` de cualquier tipo y los `NG` eran 72 en ambas corridas.

**Causa raíz real.** `tsconfig.spec.json` declaraba `include: ["src/**/*.spec.ts", "src/**/*.d.ts"]`. **`app.module.ts` nunca entraba al programa de TypeScript.** El builder de Karma compilaba de otra forma y lo ocultaba.

**Arreglo.** `include` pasa a `["src/**/*.ts", "src/**/*.d.ts"]`. Los 72 errores AOT bajaron a **0** de inmediato, y el `setupFiles` de la hipótesis fallida se eliminó por innecesario.

---

## Phase 3 — Conversión de las especificaciones

- [x] T006 Ejecutar el schematic `refactor-jasmine-vitest`. Depende de: T005. Resultado: volumen mecánico cubierto (D-005). **Ejecutado**: el CLI rechaza `--browserMode` en camelCase; el nombre correcto en línea de comandos es `--browser-mode`. Resultado: 25 archivos escaneados, **9 transformados**, 16 sin cambios, 0 TODOs. Nota: `browserMode` resultó irrelevante en este proyecto, porque no existe ninguna aserción `toHaveClass`.
- [x] T007 Revisar el diff completo del schematic y su reporte. Depende de: T006. Resultado: R-001 atendido por lectura. **Revisado**. Las conversiones son idiomáticas y correctas: `jasmine.createSpyObj<T>` a objeto literal con `vi.fn().mockName()`, `jasmine.SpyObj<T>` a `MockedObject<T>` con su type import, `spyOn(...).and.returnValue` a `vi.spyOn(...).mockReturnValue`, `jasmine.createSpy` a `vi.fn()`. El schematic además reformateó las aserciones de tipo con su propio printer, lo que exigió pasar Prettier después. Reporte conservado en `schematic-report.md`.
- [x] T008 Completar a mano lo que el schematic dejó incompleto. Depende de: T007. Resultado: FR-003. **R-001 se materializó parcialmente**: dos conversiones quedaron con error de tipo. `jasmine.createSpyObj<T>` devolvía un valor que TypeScript trataba como el `T` completo; el schematic lo convirtió en objetos literales parciales, que no satisfacen ese tipo. Resuelto declarando explícitamente que son dobles parciales y casteando en el punto de uso, que es lo que `createSpyObj` hacía de forma implícita. Dos archivos: `home-section.directive.spec.ts` y `reveal-on-scroll.directive.spec.ts`.
- [x] T009 Verificar que no quedan referencias a API exclusiva de Jasmine. Depende de: T008. Resultado: SC-006. **Verificado**: cero ocurrencias de `jasmine`, cero de `toBeTrue()` y cero de `toBeFalse()` bajo `src`.
- [x] T010 Confirmar **exactamente 95 pasando**. Depende de: T009. Resultado: NFR-001, SC-001, R-004. **Cumplido tras resolver dos fallos de entorno documentados abajo.** Estado final: 25 archivos, **95 pasando**, código de salida 0, 6.58 s. R-004 no se materializó: el descubrimiento de archivos fue correcto desde la primera ejecución del runner.
- [x] T011 Confirmar que los usos de `fakeAsync` funcionan sobre Vitest. Depende de: T010. Resultado: R-005 verificado, no supuesto. **R-005 se materializó y fue el fallo más grave del spec.** Ver el registro abajo. Los 9 usos de `fakeAsync` y los 7 de `tick` funcionan tras cargar el parche de Vitest de zone.js.

**Checkpoint**: 95 pruebas verdes sobre Vitest en chromium real.

### Hallazgo: `fakeAsync` requiere un parche de zone.js específico para Vitest

**Síntoma.** 8 fallos con `Error: Expected to be running in 'ProxyZone', but it was not found`, en exactamente los 3 archivos que usan `fakeAsync`.

**Causa raíz.** `zone.js/testing` instala el ProxyZoneSpec parcheando el framework de pruebas, y su bundle solo detecta **jasmine, mocha y jest**: no parchea Vitest. Sin ProxyZone, `fakeAsync` no tiene zona donde correr.

**Dos intentos que no funcionaron, y por qué.** Primero se cargó `zone.js/testing` desde un `setupFiles`. No sirve: el propio schema del builder declara que *"the Angular TestBed are always initialized **before** these files"*, así que llega tarde. Después se declaró en los polyfills de una configuración `test` dedicada. Tampoco cambió nada, y al leer el código del builder se supo por qué: `injectTestingPolyfills` **ya añade `zone.js/testing` automáticamente** cuando detecta `zone.js`, así que declararlo era redundante desde el principio.

**Arreglo.** zone.js **sí** distribuye un parche para Vitest, en `zone.js/plugins/vitest-patch`, que su bundle de testing no carga solo. Se añadió a los polyfills de la configuración `test`. Los 8 fallos pasaron a 0.

### Hallazgo: Vitest no restaura los espías y Jasmine sí

**Síntoma.** Un fallo en `reveal-on-scroll.directive.spec.ts`: `Renderer2.addClass` con 0 llamadas donde se esperaba una.

**Causa raíz.** Jasmine restauraba automáticamente cada espía creado con `spyOn` al terminar el caso. Vitest no lo hace por defecto. El `vi.spyOn(window, 'matchMedia')` de la prueba de movimiento reducido sobrevivía al caso que lo creó y se filtraba al siguiente, con lo que la directiva salía temprano y nunca llamaba a `addClass`.

**Arreglo.** `src/test-setup.ts` con un `afterEach` global que ejecuta `vi.restoreAllMocks()`, restableciendo la semántica que las 95 pruebas asumían cuando se escribieron. Se eligió el arreglo sistémico en el setup en vez de parchear el único archivo que lo evidenció, porque la diferencia de semántica afecta a cualquier espía futuro.

---

## Phase 4 — Retiro de lo viejo y cierre

- [x] T012 Retirar las siete dependencias de Karma y Jasmine. Depende de: T011. Resultado: FR-004, SC-005. **Ejecutado**: código 0, **103 paquetes eliminados** del árbol. Cero dependencias con `karma` o `jasmine` en el nombre.
- [x] T013 Volver a ejecutar las pruebas después del retiro. Depende de: T012. Resultado: el retiro verificado, no asumido. **Ejecutado**: 95 pasando, código 0. Ninguna prueba dependía de esos paquetes.
- [x] T014 Ejecutar `format`, `lint`, `format:check` y `build`. Depende de: T013. Resultado: NFR-002, NFR-003, NFR-004, SC-002, SC-003, SC-004. **Ejecutado**: `format` código 0 (necesario porque el schematic reformateó con su propio printer); `format:check` código 0; `lint` código 0 con 0 errores y 42 advertencias; `build` código 0 con 450.02 kB y 112.74 kB, **idéntico al cierre del spec 003**. Las pruebas se volvieron a correr después del formateo: 95 pasando.
- [x] T015 Confirmar que el diff no toca código de aplicación. Depende de: T013. Resultado: FR-008, SC-007. **Verificado: cero archivos `.ts` de aplicación, cero `.html`, cero `.scss`.** Los únicos `.ts` modificados son 9 especificaciones más el nuevo `src/test-setup.ts`.
- [x] T016 Actualizar `README.md` y `.specify/feature.json`. Depende de: T014. Resultado: FR-007. **Hecho.** El README documenta el runner nuevo, ambos comandos, y **deja advertidas por escrito las dos piezas frágiles**: los polyfills de zona de la configuración `test` y el `test-setup.ts`, porque quitar cualquiera de las dos rompe pruebas de forma poco evidente.
- [x] T017 Registrar las salidas reales de los comandos de verificación. Depende de: T014, T015. Resultado: cada criterio respaldado por evidencia. **Registrado en cada tarea y en la tabla de cierre.**
- [ ] T018 Presentar el resumen de commits propuestos y esperar indicación explícita del usuario. Depende de: T017. Resultado: el usuario conserva el control de commit y push.

**Checkpoint**: Spec 004 cerrado a falta de autorización de commit; el spec 005 puede escribir sus pruebas ya en Vitest.

---

## Limpieza de artefactos del runner

Vitest en browser mode deja capturas de pantalla de cada prueba fallida bajo `src/**/__screenshots__/`, y adjuntos en `.vitest-attachments/`. Las corridas intermedias de este spec generaron 10 capturas y 88 KB de adjuntos dentro de `src`.

Se eliminaron, y se añadieron ambas rutas a `.gitignore`. Sin eso, cada corrida fallida futura ensuciaría el árbol de fuentes con binarios.

El reporte del schematic quedó conservado como `schematic-report.md` en esta carpeta, en vez de suelto en la raíz del repositorio.

---

## Cierre: criterios de éxito contra evidencia

| Criterio | Comando | Resultado |
|---|---|---|
| SC-001 pruebas sobre Vitest | `npm run test:ci` | código 0, **95 pasando**, 25 archivos, 6.58 s |
| SC-002 lint | `npm run lint` | código 0, 0 errores, 42 advertencias |
| SC-003 formato | `npm run format:check` | código 0 |
| SC-004 build | `npm run build` | código 0, 450.02 kB / 112.74 kB, sin cambio |
| SC-005 sin Karma ni Jasmine | inspección de `package.json` | 0 coincidencias; 103 paquetes eliminados |
| SC-006 sin API de Jasmine | inspección de `src` | 0 ocurrencias de `jasmine`, `toBeTrue()` y `toBeFalse()` |
| SC-007 sin tocar aplicación | `git status` | 9 especificaciones y 1 setup nuevo; 0 archivos de aplicación |

### Desviaciones respecto al plan

1. **El inventario de Jasmine estaba mal medido antes de este spec.** Se había reportado 30 call sites y cero usos de `spyOn`. El patrón usaba un paréntesis sin escapar en una expresión regular extendida, lo que hacía fallar la búsqueda en silencio. Los valores reales son 35 call sites, 5 usos de `spyOn` y 7 de `tick`. Corregido en el `spec.md` antes de implementar.
2. **Tres correcciones de configuración no previstas**: las opciones que `unit-test` no acepta, el nombre `ChromiumHeadless` en vez de `ChromeHeadless`, y la configuración `test` dedicada en el target `build`.
3. **Una hipótesis propia falló y se registró**: importar `AppModule` desde un `setupFiles` no daba scope de template. La causa real era el `include` de `tsconfig.spec.json`.
4. **Dos riesgos se materializaron**: R-001, el schematic experimental dejó dos conversiones con error de tipo; y R-005, `fakeAsync`, que resultó ser el problema más grave y exigió un parche de zone.js que ni el plan ni la documentación del builder mencionaban.
5. **Dos riesgos no se materializaron**: R-003, la descarga de Playwright, y R-004, el conteo de pruebas.
6. **Una diferencia de semántica entre frameworks no prevista por el plan**: Vitest no restaura espías y Jasmine sí.
7. **Trabajo de limpieza añadido**: entradas de `.gitignore` para los artefactos del runner, que el plan no anticipaba porque no sabía que browser mode genera capturas.

---

## Dependency Summary

- T005 es deliberadamente una ejecución que se espera fallar: separa el fallo de configuración del de API.
- T010 es un punto de control duro: si el conteo no es 95, no se avanza.
- T012 va después de tener las pruebas verdes, no antes, para no mezclar el retiro con la conversión.
- T018 es el único punto donde se proponen commits.
