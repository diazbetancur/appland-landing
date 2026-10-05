# Tasks: Test Safety Net

**Input**: Design documents from `specs/005-test-safety-net/`

**Prerequisites**: `spec.md`, `plan.md`

**Organization**: Tres fases. Los guardias se escriben y se demuestran capaces de fallar antes de tocar nada más, porque son la razón de ser del spec.

---

## Phase 1 — Reparar y proteger el routing

- [x] T001 Reescribir `app-routing.module.spec.ts` para assertear contra el módulo real. Depende de: ninguna. Resultado: FR-001, FR-002. **Hecho**: la prueba importa `AppRoutingModule` con `provideLocationMocks()` y lee `TestBed.inject(Router).config`. Se eliminó la copia escrita a mano de las rutas.
- [x] T002 Añadir guardias de las tres opciones de scroll vía `ROUTER_CONFIGURATION`. Depende de: T001. Resultado: FR-003, D-001. **Hecho**: verificado antes que `ROUTER_CONFIGURATION` es export público de `@angular/router` y que las tres opciones existen en `ExtraOptions`.
- [x] T003 Confirmar que las pruebas nuevas pasan con la configuración correcta. Depende de: T002. Resultado: **98 pasando**, código de salida 0.
- [x] T004 **Demostrar que los guardias fallan.** Depende de: T003. Resultado: FR-004, R-002, SC-002 y SC-003 verificados en la práctica.

  **Demostración 1, opciones de scroll.** Se alteraron las tres a la vez en `app-routing.module.ts`: `anchorScrolling` a `'disabled'`, `scrollPositionRestoration` a `'disabled'` y `scrollOffset` a `[0, 0]`. Resultado: **3 fallos, uno por cada guardia**, cada uno señalando su propia opción. Código de salida 1.

  **Demostración 2, tabla de rutas.** Se cambió `path: 'about'` por `path: 'nosotros'`. Resultado: **1 fallo**, el de la prueba de rutas. Código de salida 1.

  **El punto de todo el spec**: la versión anterior de esta prueba **no** habría fallado con la demostración 2, porque asserteaba contra su propia copia de las rutas. Ahí está la diferencia entre una prueba y un falso positivo.

  El archivo se restauró con `git checkout --` tras cada demostración, y se confirmó que las tres opciones y las tres rutas volvieron a sus valores originales.

**Checkpoint**: El routing tiene protección demostrada. El spec 006 ya no puede romper el scroll en silencio.

---

## Phase 2 — Cerrar el hueco de código vivo

- [x] T005 Crear la especificación de `card-template` cubriendo comportamiento observable. Depende de: ninguna. Resultado: FR-005, R-004. **Hecho**: seis casos que fijan una tarjeta por entrada con su `data-key`, la construcción del `src` del icono desde la carpeta de assets, el `alt` vacío que mantiene los iconos decorativos para tecnología asistiva, el re-render al cambiar la entrada, el caso de entrada vacía, y que el título y la descripción pasan por traducción en vez de imprimirse crudos. R-004 atendido: las aserciones verifican la estructura que el componente produce desde su entrada, y el caso de traducción siembra valores reales para comprobar que el componente pasa las claves correctas.
- [x] T006 Ejecutar la suite. Depende de: T005. Resultado: la prueba nueva pasa. **El primer intento falló a compilación**: `fixture.nativeElement` está tipado como `any`, y `querySelectorAll<T>` no acepta argumento de tipo en una llamada sin tipar (`TS2347`). Resuelto con un accesor tipado una sola vez. Resultado: **104 pasando** en 26 archivos.

**Checkpoint**: El único hueco de cobertura de código vivo queda cerrado.

---

## Phase 3 — Eliminar el código muerto y su causa raíz

- [x] T007 Eliminar los siete archivos muertos. Depende de: T006. Resultado: FR-006, D-003. **Hecho**: `choose-us` y `our-team` completos (`.ts`, `.html`, `.scss` cada uno) más `count-up.directive.ts`.
- [x] T008 Quitar los tres imports y las tres declaraciones de `app.module.ts`. Depende de: T007. Resultado: sin referencias colgantes. **Hecho**: seis líneas.
- [x] T009 Verificar que no queda ninguna referencia en `src`. Depende de: T008. Resultado: SC-007, R-001. **Verificado**: cero referencias a `ChooseUsComponent`, `OurTeamComponent`, `CountUpDirective` y `appCountUp`.

  **Hallazgo no previsto.** Quedaban dos referencias a los selectores en `home.component.spec.ts`, en un caso llamado "does not render the inherited Home composition or metrics" que el spec 001 escribió para garantizar que las secciones viejas no volvieran a la Home. Con los componentes eliminados, esas dos aserciones **dejaron de poder fallar**: se volvieron vacuas, exactamente el vicio que este spec corrige. Se retiraron con un comentario que explica por qué, conservando las dos que siguen siendo verificables: `app-service`, cuyo componente sigue existiendo y es propiedad de la ruta `/service`, y el control de que el texto `100K` no aparezca, que cualquier componente futuro podría violar.

- [x] T010 Invertir `skipTests` a `false` en los ocho tipos. Depende de: ninguna. Resultado: FR-007, D-004. **Hecho**: cero quedan en `true`.
- [x] T011 Medir las advertencias reales y ajustar `maxWarnings`. Depende de: T009. Resultado: SC-008, D-005. **Medido: de 42 a 37**, con `prefer-standalone` de 29 a 26 y `prefer-inject` de 13 a 11, exactamente lo que el plan predijo. `maxWarnings` ajustado a 37.
- [x] T012 Documentar el cambio de `skipTests` en el README. Depende de: T010. Resultado: R-003. **Hecho**, incluyendo la instrucción de rellenar la especificación generada en vez de borrarla.
- [x] T013 Ejecutar las cuatro verificaciones. Depende de: T011, T012. Resultado: SC-001, SC-004, SC-005, SC-006. **Ejecutado**, ver la tabla de cierre.
- [x] T014 Actualizar `.specify/feature.json` y registrar las salidas reales. Depende de: T013. Resultado: evidencia citable. **Hecho.**
- [ ] T015 Presentar el resumen de commits y esperar indicación del usuario. Depende de: T014. Resultado: el usuario conserva el control de commit y push.

**Checkpoint**: Spec 005 cerrado a falta de autorización de commit; el spec 006 puede ejecutarse con una red de seguridad real.

---

## Cierre: criterios de éxito contra evidencia

| Criterio | Comando | Resultado |
|---|---|---|
| SC-001 suite verde con más de 95 | `npm run test:ci` | código 0, **104 pasando** en 26 archivos |
| SC-002 la prueba de rutas falla si se altera la tabla | demostración 2 de T004 | 1 fallo, código 1 |
| SC-003 cada guardia de scroll falla si se altera su opción | demostración 1 de T004 | 3 fallos, uno por guardia, código 1 |
| SC-004 lint en 0 con menos de 42 advertencias | `npm run lint` | código 0, 0 errores, **37 advertencias** |
| SC-005 formato | `npm run format:check` | código 0 |
| SC-006 build sin crecer | `npm run build` | código 0, 450.02 kB y 112.70 kB |
| SC-007 sin referencias a lo eliminado | inspección de `src` | 0 referencias |
| SC-008 `maxWarnings` al número real | `angular.json` | 37 |

### Observación sin explicación completa

El tamaño del bundle **no bajó** al eliminar tres componentes declarados en `AppModule`: el total en crudo quedó idéntico en 450.02 kB y la transferencia bajó solo 0.04 kB. Se esperaba una reducción mayor, dado que las declaraciones de un NgModule son referencias eager.

No se ofrece una explicación porque no se midió a fondo. Lo que sí se cumple es SC-006, que exigía que el tamaño no creciera. El beneficio real de la eliminación fue de mantenimiento y de alcance del spec 006, no de peso.

### Desviaciones respecto al plan

1. **Un archivo fuera del mapa declarado**: `home.component.spec.ts`, por las dos aserciones que quedaron vacuas al eliminar los componentes. Consecuencia directa e inevitable de la eliminación.
2. **`app-routing.module.ts` aparece como modificado en `git status` pero no tiene cambio de contenido.** Es un artefacto de `core.autocrlf=true` sin `.gitattributes`, la condición latente registrada en el spec 002. Verificado con `git diff --numstat` y con un `git add` de prueba: git normaliza y no encuentra diferencia, así que el archivo no entra al commit.
3. **Un fallo de compilación al escribir la prueba nueva**, por el tipado de `fixture.nativeElement`.
4. **Ningún riesgo del plan se materializó como problema**: R-001 no dejó referencias colgantes, R-002 se descartó por demostración, R-003 quedó documentado y R-004 se atendió en el diseño de las aserciones.

---

## Dependency Summary

- T004 es el punto crítico del spec: sin demostrar el fallo, los guardias no valen nada.
- Las eliminaciones van después de que las pruebas nuevas estén verdes, para no mezclar causas si algo falla.
- T015 es el único punto donde se proponen commits.
