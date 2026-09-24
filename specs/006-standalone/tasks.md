# Tasks: Standalone Migration

**Input**: Design documents from `specs/006-standalone/`

**Prerequisites**: `spec.md`, `plan.md`

**Organization**: Cinco fases. Un schematic por paso, con verificación entre cada uno, para que cualquier fallo sea atribuible a una sola transformación.

---

## Phase 1 — Componentes a standalone

- [x] T001 Ejecutar `convert-to-standalone`. Depende de: ninguna. Resultado: FR-001. **Ejecutado**: código 0, `app.module.ts` más 19 especificaciones actualizadas.
- [x] T002 Revisar el diff. Depende de: T001. Resultado: R-004 atendido por lectura. **R-004 no se materializó**: el schematic dio a cada componente sus propios `imports` correctamente. `menu.component.ts` quedó con `imports: [RouterLink, CdkTrapFocus]`, importando la directiva de CDK directamente en vez de depender del módulo.
- [x] T003 Verificar que los TestBed pasaron de `declarations:` a `imports:`. Depende de: T001. Resultado: R-002 verificado. **18 de 19 convertidos automáticamente.** El único pendiente fue `app.component.spec.ts`, porque `AppComponent` sigue siendo el componente raíz declarado hasta que corra `standalone-bootstrap`. Comportamiento esperado, no un fallo del schematic.
- [x] T004 Ejecutar la suite. Depende de: T003. Resultado: efecto aislado. **Falló con 3 casos**, todos en `home.component.spec.ts`, con `NG0201: No provider found for ActivatedRoute` disparado por `RouterLink`.

  **Consecuencia legítima de standalone, no un defecto.** Antes `NO_ERRORS_SCHEMA` ignoraba los `routerLink` como atributos desconocidos porque los hijos eran elementos sin resolver. Ahora `HomeComponent` importa sus doce hijos reales, que se instancian de verdad y exigen sus proveedores. Resuelto añadiendo `provideRouter([])`, `provideLocationMocks()` y `provideTranslateService()` al TestBed. Resultado: 104 pasando.

**Checkpoint**: componentes standalone, 104 pruebas verdes, NgModules todavía en pie.

---

## Phase 2 — Inyección por función

- [x] T005 Ejecutar `inject-migration`. Depende de: T004. Resultado: FR-002. **Ejecutado**: código 0, 7 archivos convertidos.
- [x] T006 Revisar el diff de los 7 constructores. Depende de: T005. Resultado: conversión verificada. Las directivas pasaron a `private readonly x = inject(X)` y quedaron **sin parámetros de constructor**.
- [x] T007 Ejecutar la suite. Depende de: T006. Resultado: efecto aislado. **Falló a compilación con 5 errores `TS2554`**, todos del mismo tipo: tres especificaciones instanciaban las directivas con `new Directiva(elementRef, renderer)`, y esos parámetros ya no existen.

  **Riesgo no previsto por el plan.** El schematic convierte el código de aplicación pero no las pruebas que instancian a mano. Resuelto con `TestBed.runInInjectionContext`, registrando los dobles como proveedores: conserva la intención original de cada prueba, instanciación directa con dobles, satisfaciendo `inject()`. Tres archivos, cinco sitios. Resultado: 104 pasando, cero errores TS.

**Checkpoint**: inyección por función, 104 pruebas verdes.

---

## Phase 3 — Eliminar los NgModules

- [x] T008 Ejecutar `prune-ng-modules`. Depende de: T007. Resultado: avance de FR-003. **Ejecutado**: código 0, con el mensaje `Nothing to be done`.
- [x] T009 Revisar qué eliminó y por qué. Depende de: T008. Resultado: estado real conocido. **No eliminó nada, y es correcto**: `app.module.ts` todavía declaraba `AppComponent` como componente de arranque y `app-routing.module.ts` proveía el router. El pruning solo puede actuar cuando nada necesita el módulo, lo que ocurre después de convertir la raíz.
- [x] T010 Ejecutar la suite. Depende de: T009. Resultado: **omitida deliberadamente.** El schematic no modificó ningún archivo, así que el árbol es idéntico al de T007 y su resultado verde sigue siendo válido. Volver a correr una suite sobre un árbol sin cambios no aporta evidencia.

**Checkpoint**: sin cambios; el pruning depende de la fase 4.

---

## Phase 4 — Arranque standalone y preservación del scroll

- [x] T011 Ejecutar `standalone-bootstrap`. Depende de: T010. Resultado: FR-004. **Ejecutado**: código 0. Eliminó `app.module.ts`, reescribió `main.ts` a `bootstrapApplication`, y convirtió `AppComponent` y su especificación.
- [x] T012 Confirmar el inventario de providers uno por uno. Depende de: T011. Resultado: FR-005, R-003. **R-003 SE MATERIALIZÓ.**

  El schematic dejó `provideZoneChangeDetection` **importado en la primera línea de `main.ts` pero ausente del array de providers**. Un provider perdido en el rearmado, exactamente el riesgo que el inventario explícito del `spec.md` existía para detectar. Sin ese inventario habría pasado inadvertido: ninguna prueba lo habría señalado.

  El schematic tampoco produjo el camino que el usuario eligió: generó `importProvidersFrom(BrowserModule, AppRoutingModule, A11yModule, TranslatePipe)`, que es la opción B descartada, conservando el NgModule de routing.

  Se reescribió la configuración a mano en `src/app/app.config.ts`, con los siete elementos del inventario verificados:
  - `provideZoneChangeDetection()` **recuperado**.
  - `provideRouter(routes, withInMemoryScrolling(...))` sustituyendo al NgModule de routing.
  - `provideHttpClient(withInterceptorsFromDi())` conservado.
  - `provideTranslateService({...})` conservado íntegro.
  - `BrowserModule` retirado: es implícito en `bootstrapApplication`.
  - `A11yModule` retirado tras verificar que sus seis servicios son `providedIn: 'root'` y que no declara providers propios; su directiva `CdkTrapFocus` ya la importa `menu.component.ts` directamente.
  - `TranslatePipe` retirado del arranque: es un pipe standalone que importan cinco componentes por su cuenta, y pasarlo a `importProvidersFrom` no tenía sentido.

- [x] T013 Extraer el offset y añadir el inicializador. Depende de: T012. Resultado: FR-006, D-002. **Hecho**: `SECTION_SCROLL_OFFSET` y `IN_MEMORY_SCROLLING` exportadas desde `app.config.ts`, con un `provideAppInitializer` que llama `ViewportScroller.setOffset`. Las rutas se movieron a `src/app/app.routes.ts` y `app-routing.module.ts` se eliminó.
- [x] T014 Reescribir los guardias. Depende de: T013. Resultado: FR-007, D-003. **Hecho** en `src/app/app.config.spec.ts`, que sustituye a `app-routing.module.spec.ts`.

  **Limitación declarada en el propio archivo**: `ROUTER_SCROLLER`, donde `withInMemoryScrolling` deja el scroller construido, no es export público de `@angular/router`. No hay forma soportada de leer las opciones efectivas desde una prueba. El guardia de `anchorScrolling` y `scrollPositionRestoration` es por tanto **más débil** que el que existía con `RouterModule.forRoot`: detecta un cambio de valores, pero no detectaría que alguien elimine `withInMemoryScrolling` por completo. El del offset, en cambio, es más fuerte: verifica el efecto real.

- [x] T015 **Demostrar que los guardias fallan.** Depende de: T014. Resultado: FR-008, SC-008. Tres demostraciones, cada una restaurada después:

  | Alteración | Fallos | Cuál |
  |---|---|---|
  | Neutralizar el inicializador del offset | 1 | El guardia de comportamiento del offset |
  | Offset a `[0, 0]` y `anchorScrolling` a `'disabled'` | 2 | El del valor del offset y el de las opciones |
  | `path: 'about'` a `'nosotros'` | 1 | El de la tabla de rutas |

  La primera es la importante: reproduce exactamente lo que haría una migración ingenua a `provideRouter`, y el guardia la detiene.

- [x] T016 Ejecutar la suite completa. Depende de: T015. Resultado: NFR-001, SC-004. **104 pasando**, código 0.

**Checkpoint**: la aplicación arranca standalone y el scroll está preservado y protegido por guardias demostrados.

---

## Phase 5 — Cerrar la deuda y verificar

- [x] T017 Promover las dos reglas a `error` y bajar `maxWarnings`. Depende de: T016. Resultado: FR-009, D-004, SC-005. **Hecho**: `maxWarnings` de 37 a **0**. La deuda que el spec 002 abrió queda cerrada.
- [x] T018 Verificar el estado final del código. Depende de: T016. Resultado: SC-001, SC-002, SC-003. **Cero `standalone: false`, cero `@NgModule`, cero constructores con inyección por parámetro.**
- [x] T019 Medir si `tsconfig.spec.json` sigue necesitando `src/**/*.ts`. Depende de: T016. Resultado: R-006 medido, no cambiado.

  **Medido: ya no lo necesita.** Se revirtió temporalmente el `include` a solo `src/**/*.spec.ts` y las 104 pruebas pasaron con **cero errores AOT**. La razón por la que el spec 004 lo amplió, que en NgModule el scope de template lo aporta el módulo, desapareció: ahora cada componente declara sus propios imports.

  **No se cambió**, porque este spec lo declaró fuera de alcance. Queda como simplificación de una línea, ya validada, para quien la quiera tomar.

- [x] T020 Ejecutar las cuatro verificaciones y comparar el bundle. Depende de: T017. Resultado: SC-004 a SC-007. **Ver la tabla de cierre.** El bundle **bajó de 450.02 kB a 431.23 kB**, 18.79 kB menos, y la transferencia de 112.70 a 108.54 kB.
- [x] T021 Actualizar documentación y registrar salidas. Depende de: T020. Resultado: evidencia citable. **Hecho**, incluida una sección de arquitectura en el README que advierte por escrito sobre el inicializador del offset.
- [ ] T022 Pedir al usuario la verificación en navegador. Depende de: T021. Resultado: SC-009.
- [ ] T023 Presentar el resumen de commits y esperar indicación del usuario. Depende de: T022.

---

## Cierre: criterios de éxito contra evidencia

| Criterio | Comando | Resultado |
|---|---|---|
| SC-001 sin `standalone: false` | inspección | **0** |
| SC-002 sin inyección por constructor | inspección | **0** |
| SC-003 sin `@NgModule` | inspección | **0** |
| SC-004 pruebas | `npm run test:ci` | código 0, **104 pasando** |
| SC-005 lint con reglas en error | `npm run lint` | código 0, **cero problemas**, `maxWarnings: 0` |
| SC-006 formato | `npm run format:check` | código 0 |
| SC-007 build | `npm run build` | código 0, **431.23 kB / 108.54 kB** frente a 450.02 / 112.70 |
| SC-008 guardias demostrados | tres demostraciones de T015 | fallan como deben |
| SC-009 navegador | — | **pendiente del usuario** |

### Desviaciones respecto al plan

1. **R-003 se materializó**: el schematic perdió `provideZoneChangeDetection`. Detectado por el inventario explícito del `spec.md`, no por las pruebas.
2. **El schematic produjo la opción B**, no la A que el usuario eligió. La configuración se reescribió a mano.
3. **Un riesgo no previsto**: el schematic de `inject` no actualiza las pruebas que instancian directivas con `new`. Cinco sitios en tres archivos.
4. **Dos specs necesitaron adaptarse a standalone** por razones estructurales, no por defectos: `home.component.spec.ts` porque los hijos reales exigen sus proveedores, y `app.component.spec.ts` porque los dobles ya no ganan a los imports del propio componente y hubo que sustituirlos con `overrideComponent`.
5. **R-004 no se materializó**: el reparto de `imports` por componente salió correcto.
6. **Un guardia quedó más débil que antes**, declarado en T014, porque la API standalone no expone las opciones efectivas del scroller.
7. **R-006 medido y no aplicado**, por estar fuera del alcance declarado.

---

## Dependency Summary

- Un schematic por fase, con suite verde antes de pasar a la siguiente.
- T012 es el punto de mayor riesgo silencioso: un provider perdido no siempre rompe pruebas.
- T015 es obligatorio: un guardia reescrito que no se demuestra es un guardia que no existe.
- T022 y T023 son puntos de parada con el usuario.
