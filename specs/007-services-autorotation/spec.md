# Feature Specification: Rotación automática de la sección de servicios

**Feature Branch**: `007-services-autorotation`

**Created**: 2026-09-08

**Status**: Awaiting review

**Input**: Petición del usuario durante la ronda 2 de correcciones: "Necesitamos que esta sección vaya cambiando entre las soluciones principales en automático para que pueda entenderse que son varias soluciones/servicios los que tenemos".

## Scope

### Business Goal

Que el visitante perciba que APPLAND ofrece **cinco** soluciones y no una. El objetivo declarado por el usuario es de comprensión, no de animación: la rotación es el medio, no el fin.

Hoy la sección muestra las cinco pestañas pero un solo panel de contenido, el del primer servicio. Un visitante que no interactúa se lleva la impresión de que el servicio de APPLAND es "Desarrollo de Software".

### Measured Starting Point

Medido en Chromium sobre la rama `fix/ronda-2` antes de escribir este spec.

| Medida | Valor |
|---|---|
| Servicios en el contenido | 5 |
| Pestañas visibles a 1440 px | 5 de 5, en una fila, sin desborde |
| Pestañas visibles a 390 px | **2 de 5** |
| Desborde horizontal de la tira a 390 px | Sí, sin flecha, degradado ni barra visible |
| Pruebas del componente | 8 |
| Pruebas totales del proyecto | 119 |

### El hallazgo que amplía el alcance

En escritorio la variedad ya es visible: las cinco pestañas caben en una fila. **El problema de comprensión está concentrado en móvil**, donde solo se ven dos y las otras tres viven detrás de un scroll horizontal sin ninguna señal de que exista.

Esto tiene una consecuencia directa sobre la rotación: si el panel rota pero la tira de pestañas no acompaña, en móvil la pestaña activa se sale de pantalla y el visitante ve el contenido cambiar solo, sin ver qué lo está cambiando. Eso confunde en vez de aclarar, que es lo contrario del objetivo.

Por eso el spec cubre las dos mitades: la rotación **y** que en móvil se perciba que hay más pestañas. El usuario confirmó incluir esta segunda mitad.

### Lo que ya existe y hay que respetar

`HomeServicesComponent` no es un carrusel: es un `tablist` ARIA completo.

| Capacidad actual | Dónde |
|---|---|
| 5 pestañas con `role="tab"` y panel asociado por `aria-controls` | `home-services.component.html` |
| `tabindex` roving y navegación con flechas, Home y End | `home-services.component.ts:78-95` |
| Selección por parámetro de URL `?servicio=`, que usan los enlaces del pie | `home-services.component.ts:42-76` |
| Precedencia de la selección manual sobre la URL | `home-services.component.ts:59-64` |

Existe además un precedente de movimiento automático en el proyecto: `OurClientsComponent` separa `pausedByUser`, `pausedByInteraction` y `reducedMotion` en tres causas independientes de pausa (`our-clients.component.ts:12-30`). Esta implementación reutiliza esa forma en lugar de inventar otra.

### Decisiones tomadas por el usuario

| # | Decisión | Valor |
|---|---|---|
| 1 | Intervalo entre servicios | 6 segundos |
| 2 | Duración del ciclo | Indefinida, circular |
| 3 | Tras una selección manual | Se detiene para siempre |
| 4 | Control de pausa visible | Sí, discreto |
| 5 | Transición entre paneles | Fundido corto |
| 6 | Tratamiento de móvil | Incluido en el alcance |

### In Scope

- Avance automático entre los cinco servicios cada 6 segundos, en ciclo indefinido.
- Detención permanente ante una selección manual.
- Pausa temporal por puntero encima y por foco dentro de la sección.
- Suspensión mientras la sección está fuera del viewport.
- Respeto de `prefers-reduced-motion`.
- Control de pausa y reanudación visible, discreto y operable por teclado.
- Fundido corto al cambiar de panel.
- En anchos con desborde, la tira sigue a la pestaña activa.
- Señal visual permanente de que hay pestañas fuera de vista.
- Pruebas del comportamiento nuevo y conservación de las 8 existentes.

### Out of Scope

- Cambiar el contenido, el orden o el número de servicios.
- Cambiar la semántica ARIA del `tablist` o la navegación por teclado existente.
- Cambiar el comportamiento del parámetro `?servicio=` más allá de su interacción con la rotación.
- Aplicar rotación automática a cualquier otra sección.
- Rediseñar la tira de pestañas más allá de la señal de desborde y el seguimiento de la activa.

## Requirements

### Functional Requirements

- **FR-001**: La sección debe avanzar al siguiente servicio cada 6 segundos.
- **FR-002**: El recorrido debe ser circular e indefinido: tras el quinto servicio vuelve al primero y continúa.
- **FR-003**: Una selección manual, por clic o por teclado, debe detener la rotación de forma permanente durante el resto de la visita.
- **FR-004**: La rotación no debe iniciarse ni continuar mientras la sección esté fuera del viewport.
- **FR-005**: La rotación debe pausarse mientras el puntero esté sobre la sección y mientras el foco esté dentro de ella, y reanudarse al salir, salvo que ya esté detenida de forma permanente.
- **FR-006**: Debe existir un control visible y discreto para pausar y reanudar, operable por teclado, cuyo estado sea perceptible para tecnologías de asistencia.
- **FR-007**: Con `prefers-reduced-motion: reduce` la rotación no debe iniciarse.
- **FR-008**: El cambio de panel debe usar un fundido corto, anulado bajo `prefers-reduced-motion`.
- **FR-009**: Un avance automático debe actualizar `aria-selected` y `tabindex` exactamente igual que una selección manual.
- **FR-010**: El panel no debe ser una región `aria-live`: un cambio automático no debe interrumpir a un lector de pantalla.
- **FR-011**: En los anchos donde la tira desborda, la pestaña activa debe quedar visible tras cada avance.
- **FR-012**: Cuando existan pestañas fuera de vista, debe haber una señal visual permanente de que existen.
- **FR-013**: El desplazamiento de la tira no debe desplazar la página ni mover el foco.
- **FR-014**: El temporizador debe liberarse al destruir el componente.

### Non-Functional Requirements

- **NFR-001**: Las 8 pruebas actuales del componente deben seguir vigentes; el total del proyecto no debe bajar de 119.
- **NFR-002**: `npm run lint` debe terminar en 0.
- **NFR-003**: `npm run format:check` debe terminar en 0.
- **NFR-004**: `npm run build` debe terminar en 0.
- **NFR-005**: El temporizador no debe provocar detección de cambios en toda la aplicación cada 6 segundos.

## Success Criteria

- **SC-001**: Sin interactuar, la sección recorre los cinco servicios y vuelve al primero.
- **SC-002**: Tras un clic en una pestaña, la sección no vuelve a cambiar sola en toda la visita.
- **SC-003**: Con el puntero encima o el foco dentro, la sección no cambia; al salir, reanuda.
- **SC-004**: Con la sección fuera de pantalla, el índice activo no avanza.
- **SC-005**: Con `prefers-reduced-motion: reduce`, la sección nunca cambia sola y no hay fundido.
- **SC-006**: El control de pausa es alcanzable con Tab, se opera con Enter o Espacio y su estado es legible.
- **SC-007**: A 390 px, tras cada avance la pestaña activa queda completamente visible dentro de la tira.
- **SC-008**: A 390 px se percibe sin interactuar que hay más de dos pestañas.
- **SC-009**: La navegación con flechas, Home y End sigue funcionando igual que hoy.
- **SC-010**: `?servicio=` sigue abriendo el servicio pedido.
- **SC-011**: `npm run test:ci`, `lint`, `format:check` y `build` terminan en 0.
- **SC-012**: Cada prueba nueva se demuestra capaz de fallar.

## Risks

- **R-001**: Un `tablist` que rota solo es una trampa de accesibilidad conocida. Si no se detiene al recibir foco, un usuario de teclado pierde su posición cada 6 segundos. Mitigado por FR-005 y FR-006.
- **R-002**: `setInterval` dentro de la zona de Angular dispara detección de cambios en toda la aplicación en cada tic. Con `provideZoneChangeDetection` activo, eso es un coste global por una animación local. Mitigación: ejecutar el temporizador fuera de la zona y volver a entrar solo para el cambio de índice. Recogido en NFR-005.
- **R-003**: Las 8 pruebas actuales llaman `detectChanges` sin temporizadores falsos. Al introducir un intervalo pueden volverse intermitentes. Mitigación: temporizadores falsos en las pruebas nuevas y revisión de las existentes.
- **R-004**: El desplazamiento programático de la tira en móvil puede arrastrar la página entera si se usa `scrollIntoView` sin acotar. Recogido en FR-013.
- **R-005**: La rotación y el parámetro `?servicio=` compiten por decidir la pestaña activa. Ver decisión pendiente D-001.
- **R-006**: Rotar indefinidamente mientras alguien lee el panel puede resultar molesto. Es una decisión explícita del usuario, no un descuido; el control de pausa y la parada por foco y puntero son la mitigación.

## Decisiones secundarias

Cuatro puntos que la petición original no cubría. El usuario aceptó las cuatro propuestas el 2026-09-08.

- **D-001**: Un servicio pedido por `?servicio=` **detiene la rotación de forma permanente**. Es una intención explícita del visitante, y arrebatársela contradice el mismo criterio que la decisión 3.
- **D-002**: La pausa por puntero encima **reanuda al salir**, no detiene para siempre, porque pasar el ratón por encima puede ser accidental.
- **D-003**: El control de pausa **alterna** entre pausar y reanudar.
- **D-004**: El fundido dura **250 ms**.
