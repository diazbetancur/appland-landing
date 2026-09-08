# Tasks: Rotación automática de la sección de servicios

**Input**: Design documents from `specs/007-services-autorotation/`

**Prerequisites**: `spec.md`, `plan.md`

**Organization**: Cinco fases. Cada una deja la suite verde antes de pasar a la siguiente, para que cualquier regresión sea atribuible a un solo cambio. Las pruebas se escriben antes que el código en cada fase y se comprueba que fallan.

---

## Phase 1 — Línea base y máquina de estados

- [ ] T001 Ejecutar `npm run test:ci` y registrar el conteo de partida. Depende de: ninguna. Resultado: línea base de NFR-001.
- [ ] T002 Escribir las pruebas de la máquina de estados en `home-services.component.spec.ts`: las cinco banderas de TD-001 y su conjunción. Depende de: T001. Resultado: FR-003 a FR-007 cubiertos.
- [ ] T003 Verificar que las pruebas de T002 fallan. Depende de: T002. Resultado: SC-012.
- [ ] T004 Implementar en `home-services.component.ts` las cinco banderas y el getter `rotating`, sin temporizador todavía. Depende de: T003. Resultado: FR-003, FR-005, FR-007.
- [ ] T005 Ejecutar la suite. Depende de: T004. Resultado: efecto aislado.

**Checkpoint**: la máquina de estados decide correctamente, sin que nada rote aún.

---

## Phase 2 — El avance automático

- [ ] T006 Escribir las pruebas del avance con temporizadores falsos: avance a los 6 s, ciclo circular, y que no avance con `rotating` en falso. Depende de: T005. Resultado: FR-001, FR-002.
- [ ] T007 Verificar que fallan. Depende de: T006. Resultado: SC-012.
- [ ] T008 Implementar el `setTimeout` encadenado fuera de la zona de Angular, según TD-002, con su liberación en `ngOnDestroy`. Depende de: T007. Resultado: FR-001, FR-002, FR-014, NFR-005.
- [ ] T009 Escribir y verificar la prueba de que un avance automático actualiza `aria-selected` y `tabindex` igual que uno manual. Depende de: T008. Resultado: FR-009.
- [ ] T010 Comprobar que el panel no es una región `aria-live`. Depende de: T009. Resultado: FR-010.
- [ ] T011 Ejecutar la suite completa, incluidas las 8 pruebas originales. Depende de: T010. Resultado: R-003 atendido.

**Checkpoint**: la sección rota sola y para cuando debe. Sin fundido, sin control, sin móvil.

---

## Phase 3 — Visibilidad, control de pausa y detención permanente

- [ ] T012 Escribir y verificar las pruebas de `outOfView` por API pública, según TD-007. Depende de: T011. Resultado: FR-004, SC-004.
- [ ] T013 Conectar un `IntersectionObserver` propio que solo fije `outOfView`, según TD-003. Depende de: T012. Resultado: FR-004.
- [ ] T014 Escribir y verificar la prueba de que `?servicio=` detiene la rotación de forma permanente. Depende de: T013. Resultado: D-001, FR-003, SC-010.
- [ ] T015 Implementar esa detención sin romper la precedencia actual entre selección manual y URL. Depende de: T014. Resultado: D-001.
- [ ] T016 Escribir y verificar las pruebas del control de pausa: alterna, es alcanzable por teclado y su estado es legible. Depende de: T015. Resultado: FR-006, D-003, SC-006.
- [ ] T017 Añadir el control de pausa en la plantilla y su estilo discreto en el SCSS. Depende de: T016. Resultado: FR-006.
- [ ] T018 Ejecutar la suite. Depende de: T017. Resultado: efecto aislado.

**Checkpoint**: las cinco causas de parada operativas y verificadas.

---

## Phase 4 — Fundido y comportamiento en móvil

- [ ] T019 Convertir el panel al bloque `@for` con `track service.id`, según TD-004. Depende de: T018. Resultado: base de FR-008.
- [ ] T020 Añadir el `@keyframes` de entrada de 250 ms y su anulación bajo `prefers-reduced-motion`. Depende de: T019. Resultado: FR-008, D-004, SC-005.
- [ ] T021 Verificar en navegador que el fundido corre en cada cambio y que R-007 no se materializa. Si la imagen salta, precargar y registrarlo como desviación. Depende de: T020. Resultado: R-007.
- [ ] T022 Escribir y verificar la prueba de detección de desborde de la tira, según TD-005. Depende de: T021. Resultado: FR-012.
- [ ] T023 Implementar la señal visual de que hay pestañas fuera de vista. Depende de: T022. Resultado: FR-012, SC-008.
- [ ] T024 Escribir y verificar la prueba de que la tira se desplaza con `scrollTo` sobre sí misma y no mueve la página ni el foco, según TD-006. Depende de: T023. Resultado: FR-011, FR-013.
- [ ] T025 Implementar el seguimiento de la pestaña activa. Depende de: T024. Resultado: FR-011.
- [ ] T026 Escribir la prueba de regresión de R-008: una flecha cambia de pestaña y no desplaza la tira. Depende de: T025. Resultado: R-008, SC-009.
- [ ] T027 Ejecutar la suite. Depende de: T026. Resultado: efecto aislado.

**Checkpoint**: comportamiento completo en todos los anchos.

---

## Phase 5 — Verificación

- [ ] T028 Medir en Chromium a 390 px que tras cada avance la pestaña activa queda completamente visible, con captura. Depende de: T027. Resultado: SC-007.
- [ ] T029 Medir a 390 px que se percibe sin interactuar que hay más de dos pestañas, con captura. Depende de: T028. Resultado: SC-008.
- [ ] T030 Verificar a 1440 px que la rotación no rompe la composición existente. Depende de: T029. Resultado: FR-010 en contexto.
- [ ] T031 Ejecutar `npm run test:ci`, `npm run lint`, `npm run format:check` y `npm run build`. Depende de: T030. Resultado: SC-011, NFR-001 a NFR-004.
- [ ] T032 Confirmar que el conteo de pruebas no bajó de la línea base de T001. Depende de: T031. Resultado: NFR-001.
- [ ] T033 Revisión del usuario en navegador. Depende de: T032. Resultado: aceptación.

---

## Cierre: criterios de éxito contra evidencia

Se completa al terminar, con la evidencia de cada criterio.

| Criterio | Evidencia |
|---|---|
| SC-001 a SC-006 | |
| SC-007, SC-008 | |
| SC-009 a SC-012 | |

### Desviaciones respecto al plan

Se registran aquí conforme aparezcan.

---

## Dependency Summary

Las cinco fases son estrictamente secuenciales: cada una deja la suite verde antes de la siguiente. Dentro de cada fase, prueba antes que código, y verificación de que la prueba falla antes de implementar.
