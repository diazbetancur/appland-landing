# Tasks: Consolidación de la copia del Home en los archivos de traducción

**Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

**Branch**: `009-copy-consolidation`

Cada tarea declara de qué depende y qué requisito cubre. Las pruebas se escriben antes que la implementación y se demuestran capaces de fallar (SC-011).

## Phase 1 — Línea base y andamiaje de pruebas

- [ ] T001 Ejecutar `npm run test:ci`, `lint`, `format:check` y `build`, y registrar los cuatro resultados. Depende de: ninguna. Resultado: línea base de NFR-001 a NFR-004.
- [ ] T002 Capturar el texto renderizado actual de las 13 plantillas como referencia de comparación. Depende de: T001. Resultado: base de SC-001.
- [ ] T003 Escribir la prueba que compara los conjuntos de claves de `es.json` y `en.json`. Depende de: T001. Resultado: FR-003, SC-003.
- [ ] T004 Verificar que T003 falla al desparejar una clave a propósito. Depende de: T003. Resultado: SC-011.

## Phase 2 — Arranque del idioma

Va primero porque todo lo demás depende de que las traducciones estén cargadas antes del primer render.

- [ ] T005 Escribir las pruebas de `LanguageService` con la resolución movida a un método explícito: `localStorage` gana al navegador, el navegador gana al respaldo, y un idioma no soportado cae en `en`. Depende de: T004. Resultado: FR-008.
- [ ] T006 Verificar que fallan. Depende de: T005. Resultado: SC-011.
- [ ] T007 Mover la resolución de idioma del constructor de `LanguageService` a un método explícito, sin efectos en el constructor. Depende de: T006. Resultado: TD-005.
- [ ] T008 Escribir la prueba de que la elección del selector persiste en `localStorage`. Depende de: T007. Resultado: FR-008b.
- [ ] T009 Implementar esa persistencia. Depende de: T008. Resultado: FR-008b.
- [ ] T010 Quitar `lang: 'es'` de `provideTranslateService` en `app.config.ts`, conservando `fallbackLang: 'es'`. Depende de: T009. Resultado: TD-005.
- [ ] T011 Añadir el `provideAppInitializer` que resuelve el idioma y espera a que su traducción esté cargada, junto al que ya existe para el offset de scroll. Depende de: T010. Resultado: NFR-006, TD-004.
- [ ] T012 Escribir y verificar la prueba de que el arranque no completa hasta que las traducciones están disponibles. Depende de: T011. Resultado: NFR-006.
- [ ] T013 Ejecutar la suite completa. Depende de: T012. Resultado: efecto aislado.

## Phase 3 — Traducciones

- [ ] T014 Extraer los 121 `data-en` de la maqueta y emparejarlos con los 29 textos del inventario. Depende de: T013. Resultado: FR-005.
- [ ] T015 Listar los textos sin inglés documentado y confirmar que son los 6 que el spec anticipa. Depende de: T014. Resultado: verificación del spec.
- [ ] T016 Escribir el inglés de esos 6, aplicando TD-007. Depende de: T015. Resultado: FR-005, FR-006.
- [ ] T017 Revisar los emparejados de T014 uno por uno con la misma vara, en vez de copiarlos. Depende de: T016. Resultado: FR-006, R-006.
- [ ] T018 Corregir el titular de clientes a presente. Depende de: T017. Resultado: FR-007.
- [ ] T019 Unificar la variante británica en todo `en.json`. Depende de: T018. Resultado: TD-007.
- [ ] T020 Leer `en.json` completo de corrido y corregir lo que suene traducido. Depende de: T019. Resultado: SC-009.

## Phase 4 — Mudanza de la copia, componente por componente

Un componente por tarea, y la suite entre medias, para que un fallo señale su causa sin ambigüedad. Cada tarea es: escribir la prueba del texto renderizado según TD-008, verificar que falla, mover el texto a las claves, conectar el pipe, y comprobar contra la referencia de T002.

- [ ] T021 `app.component` — "Saltar al contenido principal". Depende de: T020. Resultado: FR-001, FR-002, FR-004.
- [ ] T022 `menu.component` — "Agendar". Depende de: T021.
- [ ] T023 `banner.component` — los dos textos fantasma, las dos tarjetas y el "100%". El titular y el subtítulo pasan a leer sus claves conservando la partición `titleLead` / `titleHighlight` de TD-001. Depende de: T022.
- [ ] T024 `our-clients.component` — el titular. Depende de: T023.
- [ ] T025 `home-services.component` — el titular, con `[innerHTML]` según TD-001. Depende de: T024.
- [ ] T026 `home-challenges.component` — titular con `[innerHTML]`, bajada y botón. Depende de: T025.
- [ ] T027 `success-stories.component` — titular con `[innerHTML]` y "Ver caso". Depende de: T026.
- [ ] T028 `ai-solution.component` — titular con `[innerHTML]`, bajada y botón. Depende de: T027.
- [ ] T029 `why.component` — titular con `[innerHTML]` y botón. Depende de: T028.
- [ ] T030 `team-coverage.component` — titular con `[innerHTML]`, bajada y botón. Depende de: T029.
- [ ] T031 `home-cta.component` — el titular pasa a leer `contact.title` y el teléfono a leer `content.phone.value`, según FR-012 y FR-013. Depende de: T030. Resultado: FR-012, FR-013.
- [ ] T032 `home-products.component` — titular y bajada. Depende de: T031.
- [ ] T033 `footer.component` — los cuatro textos de cabecera de columna y el aviso de derechos. Depende de: T032.
- [ ] T034 Buscar texto en español en `src/app/**/*.html` y confirmar que no queda ninguno. Depende de: T033. Resultado: FR-002, SC-002.
- [ ] T035 Recorrer el inventario completo del spec contra la referencia de T002, texto por texto. Depende de: T034. Resultado: SC-001.

## Phase 5 — Selector de idioma

- [ ] T036 Escribir las pruebas del selector: alterna el idioma, marca el activo con `aria-checked`, es operable por teclado y persiste la elección. Depende de: T035. Resultado: FR-009 a FR-011, SC-007.
- [ ] T037 Verificar que fallan. Depende de: T036. Resultado: SC-011.
- [ ] T038 Añadir el `radiogroup` de dos botones al final de la barra, según TD-006. Depende de: T037. Resultado: FR-009, FR-011.
- [ ] T039 Colocarlo dentro del panel desplegable en el menú compacto. Depende de: T038. Resultado: TD-006, R-004.
- [ ] T040 Estilarlo con las variables de color que el menú ya usa, sin introducir ninguna nueva. Depende de: T039. Resultado: NFR-005.
- [ ] T041 Comprobar el menú a 390, 768, 1024 y 1440 px, y confirmar que ningún elemento existente se movió. Depende de: T040. Resultado: NFR-005, SC-008.

## Phase 6 — Verificación final

- [ ] T042 Recorrer el Home en español y compararlo con `7f34842`. Depende de: T041. Resultado: SC-001.
- [ ] T043 Recorrer el Home en inglés y confirmar que no hay claves crudas, huecos ni texto en español. Depende de: T042. Resultado: SC-005.
- [ ] T044 Recorrer el Home con el navegador en español y confirmar que sale en español. Depende de: T043. Resultado: SC-006.
- [ ] T045 Ejecutar `npm run test:ci`, `lint`, `format:check` y `build`, y comparar con la línea base de T001. Depende de: T044. Resultado: NFR-001 a NFR-004, SC-010.
- [ ] T046 Anotar en el spec el conteo final de pruebas. Depende de: T045.

## Fuera de estas tareas, anotado para después

- La ruta `/about` sirve `<p>about works!</p>` en producción.
- Las 17 claves heredadas de `es.json` solo las usa `/service`, a la que no enlaza nadie.
- `docs/appland-home-reference.dc.html` seguirá pudiendo divergir del sitio. Este spec quita la copia de las plantillas, pero no ata la maqueta a las traducciones.
