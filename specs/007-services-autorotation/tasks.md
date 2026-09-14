# Tasks: Rotación automática de la sección de servicios

**Input**: Design documents from `specs/007-services-autorotation/`

**Prerequisites**: `spec.md`, `plan.md`

**Organization**: Cinco fases. Cada una deja la suite verde antes de pasar a la siguiente, para que cualquier regresión sea atribuible a un solo cambio. Las pruebas se escriben antes que el código en cada fase y se comprueba que fallan.

---

## Phase 1 — Línea base y máquina de estados

- [x] T001 Ejecutar `npm run test:ci` y registrar el conteo de partida. Depende de: ninguna. Resultado: línea base de NFR-001.
- [x] T002 Escribir las pruebas de la máquina de estados en `home-services.component.spec.ts`: las cinco banderas de TD-001 y su conjunción. Depende de: T001. Resultado: FR-003 a FR-007 cubiertos.
- [x] T003 Verificar que las pruebas de T002 fallan. Depende de: T002. Resultado: SC-012.
- [x] T004 Implementar en `home-services.component.ts` las cinco banderas y el getter `rotating`, sin temporizador todavía. Depende de: T003. Resultado: FR-003, FR-005, FR-007.
- [x] T005 Ejecutar la suite. Depende de: T004. Resultado: efecto aislado.

**Checkpoint**: la máquina de estados decide correctamente, sin que nada rote aún.

---

## Phase 2 — El avance automático

- [x] T006 Escribir las pruebas del avance con temporizadores falsos: avance a los 6 s, ciclo circular, y que no avance con `rotating` en falso. Depende de: T005. Resultado: FR-001, FR-002.
- [x] T007 Verificar que fallan. Depende de: T006. Resultado: SC-012.
- [x] T008 Implementar el `setTimeout` encadenado fuera de la zona de Angular, según TD-002, con su liberación en `ngOnDestroy`. Depende de: T007. Resultado: FR-001, FR-002, FR-014, NFR-005.
- [x] T009 Escribir y verificar la prueba de que un avance automático actualiza `aria-selected` y `tabindex` igual que uno manual. Depende de: T008. Resultado: FR-009.
- [x] T010 Comprobar que el panel no es una región `aria-live`. Depende de: T009. Resultado: FR-010.
- [x] T011 Ejecutar la suite completa, incluidas las 8 pruebas originales. Depende de: T010. Resultado: R-003 atendido.

**Checkpoint**: la sección rota sola y para cuando debe. Sin fundido, sin control, sin móvil.

---

## Phase 3 — Visibilidad, control de pausa y detención permanente

- [x] T012 Escribir y verificar las pruebas de `outOfView` por API pública, según TD-007. Depende de: T011. Resultado: FR-004, SC-004.
- [x] T013 Conectar un `IntersectionObserver` propio que solo fije `outOfView`, según TD-003. Depende de: T012. Resultado: FR-004.
- [x] T014 Escribir y verificar la prueba de que `?servicio=` detiene la rotación de forma permanente. Depende de: T013. Resultado: D-001, FR-003, SC-010.
- [x] T015 Implementar esa detención sin romper la precedencia actual entre selección manual y URL. Depende de: T014. Resultado: D-001.
- [x] T016 Escribir y verificar las pruebas del control de pausa: alterna, es alcanzable por teclado y su estado es legible. Depende de: T015. Resultado: FR-006, D-003, SC-006.
- [x] T017 Añadir el control de pausa en la plantilla y su estilo discreto en el SCSS. Depende de: T016. Resultado: FR-006.
- [x] T018 Ejecutar la suite. Depende de: T017. Resultado: efecto aislado.

**Checkpoint**: las cinco causas de parada operativas y verificadas.

---

## Phase 4 — Fundido y comportamiento en móvil

- [x] T019 Convertir el panel al bloque `@for` con `track service.id`, según TD-004. Depende de: T018. Resultado: base de FR-008.
- [x] T020 Añadir el `@keyframes` de entrada de 250 ms y su anulación bajo `prefers-reduced-motion`. Depende de: T019. Resultado: FR-008, D-004, SC-005.
- [x] T021 Verificar en navegador que el fundido corre en cada cambio y que R-007 no se materializa. Si la imagen salta, precargar y registrarlo como desviación. Depende de: T020. Resultado: R-007.
- [x] T022 Escribir y verificar la prueba de detección de desborde de la tira, según TD-005. Depende de: T021. Resultado: FR-012.
- [x] T023 Implementar la señal visual de que hay pestañas fuera de vista. Depende de: T022. Resultado: FR-012, SC-008.
- [x] T024 Escribir y verificar la prueba de que la tira se desplaza con `scrollTo` sobre sí misma y no mueve la página ni el foco, según TD-006. Depende de: T023. Resultado: FR-011, FR-013.
- [x] T025 Implementar el seguimiento de la pestaña activa. Depende de: T024. Resultado: FR-011.
- [x] T026 Escribir la prueba de regresión de R-008: una flecha cambia de pestaña y no desplaza la tira. Depende de: T025. Resultado: R-008, SC-009.
- [x] T027 Ejecutar la suite. Depende de: T026. Resultado: efecto aislado.

**Checkpoint**: comportamiento completo en todos los anchos.

---

## Phase 5 — Verificación

- [x] T028 Medir en Chromium a 390 px que tras cada avance la pestaña activa queda completamente visible, con captura. Depende de: T027. Resultado: SC-007.
- [x] T029 Medir a 390 px que se percibe sin interactuar que hay más de dos pestañas, con captura. Depende de: T028. Resultado: SC-008.
- [x] T030 Verificar a 1440 px que la rotación no rompe la composición existente. Depende de: T029. Resultado: FR-010 en contexto.
- [x] T031 Ejecutar `npm run test:ci`, `npm run lint`, `npm run format:check` y `npm run build`. Depende de: T030. Resultado: SC-011, NFR-001 a NFR-004.
- [x] T032 Confirmar que el conteo de pruebas no bajó de la línea base de T001. Depende de: T031. Resultado: NFR-001.
- [ ] T033 Revisión del usuario en navegador. Depende de: T032. Resultado: aceptación.

---

## Cierre: criterios de éxito contra evidencia

Se completa al terminar, con la evidencia de cada criterio.

| Criterio | Evidencia |
|---|---|
| SC-001 | Medido en Chromium a 390 px y 1440 px: recorre los cinco servicios y vuelve al primero |
| SC-002 | `deja de avanzar tras una selección manual`, con temporizadores falsos |
| SC-003 | `pausa mientras el puntero o el foco están dentro de la sección` |
| SC-004 | `deja de rotar cuando la sección sale del viewport y retoma al volver`, con observador simulado |
| SC-005 | `no rota cuando se pide movimiento reducido`; animación anulada en el SCSS |
| SC-006 | `se muestra y alterna su estado declarado` y `lleva un nombre accesible que refleja lo que hará al pulsarse` |
| SC-007 | Medido a 390 px: la pestaña activa quedó completamente dentro de la tira en los cinco avances, con `scrollX` de la página en 0 |
| SC-008 | Contador `1 / 5` visible a 390 px sin interactuar. A 1440 px no aparece, porque no hay nada fuera de vista |
| SC-009 | `supports ArrowLeft, ArrowRight, Home and End roving activation`, sin cambios |
| SC-010 | `opens the service requested through the URL instead of defaulting to the first one`, ampliada con D-001 |
| SC-011 | 149 pruebas, lint 0, format 0, build 437.09 kB |
| SC-012 | Fases 2, 3 y 4 con rojo de comportamiento previo. La fase 1 solo pudo dar rojo de compilación, al no existir la API todavía; se completó forzando después un rojo real sobre la permanencia |

### Desviaciones respecto al plan

- **La bandera de visibilidad es `inView`, positiva y con valor inicial `true`**, en vez de `outOfView`. Arrancar en "no visible" dejaba la sección sin rotar donde no exista `IntersectionObserver`. El observador corrige el valor en cuanto entra en juego y el primer avance no llega hasta los seis segundos, así que el optimismo inicial no puede provocar un cambio indebido.

- **`refreshOverflow()` se aplaza un microtask.** Medir dentro de `ngAfterViewInit` cambia, ya terminada la comprobación de la vista, un valor que la plantilla acaba de leer: 39 pruebas cayeron con `NG0100`. Se resolvió con `queueMicrotask`, que es lo que `HorizontalCarouselDirective` ya hacía por el mismo motivo.

- **T026 no añadió prueba nueva.** El plan pedía fijar que una flecha cambia de pestaña y no desplaza la tira, pero la segunda mitad contradice a FR-011, que exige justamente que la tira siga a la pestaña activa. La primera mitad ya la cubre `supports ArrowLeft, ArrowRight, Home and End roving activation`. El riesgo R-008 queda cubierto por esa prueba.

- **FR-012 se resolvió con un contador `1 / 5`, no con un degradado.** Un degradado insinúa que hay más; un contador dice cuántas hay, que es literalmente el objetivo de negocio. Sigue el precedente de `positionLabel` de `HorizontalCarouselDirective`, pero sin `aria-live`: con rotación automática esa región hablaría cada seis segundos, que es lo que FR-010 prohíbe. Va con `aria-hidden`, porque el `tablist` ya expone posición y total.

- **La prueba de desborde se reescribió.** La primera versión suponía que las cinco pestañas caben en el navegador de pruebas, y no caben. Ahora fuerza las dos condiciones sobre el elemento real y comprueba que la medición las sigue.

- **R-007 no se materializó.** Medido justo tras cada uno de los cinco avances, la imagen del panel recreado ya estaba pintada. No hizo falta precargar.

### Hallazgo fuera de alcance

`OurClientsComponent` expone `pausedByUser` y `togglePause()`, y su SCSS define `.clients__pause`, pero su plantilla no tiene ningún control que los invoque: es código muerto desde el spec 001. No se toca aquí; queda anotado.


---

## Dependency Summary

Las cinco fases son estrictamente secuenciales: cada una deja la suite verde antes de la siguiente. Dentro de cada fase, prueba antes que código, y verificación de que la prueba falla antes de implementar.
