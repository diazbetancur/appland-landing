# Feature Specification: Standalone Migration

**Feature Branch**: `006-standalone`

**Created**: 2026-08-31

**Status**: Ready for Implementation

**Input**: Decisión del usuario al inicio de la serie: "migración total en un solo golpe", los tres modos del schematic más `inject`, eliminando `app.module.ts` y reescribiendo `main.ts` a `bootstrapApplication`.

## Scope

### Business Goal

Migrar la aplicación de la arquitectura NgModule a componentes standalone e inyección por función, cerrando la deuda que el spec 002 registró como 42 advertencias de lint y que hoy son 37.

Es la última de las cinco especificaciones acordadas, y la de mayor alcance: reescribe la declaración de todos los componentes y directivas, elimina los dos NgModules y cambia la forma en que arranca la aplicación.

### Position in the Migration Sequence

Quinta y última. Cada una de las anteriores existía en parte para que esta pudiera hacerse con seguridad:

| Spec | Qué aporta a esta migración |
|---|---|
| 002 | El linter que mide el progreso: `prefer-standalone` debe llegar a cero |
| 003 | El builder esbuild sobre el que corre todo |
| 004 | Vitest, el runner con el que se verifica |
| 005 | **Los guardias que detectan la pérdida de la configuración de scroll** |
| **006** | **Este** |

### Measured Scope

| Medida | Valor |
|---|---|
| Ocurrencias de `standalone: false` | 26, en 24 archivos |
| De esos archivos, especificaciones con componentes stub | 4 |
| Constructores con inyección clásica | 7 |
| Especificaciones con `declarations:` en su TestBed | 19 |
| NgModules | 2 |
| Pruebas al partir | 104, en 26 archivos |
| Advertencias de lint al partir | 37 |

### The scrollOffset Problem

El hallazgo central del spec, obtenido leyendo el código del router antes de migrar.

`AppRoutingModule` configura hoy tres opciones de scroll mediante `RouterModule.forRoot(routes, {...})`. En la API standalone:

| Opción | `RouterModule.forRoot` | `provideRouter` + `withInMemoryScrolling` |
|---|---|---|
| `anchorScrolling` | sí | sí |
| `scrollPositionRestoration` | sí | sí |
| `scrollOffset: [0, 104]` | **sí** | **no tiene ruta** |

`withInMemoryScrolling(options)` construye `new RouterScroller(options)` y nunca llama a `ViewportScroller.setOffset`. El camino NgModule sí lo hace, en `provideRouterScroller`, leyendo `scrollOffset` de `ROUTER_CONFIGURATION`. Además `provideRouter` no provee `ROUTER_CONFIGURATION` en absoluto.

Consecuencia: una migración ingenua **pierde el offset de 104 píxeles del header fijo**, y los anclajes de sección de la Home caerían debajo del header. Los tres guardias del spec 005 detectan esa pérdida, que es exactamente para lo que se construyeron.

**Decisión del usuario**: camino standalone completo. El offset se preserva con un inicializador de aplicación que llama `ViewportScroller.setOffset([0, 104])`, y los tres guardias se reescriben para assertear ese comportamiento en vez de una clave de configuración que ya no existe.

Se descartó una alternativa que proveía `ROUTER_CONFIGURATION` a mano solo para que el guardia pasara: haría que el guardia verificara un valor que nada consume, quedando verde mientras el comportamiento está roto.

### In Scope

- Convertir los 24 archivos a standalone, incluidas las 4 especificaciones con componentes stub.
- Convertir los 7 constructores a `inject()`.
- Eliminar los dos NgModules.
- Reescribir el arranque a `bootstrapApplication`, preservando cada provider actual.
- Preservar las tres opciones de scroll, con el offset reimplementado explícitamente.
- Reescribir los tres guardias de scroll para que verifiquen comportamiento.
- Ajustar las 19 especificaciones de `declarations:` a `imports:`.
- Promover `prefer-standalone` y `prefer-inject` a `error` y bajar `maxWarnings`.

### Out of Scope

- Cambiar comportamiento observable de la aplicación.
- Añadir o quitar pruebas por motivos ajenos a la migración.
- Migrar `RouterTestingModule`, hoy deprecado. Se deja señalado.
- Simplificar `tsconfig.spec.json`, que el spec 004 necesitó por el scope de template de NgModule. Se medirá si deja de ser necesario, y si lo es se registra como hallazgo, pero cambiarlo no es objetivo de este spec.

### Providers That Must Survive

Inventario tomado de `app.module.ts` y `main.ts` antes de migrar. Cada uno debe existir en la configuración final:

- `provideHttpClient(withInterceptorsFromDi())`
- `provideTranslateService({ fallbackLang: 'es', lang: 'es', loader: provideTranslateHttpLoader() })`
- `provideZoneChangeDetection()`, hoy pasado como `applicationProviders` en `main.ts`
- `BrowserModule`, cuyo equivalente standalone es implícito en `bootstrapApplication`
- `A11yModule`, que aportan las directivas de CDK usadas en los templates
- `TranslatePipe`, usado en templates
- El routing con sus tres opciones de scroll

## Requirements

### Functional Requirements

- **FR-001**: Ningún componente, directiva o pipe debe declarar `standalone: false`.
- **FR-002**: Ningún constructor debe usar inyección por parámetro.
- **FR-003**: No debe quedar ningún NgModule en la aplicación.
- **FR-004**: La aplicación debe arrancar con `bootstrapApplication`.
- **FR-005**: Cada provider del inventario anterior debe estar presente en la configuración final.
- **FR-006**: Las tres opciones de scroll deben seguir vigentes en tiempo de ejecución, incluido el offset de 104 píxeles.
- **FR-007**: Los guardias de scroll deben verificar comportamiento efectivo, no la forma de la configuración.
- **FR-008**: Cada guardia reescrito debe demostrarse capaz de fallar.
- **FR-009**: `prefer-standalone` y `prefer-inject` deben quedar en severidad de error.
- **FR-010**: El comportamiento observable de la aplicación no debe cambiar.

### Non-Functional Requirements

- **NFR-001**: El conteo de pruebas no debe bajar de 104.
- **NFR-002**: El lint debe terminar en 0 errores con las dos reglas en `error`.
- **NFR-003**: El formato debe seguir verificándose limpio.
- **NFR-004**: La compilación debe seguir siendo exitosa; se espera que el tamaño baje al desaparecer los NgModules.

## Success Criteria

- **SC-001**: Cero ocurrencias de `standalone: false` en `src`.
- **SC-002**: Cero constructores con inyección por parámetro.
- **SC-003**: Cero `@NgModule` en `src`.
- **SC-004**: `npm run test:ci` termina en 0 con al menos 104 pruebas.
- **SC-005**: `npm run lint` termina en 0 con las dos reglas en `error` y `maxWarnings` bajado.
- **SC-006**: `npm run format:check` termina en 0.
- **SC-007**: `npm run build` termina en 0, con el tamaño comparado contra 450.02 kB.
- **SC-008**: Los guardias de scroll reescritos se demuestran capaces de fallar.
- **SC-009**: El usuario confirma en navegador que la navegación a secciones sigue cayendo en el lugar correcto.

## Risks

- **R-001**: La pérdida del `scrollOffset`. Ya identificada antes de migrar, con solución decidida y guardias que la detectan.
- **R-002**: Los 19 TestBed con `declarations:` deben pasar a `imports:`. El schematic dice hacerlo; no se da por hecho y se verifica.
- **R-003**: `standalone-bootstrap` reescribe `main.ts` y debe rearmar seis providers a mano. Un provider perdido puede romper traducción, HTTP o accesibilidad sin que las pruebas lo noten. Mitigación: inventario explícito arriba, verificado uno por uno contra la configuración final.
- **R-004**: `A11yModule` y `TranslatePipe` son módulos y pipes usados en templates. Al pasar a standalone, cada componente que los use debe importarlos en su propio `imports`. Si el schematic no lo hace bien, la compilación falla; si lo hace de más, añade ruido.
- **R-005**: Los cuatro archivos de especificación con componentes stub `standalone: false` también deben migrarse, y no son código de aplicación. Se verifican aparte.
- **R-006**: El spec 004 necesitó `tsconfig.spec.json` con `src/**/*.ts` porque en NgModule el scope de template lo aporta el módulo. Con standalone eso podría dejar de ser necesario. Se mide y se registra, sin cambiarlo como objetivo.
