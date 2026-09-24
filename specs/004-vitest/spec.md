# Feature Specification: Karma to Vitest Migration

**Feature Branch**: `004-vitest`

**Created**: 2026-08-31

**Status**: Ready for Implementation

**Input**: User description: "Ya no sería necesario Karma, usaríamos Vitest."

## Scope

### Business Goal

Reemplazar Karma y Jasmine por Vitest como runner de pruebas unitarias, sobre el builder `@angular/build:unit-test` que el spec 003 habilitó.

Karma está en modo de mantenimiento y `@angular/build` lo declara junto a Vitest como peers alternativos, con Vitest como el `runner` por defecto de su builder `unit-test`. Migrar alinea el proyecto con el camino que Angular impulsa y elimina siete dependencias de desarrollo.

### Position in the Migration Sequence

Tercera de cinco. Este spec **reemplaza la única red de seguridad del proyecto**, así que se hace aislado: sin tocar código de aplicación, sin cambiar arquitectura, y con el mismo conjunto de pruebas antes y después.

| Spec | Frente | Estado |
|---|---|---|
| 002 | Linting y formato | Cerrado y empujado |
| 003 | Sistema de build | Cerrado y empujado |
| **004** | **Karma a Vitest** | **Este** |
| 005 | Red de seguridad de pruebas | Pendiente; sus pruebas nacerán ya en Vitest |
| 006 | Standalone e `inject()` | Pendiente |

### In Scope

- Target de pruebas al builder `unit-test` con Vitest como runner, en Chrome real headless.
- Conversión de la API de Jasmine a la de Vitest en los 25 archivos de especificación.
- Retiro de las siete dependencias de Karma y Jasmine.
- Actualización de la configuración de TypeScript de pruebas y del README.

### Out of Scope

- Añadir, quitar o reescribir pruebas por motivos que no sean la conversión de API. El conteo debe ser el mismo antes y después.
- Cobertura de código y sus umbrales.
- Cualquier cambio de código de aplicación.
- Migrar arquitectura a standalone. Es el spec 006.

### Inherited Baseline

Al cierre del spec 003, commit `ea6bbe5`:

| Métrica | Valor |
|---|---|
| Pruebas | **95 pasando** sobre `@angular/build:karma`, en ChromeHeadless |
| Archivos de especificación | 25 |
| Lint | 0 errores, 42 advertencias |
| Build | 450.02 kB / 112.74 kB |

### Measured Jasmine API Inventory

Medido con búsqueda de cadenas fijas sobre los 25 archivos. **Corrección registrada**: una medición previa reportó 30 call sites y cero usos de `spyOn`. Era falsa: el patrón usaba un paréntesis sin escapar en una expresión regular extendida, lo que hizo fallar la búsqueda en silencio. El conteo correcto es 35.

| API de Jasmine | Usos | Equivalente en Vitest |
|---|---|---|
| `toBeTrue()` | 11 | `toBe(true)` |
| `jasmine.createSpy` | 7 | `vi.fn()` |
| `spyOn(` | **5** | `vi.spyOn` |
| `toBeFalse()` | 4 | `toBe(false)` |
| `.and.returnValue` | 3 | `.mockReturnValue` |
| `jasmine.createSpyObj` | 2 | objeto con `vi.fn()` |
| `jasmine.objectContaining` | 2 | `expect.objectContaining` |
| `.and.callThrough` | 1 | `.mockImplementation` o sin espía |
| **Total** | **35** | |

Sin usos de `jasmine.any`, `.and.callFake`, `.and.throwError`, `jasmine.clock`, `toBeNaN`, `toHaveBeenCalledOnceWith` ni `waitForAsync`. Los 9 usos de `fakeAsync` son de Angular, no de Jasmine, y sobreviven sin cambio.

### Browser Environment Decision

El builder documenta que, sin la opción `browsers`, las pruebas corren en Node con jsdom. Se eligió **Chrome real headless**, no jsdom, por evidencia concreta:

- `matchMedia` **no existe en jsdom**. Lo llaman tres archivos fuente para detectar `prefers-reduced-motion`, y dos especificaciones lo espían con `spyOn(window, 'matchMedia')`, que fallaría porque la propiedad no existe.
- Bajo jsdom haría falta un `setupFiles` que simule `matchMedia`, con lo que las dos pruebas de movimiento reducido pasarían a verificar el simulacro en vez del comportamiento.
- Las 95 pruebas se escribieron contra Chrome real bajo Karma. Cambiar el entorno alteraría en silencio qué ejercitan.
- `IntersectionObserver` no es un problema: las especificaciones lo sustituyen por una clase stub completa y nunca usan el real.

El usuario aceptó el costo: descarga de un Chromium por parte de Playwright y arranque más lento que jsdom.

## Requirements

### Functional Requirements

- **FR-001**: El target de pruebas debe usar el builder `unit-test` de `@angular/build` con Vitest como runner.
- **FR-002**: Las pruebas deben ejecutarse en Chrome real en modo headless.
- **FR-003**: Ningún archivo de especificación debe conservar API exclusiva de Jasmine.
- **FR-004**: Las siete dependencias de Karma y Jasmine deben quedar fuera del proyecto.
- **FR-005**: La configuración de TypeScript de pruebas debe declarar los tipos de Vitest en vez de los de Jasmine.
- **FR-006**: Debe existir un comando único documentado para ejecutar las pruebas una sola vez, sin modo watch.
- **FR-007**: La documentación del proyecto debe reflejar el runner nuevo.
- **FR-008**: Ningún archivo de código de aplicación debe cambiar.

### Non-Functional Requirements

- **NFR-001**: El conteo de pruebas debe ser exactamente 95, igual que antes. Ni una prueba perdida ni añadida.
- **NFR-002**: El lint debe seguir en 0 errores y no más de 42 advertencias.
- **NFR-003**: El formato debe seguir verificándose limpio.
- **NFR-004**: La compilación de producción no debe cambiar de resultado.

## Success Criteria

- **SC-001**: El comando de pruebas reporta **95 pasando** sobre Vitest y termina en 0.
- **SC-002**: `npm run lint` termina en 0.
- **SC-003**: `npm run format:check` termina en 0.
- **SC-004**: `npm run build` termina en 0.
- **SC-005**: `package.json` no contiene ninguna dependencia de Karma ni de Jasmine.
- **SC-006**: Ningún archivo bajo `src` contiene `jasmine.` ni matchers exclusivos de Jasmine.
- **SC-007**: El diff del spec no toca ningún archivo de código de aplicación; solo especificaciones y configuración.

## Assumptions

- **A-001**: El builder `unit-test` de `@angular/build` 21.2.22 funciona contra el target `application` que el spec 003 dejó configurado.
- **A-002**: La arquitectura NgModule permanece intacta; su migración es el spec 006.

## Risks

- **R-001**: El schematic `refactor-jasmine-vitest` está marcado `[EXPERIMENTAL]` y `hidden` en la colección de `@schematics/angular`. Puede dejar conversiones incompletas o incorrectas. Mitigación: son 35 call sites en 25 archivos, un volumen revisable a mano; se inspecciona su diff y se completa lo que falte.
- **R-002**: El peer de `@vitest/browser-playwright` fija `vitest` en una versión **exacta**, no un rango. Un desajuste de versión rompe la instalación. Mitigación: se instalan ambos en la misma versión y se verifica que npm no reporte conflictos.
- **R-003**: Playwright descarga binarios de navegador. En un entorno sin red o con proxy restrictivo, la instalación falla. Mitigación: se verifica la descarga como paso explícito antes de configurar el target.
- **R-004**: Cambiar de runner puede alterar el conteo de pruebas sin que sea evidente, por ejemplo si un archivo deja de ser descubierto. Mitigación: NFR-001 exige exactamente 95, y se compara archivo por archivo si el número no coincide.
- **R-005**: `fakeAsync` de Angular depende de `zone.js/testing`. El builder inicializa polyfills y el TestBed antes de los archivos de setup, pero la interacción con Vitest no está verificada en este proyecto. Mitigación: los 9 usos de `fakeAsync` se verifican explícitamente en la ejecución.
