# Implementation Plan: Build System Migration

**Branch**: `003-build-system` | **Date**: 2026-08-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-build-system/spec.md`

## Summary

Subir Angular al último parche de la línea 21.2 y migrar los cuatro targets del workspace de `@angular-devkit/build-angular` a `@angular/build`, cambiando el motor de compilación de webpack a esbuild. Sin tocar el runner de pruebas, la arquitectura ni el código de aplicación.

El trabajo lo hace en su mayor parte la migración oficial `use-application-builder`. El valor de este spec está en verificar qué hace exactamente antes de correrla, y en resolver la caída que provoque el cambio de motor.

## Technical Context

**Punto de partida**: rama `003-build-system` creada desde `f931554`, cierre del spec 002. Árbol limpio.

**Versiones instaladas**: `@angular/core` 21.2.19, `@angular/cli` 21.2.20, `@angular/build` 21.2.20 (hoy transitiva), `@angular-devkit/build-angular` 21.2.20. Último parche de la línea 21.2: **21.2.22**.

**Runtime**: Node 24.16.0, npm 11.13.0.

**Configuración actual de `angular.json`**: cuatro targets, todos en `@angular-devkit/build-angular`. `build` usa el builder `browser`, con `outputPath: "dist/appland"`, `main: "src/main.ts"`, y en su configuración `development` las opciones `buildOptimizer: false`, `vendorChunk: true`, `namedChunks: true`, `optimization: false`, `extractLicenses: false`, `sourceMap: true`.

## Verified Migration Behavior

Leído directamente en `node_modules/@schematics/angular/migrations/use-application-builder/migration.js` antes de ejecutar nada. Esto es lo que hace, no lo que se supone que hace:

### Conversión de builders

| Target | Antes | Después |
|---|---|---|
| `build` | `@angular-devkit/build-angular:browser` | `@angular/build:application` |
| `serve` | `@angular-devkit/build-angular:dev-server` | `@angular/build:dev-server` |
| `extract-i18n` | `@angular-devkit/build-angular:extract-i18n` | `@angular/build:extract-i18n` |
| `test` | `@angular-devkit/build-angular:karma` | `@angular/build:karma` |

Los cuatro se convierten. Esto descarta el riesgo de que `npm start` quede apuntando a un paquete eliminado.

### Cambios de opciones

- `main` se renombra a `browser`.
- `outputPath` pasa de string a objeto `{ base: ... }`, y el navegador se emite en un subdirectorio `browser`. La migración emite una advertencia explícita al respecto y documenta que `outputPath.browser: ""` conserva el comportamiento anterior.
- Se eliminan `buildOptimizer` y `vendorChunk`, no soportadas por el builder nuevo.
- Se elimina `builderMode` del target de test, si existiera. En este proyecto no existe.

### Dependencias

- Agrega `@angular/build` como dependencia directa.
- **Elimina `@angular-devkit/build-angular`.**
- Agrega `less` o `postcss` solo si el proyecto los necesita. Este proyecto usa SCSS.

### Configuración de Karma

La migración limpia referencias a `@angular-devkit/build-angular/plugins/karma` en configuraciones personalizadas de Karma. Este proyecto **no tiene `karma.conf.js`**, así que ese paso no aplica.

## Decisions

### D-001: Orden — primero el parche, después la migración

`use-application-builder` es una migración opcional que se invoca por nombre. El parche de versión se hace primero con `ng update @angular/core@21 @angular/cli@21`, para que la migración corra sobre los paquetes ya actualizados y no al revés.

### D-002: Aceptar la ruta de salida por defecto

La migración mueve la salida de `dist/appland` a `dist/appland/browser`. Se acepta ese default en vez de forzar `outputPath.browser: ""`.

Evidencia que lo hace seguro: no existe `.github/`, ni Dockerfile, ni `netlify.toml`, ni `vercel.json`, ni `web.config`, ni `.htaccess`, ni `firebase.json`, ni script de despliegue en la raíz del repositorio. La única mención a la ruta fuera de `angular.json` es una frase genérica del README que dice que los artefactos quedan en `dist/`.

Consecuencia: el README se actualiza (FR-007).

### D-003: No tocar los presupuestos por adelantado

El presupuesto `anyComponentStyle` está en 6 kb como `maximumError`. Podría hacer fallar el build bajo esbuild (R-001). **No se ajusta preventivamente.** Si falla, se reporta al usuario con el tamaño real medido y se decide entre reducir el estilo o subir el umbral. Ajustar un umbral para que el build pase, sin avisar, sería esconder el problema.

### D-004: Verificar `@angular/build:karma` contra las opciones vigentes antes de correr

Ya hecho, leyendo su `schema.json`. El builder acepta `main`, `tsConfig`, `karmaConfig`, `polyfills`, `assets`, `scripts`, `styles`, `inlineStyleLanguage`, `stylePreprocessorOptions`, `externalDependencies`, `loader`, `define`, `include`, `exclude`, `sourceMap`, `progress`, `watch`, `poll`, `preserveSymlinks`, `browsers`, `codeCoverage`, `codeCoverageExclude`, `fileReplacements`, `reporters`, `webWorkerTsConfig` y `aot`.

Las seis opciones que hoy tiene el target de test (`polyfills`, `tsConfig`, `inlineStyleLanguage`, `assets`, `styles`, `scripts`) están todas cubiertas. Ninguna se pierde.

### D-005: Registrar el resultado de `npm audit`, no prometerlo

La migración elimina `@angular-devkit/build-angular`, y las cinco vulnerabilidades provienen de su árbol (`webpack-dev-server`, `less`, `image-size`, `nanoid`). Es razonable esperar que desaparezcan, pero no se afirma hasta medirlo (SC-008).

## Verification

Comandos, en este orden, registrando la salida real de cada uno:

1. `npm run build` termina en 0, con el tamaño comparado contra 444.16 kB / 111.17 kB.
2. `npm test -- --watch=false --browsers=ChromeHeadless` reporta 95 pasando.
3. `npm run lint` termina en 0, con no más de 42 advertencias.
4. `npm run format:check` termina en 0.
5. `npm audit` registrado.
6. `angular.json` y `package.json` sin referencias a `@angular-devkit/build-angular`.

Y a cargo del usuario, porque no hay navegador en el entorno de ejecución:

7. `npm start`, y confirmar que la aplicación se comporta igual. Es el spec con más riesgo de romper algo que ninguna prueba cubre: estilos, assets y arranque.

## File Map

| Archivo | Acción esperada |
|---|---|
| `package.json` | modificar: versiones de Angular, quitar devkit, agregar `@angular/build` |
| `package-lock.json` | modificar |
| `angular.json` | modificar: cuatro builders y opciones del target `build` |
| `README.md` | modificar: ruta de artefactos |
| `src/**/*.scss` | posible modificación por la migración; a revisar en el diff |
| `.specify/feature.json` | modificar |
| `specs/003-build-system/` | crear |

Archivos que este spec no debería tocar: ningún `.ts`, ningún `.html`, ningún `.spec.ts`. Si la migración los toca, se revisa antes de aceptar.

## Risks and Mitigations

| Riesgo | Mitigación |
|---|---|
| R-001 presupuesto `anyComponentStyle` hace fallar el build | No se ajusta preventivamente; si falla, se reporta con el tamaño real y decide el usuario (D-003) |
| R-002 cambio de motor de SCSS | Revisión del diff sobre archivos SCSS antes de aceptar; verificación visual del usuario |
| R-003 las 95 pruebas sobre el builder nuevo | Paso aislado: cualquier fallo es atribuible solo a este cambio |
| R-004 cambio de tamaño de bundle | Se compara contra el baseline y se explica; no se acepta sin entender la causa |
| R-005 la verificación visual depende del usuario | SC-009 queda explícitamente a su cargo; el spec no se cierra sin él |
