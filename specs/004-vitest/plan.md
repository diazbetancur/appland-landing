# Implementation Plan: Karma to Vitest Migration

**Branch**: `004-vitest` | **Date**: 2026-08-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-vitest/spec.md`

## Summary

Cambiar el runner de pruebas de Karma/Jasmine a Vitest sobre Chrome real headless, convirtiendo los 35 call sites de API de Jasmine en los 25 archivos de especificación, y retirando las siete dependencias que quedan sin uso. El conjunto de pruebas debe seguir siendo exactamente el mismo: 95, ni una más ni una menos.

Este spec reemplaza la única red de seguridad automatizada del proyecto, así que se ejecuta aislado y su criterio de éxito principal es la paridad, no la mejora.

## Technical Context

**Punto de partida**: rama `004-vitest` desde `ea6bbe5`, cierre del spec 003. Árbol limpio.

**Builder disponible**: `@angular/build:unit-test` en 21.2.22, con `runner` de tipo enumerado `karma` o `vitest` y **`vitest` como valor por defecto**. Requiere que el `buildTarget` sea `@angular/build:application`, condición que el spec 003 ya dejó cumplida.

**Peer de Vitest declarado por `@angular/build` 21.2.22**: `vitest: ^4.0.8`.

**Opciones relevantes del builder**, leídas de su `schema.json`: `runner`, `browsers`, `browserViewport`, `setupFiles`, `providersFile`, `runnerConfig`, `include`, `exclude`, `filter`, `watch`, `headless`, `coverage` y sus derivados, `reporters`.

## Decisions

### D-001: Chrome real headless, no jsdom

Justificado con evidencia en el `spec.md`. El factor decisivo es que `matchMedia` no existe en jsdom y dos especificaciones lo espían; bajo jsdom esas pruebas verificarían un simulacro.

Se activa declarando `browsers: ["ChromeHeadless"]` en las opciones del target. El schema documenta que un nombre terminado en `Headless` activa el modo headless.

### D-002: Proveedor Playwright

El builder reconoce `playwright`, `webdriverio` y `preview`. Se descarta `preview` porque abre un navegador visible, inadecuado para ejecución no interactiva. Entre los otros dos se elige Playwright por ser el proveedor de referencia de Vitest.

El paquete que el builder resuelve sigue el patrón `@vitest/browser-<proveedor>`, verificado en su código: `@vitest/browser-playwright`.

### D-003: Versiones exactas por el peer estricto

`@vitest/browser-playwright@4.1.11` declara peers `vitest: 4.1.11` **exacto** y `playwright: *`. Se instalan `vitest@4.1.11`, `@vitest/browser-playwright@4.1.11` y `playwright`, y se verifica que npm no reporte conflictos. Esto satisface el peer `^4.0.8` de `@angular/build`.

### D-004: `browsers` en `angular.json`, no en la línea de comandos

Hoy la invocación documentada es `npm test -- --watch=false --browsers=ChromeHeadless`. Declarar `browsers` en el target deja la invocación en `npm test -- --watch=false`, que es menos frágil y no depende de que quien la ejecute recuerde el flag.

### D-005: Usar el schematic oficial y revisar su salida

`refactor-jasmine-vitest` de `@schematics/angular` existe pero está marcado `[EXPERIMENTAL]` y `hidden`. Se usa como primer paso porque cubre el volumen mecánico, y su diff se revisa completo. Lo que deje incompleto se termina a mano. No se acepta su salida sin leerla.

Opciones del schematic, leídas de su `schema.json`: `include`, `fileSuffix`, `project`, `verbose`, `addImports`, `browserMode` y `report`. Dos importan aquí:

- **`browserMode: true`**, porque corremos en navegador real y el schematic documenta que en ese caso conserva las aserciones `toHaveClass` en vez de convertirlas a un equivalente.
- **`addImports: false`**, su valor por defecto, porque el builder de Angular activa la opción de globales de Vitest y los imports explícitos de `describe`, `it`, `expect` y `vi` no son necesarios.

### D-006: Paridad como criterio, no mejora

Cualquier tentación de arreglar o ampliar pruebas durante este spec queda fuera de alcance. El spec 005 es el que se ocupa de la red de pruebas. Aquí el éxito es que las mismas 95 pasen sobre el runner nuevo.

## Verification

1. `npm test -- --watch=false` reporta **95 pasando** y termina en 0.
2. `npm run lint` termina en 0 con no más de 42 advertencias.
3. `npm run format:check` termina en 0.
4. `npm run build` termina en 0.
5. `package.json` sin dependencias de Karma ni Jasmine.
6. Búsqueda de `jasmine.` y de los matchers exclusivos sobre `src` sin resultados.
7. El diff no toca código de aplicación.

## File Map

| Archivo | Acción esperada |
|---|---|
| `package.json` | modificar: tres dependencias nuevas, siete retiradas, script de pruebas |
| `package-lock.json` | modificar |
| `angular.json` | modificar: target `test` al builder `unit-test` |
| `tsconfig.spec.json` | modificar: tipos de Vitest |
| `src/**/*.spec.ts` | modificar: conversión de API en 25 archivos |
| `README.md` | modificar: sección de pruebas unitarias |
| `.specify/feature.json` | modificar |
| `specs/004-vitest/` | crear |

Ningún `.ts` de aplicación, ningún `.html`, ningún `.scss`. Si algo de eso aparece en el diff, se revisa antes de aceptar.

## Risks and Mitigations

| Riesgo | Mitigación |
|---|---|
| R-001 schematic experimental | Se revisa su diff completo; 35 call sites es un volumen terminable a mano |
| R-002 peer exacto de vitest | Instalación de ambos en la misma versión, verificando ausencia de conflictos |
| R-003 descarga de binarios de Playwright | Paso explícito y verificado antes de configurar el target |
| R-004 conteo de pruebas alterado en silencio | NFR-001 exige exactamente 95; si no coincide, comparación archivo por archivo |
| R-005 `fakeAsync` sobre Vitest | Los 9 usos se verifican explícitamente en la ejecución |
