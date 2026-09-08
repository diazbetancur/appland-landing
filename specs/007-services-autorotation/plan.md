# Implementation Plan: Rotación automática de la sección de servicios

**Spec**: `specs/007-services-autorotation/spec.md`

**Created**: 2026-09-08

## Summary

Añadir rotación automática al `tablist` de servicios sin tocar su semántica ARIA ni su navegación por teclado, y hacer perceptible en móvil que hay pestañas fuera de vista.

El trabajo se concentra en `HomeServicesComponent`. No se crean servicios nuevos ni se modifica contenido. La pieza delicada no es el temporizador sino **las cinco condiciones que deben poder detenerlo**, y la interacción de todas ellas con lo que el componente ya hace.

## Technical Context

| Aspecto | Valor |
|---|---|
| Componente objetivo | `src/app/components/home-services/home-services.component.{ts,html,scss}` |
| Pruebas existentes | 8, en `home-services.component.spec.ts` |
| Detección de cambios | zone.js, vía `provideZoneChangeDetection` |
| Paquete de animaciones | **No es dependencia del proyecto.** El fundido debe ser CSS puro |
| Precedente de pausa | `OurClientsComponent` (`pausedByUser` / `pausedByInteraction` / `reducedMotion`) |
| Precedente de desborde | `HorizontalCarouselDirective` (`maxScroll`, `atStart`, `atEnd`, scroll consciente de `prefers-reduced-motion`) |
| Precedente de visibilidad | `RevealOnScrollDirective` y `HomeSectionDirective`, ambos con `IntersectionObserver` propio |

## Decisions

### TD-001: Cinco causas de parada, independientes y explícitas

El estado de rotación se deriva de cinco banderas separadas, siguiendo la forma que `OurClientsComponent` ya usa en el proyecto:

| Bandera | Origen | Reversible |
|---|---|---|
| `reducedMotion` | `matchMedia` al iniciar | No |
| `stoppedByUser` | Selección manual (FR-003) o `?servicio=` (D-001) | **No, permanente** |
| `pausedByControl` | Botón de pausa (D-003) | Sí, alterna |
| `pausedByInteraction` | Puntero encima o foco dentro (D-002) | Sí |
| `outOfView` | `IntersectionObserver` | Sí |

`rotating` es la conjunción de las cinco. Se modelan por separado en vez de con un único booleano porque son reversibles de forma distinta: colapsarlas haría que salir del hover reanudara algo que una selección manual había detenido para siempre.

### TD-002: `setTimeout` encadenado, no `setInterval`

Cada avance programa el siguiente. Al reanudar tras una pausa, el visitante recibe **6 segundos completos** para leer, en vez de caer en un tic que ya estaba a medio camino.

El temporizador se programa con `NgZone.runOutsideAngular` y solo se vuelve a entrar con `ngZone.run` para aplicar el cambio de índice. Sin esto, un temporizador de 6 segundos dispara detección de cambios en **toda** la aplicación de forma indefinida mientras la Home está abierta, que es lo que NFR-005 prohíbe.

### TD-003: `IntersectionObserver` propio, no `HomeSectionObserverService`

Podría parecer que el servicio de secciones ya sabe si `servicios` está a la vista, pero no responde a esa pregunta: expone qué región es la **activa para el resaltado del menú**, calculada con una línea de activación a 140 px, y solo una región puede serlo a la vez. Una sección puede estar perfectamente visible y no ser la activa.

Se usa un `IntersectionObserver` propio en el componente, como ya hacen `RevealOnScrollDirective` y `HomeSectionDirective`.

### TD-004: El fundido, recreando el nodo del panel

Sin `@angular/animations`, una transición CSS no se dispara al cambiar el contenido de un nodo que persiste. `@if (activeService; as service)` conserva el mismo nodo entre servicios, así que una animación declarada sobre él correría una sola vez.

El panel pasa a renderizarse con un bloque `@for` sobre una lista de un solo elemento, con `track service.id`. Al cambiar el id, Angular destruye y recrea el nodo, y el `@keyframes` de entrada de 250 ms (D-004) corre en cada cambio. Bajo `prefers-reduced-motion` la animación se anula en el propio SCSS, como ya hacen las otras nueve secciones.

Recrear el nodo es seguro respecto al foco: la rotación está pausada mientras el foco esté dentro (TD-001).

### TD-005: No reutilizar `HorizontalCarouselDirective` en la tira de pestañas

Es tentador porque ya mide desborde, pero **entra en conflicto directo**: la directiva registra `@HostListener('keydown')` para `ArrowLeft` y `ArrowRight` con `preventDefault`, y el `tablist` ya usa esas mismas teclas para mover la pestaña activa en `onTabKeydown`. Aplicarla a `.services__tabs` haría que una flecha desplazara la tira **y** cambiara de pestaña.

Se implementa en el componente la porción mínima de medición que hace falta (`scrollWidth > clientWidth`), sin arrastrar el resto del comportamiento de la directiva.

### TD-006: La tira se desplaza con `scrollTo` sobre sí misma, nunca con `scrollIntoView`

`scrollIntoView` sobre la pestaña activa escala por los ancestros y puede desplazar la página entera, que es lo que FR-013 prohíbe. Se calcula la posición y se asigna sobre el contenedor de la tira, que solo puede desplazarse a sí mismo.

El desplazamiento es suave, salvo bajo `prefers-reduced-motion`, siguiendo el criterio que `HorizontalCarouselDirective` ya aplica.

### TD-007: La lógica se prueba por API pública, no a través de observers reales

`IntersectionObserver` y `matchMedia` se mantienen en los bordes: el observer solo llama a un método público que fija `outOfView`. Así la máquina de estados se prueba llamando a métodos, sin simular observers, que es la misma separación que ya existe entre `HomeSectionDirective` y `HomeSectionObserverService`.

## Verification

| Comprobación | Cómo |
|---|---|
| SC-001 a SC-006, SC-009, SC-010 | Pruebas automatizadas con temporizadores falsos |
| SC-007, SC-008 | Medición en Chromium a 390 px, con captura |
| SC-011 | `npm run test:ci`, `npm run lint`, `npm run format:check`, `npm run build` |
| SC-012 | Cada prueba nueva se ejecuta contra el código sin el cambio y debe fallar |

## Risks and Mitigations

- **R-001 (spec)**: parada por foco. Cubierta por TD-001 y verificada por SC-003.
- **R-002 (spec)**: detección de cambios global. Cubierta por TD-002.
- **R-003 (spec)**: las 8 pruebas existentes pueden volverse intermitentes. Se ejecutan tras cada fase; si alguna se vuelve dependiente del reloj, se le añaden temporizadores falsos sin cambiar su intención.
- **R-004 (spec)**: arrastre de la página. Cubierta por TD-006.
- **R-005 (spec)**: competencia con `?servicio=`. Resuelta por D-001: el parámetro detiene la rotación.
- **R-007 (nuevo)**: recrear el nodo del panel recrea también su `<img>`, que tiene `loading="lazy"`. En la primera vuelta la imagen puede aparecer con un salto perceptible antes de estar en caché. Se mide en navegador; si ocurre, se corrige precargando las imágenes de los servicios y se registra como desviación.
- **R-008 (nuevo)**: el conflicto de teclado descrito en TD-005 podría reaparecer si alguien aplica la directiva más adelante. Se deja una prueba que fija que una flecha cambia de pestaña y no desplaza la tira.
