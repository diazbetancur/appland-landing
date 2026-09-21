# Feature Specification: Consolidación de la copia del Home en los archivos de traducción

**Feature Branch**: `009-copy-consolidation`

**Created**: 2026-09-21

**Status**: Awaiting review

**Input**: Decisión del usuario durante la ronda 3, a raíz de la auditoría UX/UI de septiembre 2026 y del bug del titular de clientes: consolidar la copia suelta del Home en los archivos `es.json` / `en.json`.

## Scope

### Business Goal

Que una corrección de copia aprobada llegue al sitio **una sola vez y en un solo lugar**, en vez de tener que aplicarse por separado en la maqueta de referencia y en cada plantilla.

El objetivo no es visual. El sitio en español debe quedar **idéntico** al terminar.

### El bug que origina este spec

El commit `925fa29` ("correct phrasing in client trust statement") corrigió el titular de la sección de clientes de "Empresas que han confiado en nosotros" a "Empresas que confían en nosotros". Lo aplicó solo a `docs/appland-home-reference.dc.html`. El componente que se publica quedó con el texto viejo durante siete días, hasta que lo arregló `9b83a64`.

No fue un descuido aislado: es la forma que toma esta clase de error. El titular está escrito directamente en la plantilla, no pasa por ningún archivo de contenido, y ninguna prueba lo cubría. Nada podía detectar el desfase.

### Measured Starting Point

Medido sobre `origin/develop` en el commit `7f34842`, antes de escribir este spec.

| Medida | Valor |
|---|---|
| Textos escritos directo en plantillas del Home | 29, en 13 componentes |
| Textos que sí pasan por `home-content.config.ts` | La mayoría del contenido de datos (servicios, casos, desafíos, países, beneficios) |
| Claves en `es.json` / `en.json` | 17, idénticas en ambos |
| Componentes del Home que consumen esas claves | **0** |
| Componentes que sí las consumen | `service`, `card-template` (ruta `/service`, anterior al rediseño) |
| Textos con traducción al inglés en la maqueta (`data-en`) | 121 únicos |
| Selector de idioma en la interfaz | **Ninguno** |
| Pruebas totales del proyecto | 152 |

### Inventario de la copia suelta

| Componente | Textos |
|---|---|
| `banner` | "TU VISIÓN", "NUESTRA TECNOLOGÍA", "Soluciones a la medida", "100%", "enfocadas en tu negocio" |
| `home-services` | Titular de la sección |
| `home-challenges` | Titular, bajada, "Hablemos de tu proyecto" |
| `success-stories` | Titular, "Ver caso" |
| `ai-solution` | Titular, bajada, "Descubre cómo la IA puede ayudarte" |
| `why` | Titular, "Conversemos sobre tu proyecto" |
| `team-coverage` | Titular, bajada, "Conoce nuestro equipo" |
| `home-cta` | Titular |
| `our-clients` | Titular |
| `home-products` | Titular, bajada |
| `footer` | "Navegación", "Servicios", "Contacto", "Todos los derechos reservados" |
| `menu` | "Agendar" (versión corta del botón en pantallas chicas) |
| `app` | "Saltar al contenido principal" |

Dos casos aparte, del mismo patrón pero sobre datos que **ya están centralizados** y que la plantilla ignora:

- `home-cta.component.html` repite el teléfono `+504 3334-9211` a mano aunque `content.phone.value` ya lo tiene.
- `home-cta.component.html` escribe el titular "¿Listo para transformar tu negocio?" a mano aunque `contact.title` lo define con ese mismo texto. El campo existe y nadie lo lee.

### Lo que ya existe y hay que respetar

| Capacidad actual | Dónde |
|---|---|
| `@ngx-translate/core` y `@ngx-translate/http-loader` como dependencias | `package.json` |
| Carga de traducciones por HTTP | `app.config.ts` |
| Selección de idioma por `localStorage`, luego navegador, luego `'en'` | `language.service.ts:19-27` |
| Cambio de idioma en caliente | `language.service.ts:29-31` |
| Contenido estructurado con estado de aprobación | `home-content.config.ts` |

`home-content.config.ts` no desaparece. Sigue siendo el dueño de los **datos** (qué servicios existen, qué casos están aprobados, qué países). Este spec mueve los **textos de interfaz**, que hoy no están en ningún lado.

### El hallazgo que condiciona el alcance

La maqueta de referencia trae la traducción al inglés de 121 textos en atributos `data-en`, así que la mayor parte del inglés ya está escrita y aprobada. Pero la maqueta quedó vieja respecto de las rondas 2 y 3.

**Textos actuales sin inglés documentado:**

| Texto en español | Origen |
|---|---|
| "Impulsamos tu negocio con tecnología inteligente." | Ronda 2, `0472509` |
| "Desarrollo de software, Inteligencia Artificial, SaaS Automatización y Staff Augmentation para empresas que buscan crecer mejor y más rápido." | Ronda 2, `0472509` |
| "Nuestros servicios" | Ronda 2, `0472509` |
| "Argentina" (la maqueta dice Estados Unidos) | Ronda 3, `de44086` |
| Proyecto "Go" | No está en la maqueta |
| Proyecto "TV Azteca Honduras" | No está en la maqueta |

**Y una corrección pendiente en el inglés:** el `data-en` del titular de clientes dice "Companies that have trusted us", el mismo tiempo verbal que se corrigió en español. El inglés arrastra el error.

### Decisiones tomadas por el usuario

| # | Decisión | Valor |
|---|---|---|
| 1 | Destino de la copia | Archivos i18n `es.json` / `en.json` |
| 2 | Alcance de la ronda previa | Solo copy y datos, sin CSS ni lógica |
| 3 | Restricción permanente | Los cambios no deben alterar la vista actual |

### Decisiones pendientes

Ninguna de estas la resuelve la implementación. Bloquean partes del alcance.

| # | Pregunta | Por qué bloquea |
|---|---|---|
| 1 | ¿Cuál es el idioma por defecto del Home? | `LanguageService` usa el idioma del navegador y cae en `'en'`. Hoy el Home es español fijo, así que un visitante con navegador en inglés ve español. Al conectar i18n pasaría a ver inglés. **Es un cambio de comportamiento del sitio actual.** |
| 2 | ¿Se agrega un selector de idioma visible? | Hoy no existe ninguno. Sin él, quien caiga en el idioma equivocado no tiene cómo cambiarlo. |
| 3 | ¿Quién escribe los 6 textos en inglés que faltan? | Sin ellos, esas claves quedan sin traducir y el Home en inglés sale incompleto. |
| 4 | ¿Se corrige "Companies that have trusted us"? | Es copy nuevo, no una consolidación. |
| 5 | ¿Entran las rutas `/service` y `/about`? | Ya usan ngx-translate con las 17 claves viejas. Quedan fuera salvo indicación contraria. |

## In Scope

- Mover los 29 textos de interfaz del Home desde las plantillas a `es.json`.
- Poblar `en.json` con las traducciones que la maqueta ya documenta en `data-en`.
- Conectar los 13 componentes a ngx-translate.
- Una prueba por componente que fije el texto renderizado, de modo que un desfase entre la copia aprobada y lo publicado falle en CI.
- Quitar las dos duplicaciones de `home-cta.component.html`: el teléfono pasa a leer `content.phone.value` y el titular a leer `contact.title`.

## Out of Scope

- Cambiar cualquier texto en español. El sitio en español queda idéntico, carácter por carácter.
- Cambiar estilos, maquetación o lógica de componentes.
- Los textos que viven en `home-content.config.ts`, que ya están centralizados.
- Las rutas `/service` y `/about`, salvo que la decisión 5 diga lo contrario.
- Los puntos de la auditoría UX/UI. Este spec no arregla ninguno; solo evita que sus arreglos se pierdan.

## Acceptance Criteria

1. El Home en español se ve **idéntico** a `7f34842`. Verificado texto por texto contra el inventario.
2. Ninguna plantilla del Home contiene texto en español escrito a mano.
3. `es.json` y `en.json` tienen exactamente el mismo conjunto de claves.
4. Cada componente tocado tiene al menos una prueba que falla si su texto cambia sin actualizar el archivo de traducción.
5. Las 152 pruebas existentes siguen pasando.
6. Lint y formato limpios.
7. El idioma por defecto se comporta según la decisión 1, con una prueba que lo fija.

## Risks

| Riesgo | Mitigación |
|---|---|
| Cambiar el idioma que ve un visitante actual | Decisión 1 antes de implementar. Prueba que fija el comportamiento. |
| Un texto se pierde o se altera en la mudanza | El inventario de este spec es la lista de verificación. Una prueba por texto. |
| Claves desparejas entre `es.json` y `en.json` | Prueba que compara los conjuntos de claves. |
| El Home en inglés sale incompleto | Decisión 3. Si no hay traducción, la clave no se mueve. |
