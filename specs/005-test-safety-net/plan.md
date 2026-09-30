# Implementation Plan: Test Safety Net

**Branch**: `005-test-safety-net` | **Date**: 2026-08-31 | **Spec**: [spec.md](./spec.md)

## Summary

Convertir la suite de pruebas en una red que realmente detenga regresiones antes de que el spec 006 reescriba la declaración de todos los componentes y el arranque de la aplicación. Tres frentes: reparar la única prueba de routing, que hoy es un falso positivo; fijar por prueba las tres opciones de scroll que el 006 va a reescribir; y eliminar el código muerto que se presentaba como hueco de cobertura, atacando además la causa raíz que lo generaría de nuevo.

## Decisions

### D-001: Asserear la configuración de scroll vía `ROUTER_CONFIGURATION`

Las opciones de `RouterModule.forRoot(routes, {...})` no aparecen en `router.config`, que solo expone la tabla de rutas. Se verificó que `ROUTER_CONFIGURATION` es export público de `@angular/router`, listado en su barrel de tipos, y es el token que contiene el objeto `ExtraOptions` con `anchorScrolling`, `scrollPositionRestoration` y `scrollOffset`.

La prueba importa el `AppRoutingModule` real e inyecta ese token, así que lee la configuración efectiva y no una copia.

### D-002: Demostrar que cada guardia falla antes de aceptarlo

El defecto que este spec corrige es una prueba que pasaba siempre. Escribir otra con el mismo vicio sería peor que no escribirla, porque daría confianza falsa.

Por eso cada guardia se somete a una verificación: se altera a propósito la configuración real, se corre la suite, se confirma el fallo, y se restaura. Un guardia que no falla en esa prueba no se acepta. Esta verificación se registra con su salida.

### D-003: Eliminar el código muerto en vez de cubrirlo

Decisión del usuario, con la evidencia del `spec.md`. Los tres archivos no se ejecutan nunca, son remanentes de la Home anterior al rediseño del spec 001, y cada uno es referenciado solo por `app.module.ts` y por sí mismo.

Beneficio colateral medible: el spec 006 tendrá tres componentes menos que migrar, y las advertencias de lint bajan porque desaparecen tres `standalone: false` y un constructor con inyección clásica de dos parámetros.

Reversibilidad: los archivos quedan en la historia de git, recuperables con un comando.

### D-004: Invertir `skipTests` en los ocho tipos

Decisión del usuario. Ataca la causa raíz: sin esto, cualquier archivo creado después de este spec vuelve a nacer sin especificación y el hueco se reabre.

No afecta a ningún archivo existente; cambia el resultado de todo `ng generate` futuro, y por eso se documenta en el README.

### D-005: Ajustar `maxWarnings` al número real posterior a las eliminaciones

El spec 002 fijó `maxWarnings: 42` como techo medido. Al eliminar tres archivos con `standalone: false` y un constructor con dos inyecciones, ese número baja. Dejarlo en 42 convertiría el techo en holgura silenciosa, que es lo contrario de su propósito.

## Verification

1. La suite pasa completa, con conteo mayor que 95.
2. Cada guardia nuevo se demuestra capaz de fallar, con la salida registrada.
3. `npm run lint` en 0 errores y menos de 42 advertencias.
4. `npm run format:check` en 0.
5. `npm run build` en 0, sin crecimiento de tamaño.
6. Sin referencias a los tres símbolos eliminados en `src`.

## File Map

| Archivo | Acción |
|---|---|
| `src/app/app-routing.module.spec.ts` | reescribir: assertear contra el módulo real, más los guardias de scroll |
| `src/app/components/service/card-template/card-template.spec.ts` | crear |
| `src/app/components/choose-us/` | eliminar los tres archivos |
| `src/app/components/our-team/` | eliminar los tres archivos |
| `src/app/shared/directives/count-up.directive.ts` | eliminar |
| `src/app/app.module.ts` | modificar: quitar tres imports y tres declaraciones |
| `angular.json` | modificar: ocho `skipTests` y `maxWarnings` |
| `README.md` | modificar: nota sobre generación de especificaciones |
| `.specify/feature.json` | modificar |
| `specs/005-test-safety-net/` | crear |

Ningún otro archivo de código vivo debe aparecer en el diff.

## Risks and Mitigations

| Riesgo | Mitigación |
|---|---|
| R-001 referencia colgante tras eliminar | Referencias ya verificadas por búsqueda; se confirma con compilación y pruebas |
| R-002 un guardia que pasa siempre | D-002: se demuestra el fallo alterando la configuración, y se registra |
| R-003 `skipTests` cambia el futuro del proyecto | Documentado en el README |
| R-004 probar el pipe en vez del componente | La prueba assertea la estructura que el componente produce desde su entrada |
