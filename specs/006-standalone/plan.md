# Implementation Plan: Standalone Migration

**Branch**: `006-standalone` | **Date**: 2026-08-31 | **Spec**: [spec.md](./spec.md)

## Summary

Ejecutar los cuatro schematics oficiales en secuencia, verificando entre cada uno, y resolver a mano lo que ninguno cubre: la preservación del `scrollOffset` y el rearmado de providers en el arranque. Cierre: promover las dos reglas de lint a `error`.

## Technical Context

**Punto de partida**: rama `006-standalone` desde `6e1d4db`, cierre del spec 005. 104 pruebas, lint en 0 errores y 37 advertencias, build en 450.02 kB.

**Schematics disponibles**, verificados en `@angular/core` 21.2.22:

- `standalone-migration`, alias `standalone`, con `mode` de tres valores: `convert-to-standalone`, `prune-ng-modules`, `standalone-bootstrap`.
- `inject-migration`, alias `inject`.

**Nota de invocación**: estos son `ng generate`, que usa los schematics locales del paquete instalado. No aplica la trampa del spec 003, donde `ng update` sin fijar `@21` descargaba un CLI temporal de la última mayor.

## Decisions

### D-001: Orden de los cuatro schematics

`convert-to-standalone` primero, porque los otros dos modos asumen componentes ya convertidos. `inject` después, sobre código ya standalone. Luego `prune-ng-modules`, que solo puede eliminar módulos cuando nada los necesita. Por último `standalone-bootstrap`.

Se corre la suite entre cada paso. Cuatro migraciones seguidas sin verificación intermedia harían imposible atribuir un fallo.

### D-002: Preservar el `scrollOffset` con un inicializador de aplicación

Decisión del usuario, con la evidencia del `spec.md`. `withInMemoryScrolling` no acepta `scrollOffset`, y el camino NgModule lo aplicaba llamando `ViewportScroller.setOffset` desde `provideRouterScroller`.

La configuración final replica ese comportamiento explícitamente:

```ts
provideAppInitializer(() => {
  inject(ViewportScroller).setOffset(SECTION_SCROLL_OFFSET);
})
```

Verificado en Angular 21: `provideAppInitializer` existe en `@angular/core`, y `ViewportScroller.setOffset` acepta `[number, number] | (() => [number, number])`.

El valor se extrae a una constante exportada para que la prueba y la configuración lean la misma fuente, en vez de repetir el literal en dos sitios.

### D-003: Los guardias pasan a verificar comportamiento

Los tres guardias del spec 005 leen `ROUTER_CONFIGURATION`, token que `provideRouter` no provee. Tras la migración fallarían, lo que es correcto: detectan que la configuración desapareció.

Se reescriben para verificar lo que de verdad importa:

- `anchorScrolling` y `scrollPositionRestoration` siguen siendo verificables porque `withInMemoryScrolling` los pasa al `RouterScroller`.
- El offset se verifica comprobando que la configuración de la aplicación llama `setOffset` con el valor correcto.

Esto no debilita el guardia: lo mueve del nivel de la forma de la configuración al nivel del efecto. FR-008 exige demostrar que cada uno sigue pudiendo fallar.

### D-004: `maxWarnings` a cero al promover las reglas

Con `prefer-standalone` y `prefer-inject` en `error`, no debe quedar ninguna advertencia de esas reglas. Si el conteo final de advertencias no es cero, hay deuda residual y debe explicarse antes de cerrar.

## Verification

1. `npm run test:ci` en 0, con al menos 104 pruebas.
2. Los guardias reescritos demostrados capaces de fallar.
3. `npm run lint` en 0, con las dos reglas en `error`.
4. `npm run format:check` en 0.
5. `npm run build` en 0, tamaño comparado contra 450.02 kB.
6. Cero `standalone: false`, cero constructores con inyección por parámetro, cero `@NgModule` en `src`.
7. Inventario de providers confirmado uno por uno contra la configuración final.
8. A cargo del usuario: confirmar en navegador que la navegación a secciones cae donde debe.

## Risks and Mitigations

| Riesgo | Mitigación |
|---|---|
| R-001 pérdida del `scrollOffset` | Identificado antes de migrar; solución decidida; guardias que lo detectan |
| R-002 los 19 TestBed con `declarations:` | Se verifica el resultado del schematic, no se asume |
| R-003 providers perdidos en el rearmado | Inventario explícito en el `spec.md`, confirmado uno por uno |
| R-004 `A11yModule` y `TranslatePipe` por componente | La compilación falla si faltan; el exceso se revisa en el diff |
| R-005 los 4 specs con stubs `standalone: false` | Se verifican aparte del código de aplicación |
| R-006 `tsconfig.spec.json` podría simplificarse | Se mide y se registra como hallazgo, sin cambiarlo en este spec |
