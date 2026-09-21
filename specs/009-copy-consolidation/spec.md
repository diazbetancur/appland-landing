# Feature Specification: Consolidación de la copia del Home en los archivos de traducción

**Feature Branch**: `009-copy-consolidation`

**Created**: 2026-09-21

**Status**: Implementado el 2026-09-21. 187 pruebas. Ver el resultado en `tasks.md`.

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
| Textos visibles dentro de `home-content.config.ts` | 126 |
| De esos, nombres propios que no se traducen | ~16 (Toyota, Dilo, Ficohsa, Avianca, Tigo…) |
| **Total que necesita inglés** | **~139** |
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
| `LanguageService`, con la cadena `localStorage` → navegador → `en` | `language.service.ts:19-27`. **Nadie lo inyecta: es código muerto** |
| Cambio de idioma en caliente | `language.service.ts:29-31`, sin usar |
| Idioma fijado a `es` al arrancar | `app.config.ts:49-52`, `provideTranslateService({ fallbackLang: 'es', lang: 'es' })` |
| Contenido estructurado con estado de aprobación | `home-content.config.ts` |

`home-content.config.ts` no desaparece, pero cambia de papel. Sigue declarando **qué existe** — qué servicios, qué casos están aprobados, qué países, con qué imágenes y a qué destinos apuntan — y deja de contener **el texto**. Sus campos de copia pasan a guardar la clave de traducción en vez de la frase.

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
| 4 | Idioma por defecto | El del navegador. **Requiere activar `LanguageService`, que hoy no se ejecuta** |
| 5 | Selector de idioma | Sí, visible, al final del menú o de la barra, sin alterar la estética actual |
| 6 | Traducciones faltantes | Las escribe la implementación, con calidad profesional |
| 7 | "Companies that have trusted us" | Se corrige al tiempo verbal presente |
| 8 | Rutas `/service` y `/about` | **Fuera.** Ver justificación abajo |

### Por qué `/service` y `/about` quedan fuera

El criterio del usuario fue incluirlas solo si son parte del sitio actual. No lo son:

- Ninguna plantilla enlaza a `/service` ni a `/about`. Solo se llega escribiendo la URL a mano.
- `/about` renderiza `<p>about works!</p>`, el placeholder del scaffold de Angular.
- `/service` es la pantalla del diseño anterior al rediseño del Home.

Queda anotado aparte, sin arreglar en este spec: **la ruta `/about` está publicada y sirve texto de andamiaje**. Es un defecto propio, no una consolidación de copia.

### El idioma hoy, y lo que implica la decisión 4

Esto no funciona como parecía. Verificado en el código:

- `app.config.ts` arranca ngx-translate con `lang: 'es'` y `fallbackLang: 'es'`.
- `LanguageService` sí implementa la cadena `localStorage` → navegador → `en`, pero **ningún componente lo inyecta**. Su propio archivo de pruebas lo deja anotado: "al 2026-08-31 ningún componente inyecta LanguageService". Nunca se ejecuta.

O sea que hoy **el sitio es español para todos, siempre**, sin importar el navegador.

Por lo tanto la decisión 4 no es conservar el comportamiento actual: es **activarlo**. Hay que conectar `LanguageService` al arranque, o mover su lógica a `app.config.ts`. Y la consecuencia sigue siendo la misma: un visitante con el navegador en inglés pasará a ver el Home en inglés. Es el comportamiento pedido, y el selector de la decisión 5 es la salida para quien caiga en el idioma que no quiere.

Queda una esquina que la decisión 4 no cubre: qué ve alguien cuyo navegador no está ni en español ni en inglés. Hoy `LanguageService` cae en `en`. Este spec mantiene esa caída, por ser lo que el código ya dice. Si se prefiere español, es un cambio de una línea.

## In Scope

- Mover los 29 textos de interfaz del Home desde las plantillas a `es.json`.
- Mover los ~110 textos traducibles de `home-content.config.ts` a `es.json`, dejando en el config la clave en lugar de la frase.
- Conservar sin traducir los nombres propios: clientes, proyectos y marcas.
- Poblar `en.json` con las traducciones que la maqueta ya documenta en `data-en`.
- Conectar los 13 componentes a ngx-translate.
- Una prueba por componente que fije el texto renderizado, de modo que un desfase entre la copia aprobada y lo publicado falle en CI.
- Quitar las dos duplicaciones de `home-cta.component.html`: el teléfono pasa a leer `content.phone.value` y el titular a leer `contact.title`.
- Escribir las traducciones al inglés que faltan, con calidad profesional, no literal.
- Corregir "Companies that have trusted us" al tiempo verbal presente.
- Añadir un selector de idioma visible al final del menú o de la barra, sin alterar la estética actual.

## Out of Scope

- Cambiar cualquier texto en español. El sitio en español queda idéntico, carácter por carácter.
- Cambiar estilos, maquetación o lógica de componentes, con una sola excepción: el selector de idioma, que es markup y estilo nuevos. Ningún otro elemento existente cambia de aspecto ni de posición.
- Las rutas `/service` y `/about`, por la justificación de arriba.
- Los puntos de la auditoría UX/UI. Este spec no arregla ninguno; solo evita que sus arreglos se pierdan.

## Requirements

### Functional Requirements

- **FR-001**: Los 29 textos de interfaz del inventario deben residir en `es.json`, cada uno bajo una clave propia.
- **FR-001b**: Los textos traducibles de `home-content.config.ts` deben residir en `es.json`. El config guarda la clave, no la frase.
- **FR-001c**: Los nombres propios de clientes, proyectos y marcas se mantienen tal cual, sin clave de traducción.
- **FR-001d**: Los textos alternativos de las imágenes son contenido visible para quien usa lector de pantalla, así que también se traducen.
- **FR-002**: Ni las plantillas del Home ni `home-content.config.ts` deben contener frases en español, salvo los nombres propios de FR-001c.
- **FR-003**: Cada clave de `es.json` debe tener su equivalente en `en.json`, y viceversa. Los dos archivos deben tener exactamente el mismo conjunto de claves.
- **FR-004**: El texto renderizado en español debe ser idéntico, carácter por carácter, al de `7f34842`.
- **FR-005**: Las traducciones al inglés deben partir de los `data-en` de la maqueta cuando existan, y escribirse cuando no.
- **FR-006**: El inglés debe leerse como escrito por una persona, no traducido de forma literal. Los términos del sector se mantienen en su forma inglesa habitual (Staff Augmentation, AI agents), no se calcan del español.
- **FR-007**: El titular de clientes en inglés debe ir en presente, no en "have trusted us".
- **FR-008**: El idioma inicial debe resolverse por `localStorage`, luego el idioma del navegador si es `es` o `en`, y si no, `en`. Hoy esa cadena existe pero no se ejecuta: hay que conectarla.
- **FR-008b**: La elección hecha en el selector debe persistir en `localStorage` y respetarse en la siguiente visita.
- **FR-009**: Debe existir un selector de idioma visible, al final del menú o de la barra.
- **FR-010**: El selector debe cambiar el idioma sin recargar la página y debe ser operable por teclado.
- **FR-011**: El selector debe indicar cuál es el idioma activo.
- **FR-012**: El teléfono de `home-cta.component.html` debe leerse de `content.phone.value`, no escribirse a mano.
- **FR-013**: El titular de `home-cta.component.html` debe leerse de `contact.title`, no escribirse a mano.

### Non-Functional Requirements

- **NFR-001**: Las 152 pruebas actuales deben seguir pasando; el total no debe bajar de 152. Quedo en 187.
- **NFR-002**: `npm run lint` debe terminar en 0.
- **NFR-003**: `npm run format:check` debe terminar en 0.
- **NFR-004**: `npm run build` debe terminar en 0.
- **NFR-005**: Ningún elemento existente debe cambiar de aspecto, tamaño ni posición a ningún ancho. La única incorporación visual permitida es el selector.
- **NFR-006**: La carga de traducciones no debe introducir un parpadeo de texto sin traducir en el primer render.

## Success Criteria

- **SC-001**: El Home en español se ve idéntico al de `7f34842`, verificado texto por texto contra el inventario.
- **SC-002**: Una búsqueda de frases en español dentro de `src/app/**/*.html` y de `home-content.config.ts` solo devuelve nombres propios.
- **SC-003**: Una prueba compara los conjuntos de claves de `es.json` y `en.json` y falla si difieren.
- **SC-004**: Cada componente tocado tiene al menos una prueba que falla si su texto cambia sin actualizar el archivo de traducción.
- **SC-005**: Con el navegador en inglés, el Home se ve en inglés **de principio a fin**: titulares, servicios, desafíos, proyectos, beneficios, botones y textos alternativos. Sin claves crudas, sin huecos y sin frases en español.
- **SC-006**: Con el navegador en español, el Home se ve en español.
- **SC-007**: El selector es alcanzable con Tab, se opera con Enter o Espacio y anuncia el idioma activo.
- **SC-008**: El selector no altera la maquetación del menú a 390, 768, 1024 ni 1440 px.
- **SC-009**: El inglés se lee natural. Verificado leyendo cada cadena completa, no palabra por palabra.
- **SC-010**: `npm run test:ci`, `lint`, `format:check` y `build` terminan en 0.
- **SC-011**: Cada prueba nueva se demuestra capaz de fallar antes de implementar lo que cubre.

## Corrección de alcance del 2026-09-21

La primera versión de este spec dejaba `home-content.config.ts` fuera, con el argumento de que su contenido "ya está centralizado". Estar centralizado y estar traducido son cosas distintas: ese archivo tiene 126 textos visibles, entre ellos los nombres y resúmenes de los cinco servicios, los cinco desafíos, las nueve aplicaciones de IA, los siete beneficios y el título del hero.

Con el alcance original, el Home en inglés habría salido en español en cerca de un 80%, con el selector de idioma encendido mostrándolo. El usuario aprobó el alcance completo.

## Risks

- **R-001**: Un texto se pierde o se altera durante la mudanza. Mitigación: el inventario de este spec es la lista de verificación, y SC-001 la recorre entera.
- **R-002**: Las claves quedan desparejas entre los dos archivos y el Home en inglés sale con huecos. Mitigación: FR-003 y la prueba de SC-003.
- **R-003**: Un visitante con navegador en inglés pasa a ver el Home en inglés, cosa que hoy no ocurre porque el idioma está fijado a `es` en `app.config.ts`. Es el comportamiento pedido en la decisión 4, no un efecto colateral. Mitigación de su lado incómodo: el selector de FR-009.
- **R-004**: El selector desacomoda el menú en algún ancho. Mitigación: NFR-005 y SC-008, que fijan los cuatro anchos de comprobación.
- **R-005**: Las traducciones cargan por HTTP, así que puede verse la clave cruda antes de que lleguen. Recogido en NFR-006.
- **R-007**: Renombrar los campos de copia del config rompe en compilación cada plantilla, componente y prueba que los lee. Es mucho diff a la vez. Mitigación: el compilador de TypeScript y las 152 pruebas señalan cada punto; se hace por tandas con la suite entre medias.
- **R-008**: Un nombre propio traducido por error cambiaría el nombre de un cliente. Mitigación: FR-001c los deja fuera de forma explícita y la revisión final los recorre uno por uno.
- **R-006**: El inglés de la maqueta es de un diseñador, no de un traductor, y puede tener sus propios problemas. Mitigación: FR-006 y SC-009 lo someten a la misma vara que el texto nuevo, en vez de copiarlo a ciegas.
