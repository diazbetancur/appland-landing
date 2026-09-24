# Implementation Plan: Consolidación de la copia del Home en los archivos de traducción

**Spec**: [spec.md](./spec.md)

**Branch**: `009-copy-consolidation`

**Created**: 2026-09-21

## Summary

Mover ~139 textos a `es.json` y `en.json`: los 29 escritos en las plantillas y los ~110 traducibles de `home-content.config.ts`. Conectar los componentes a ngx-translate, activar la resolución de idioma que hoy existe pero no se ejecuta, y añadir un selector visible. El español queda idéntico carácter por carácter; el inglés pasa a existir completo.

## Technical Context

| Dato | Valor |
|---|---|
| Framework | Angular 21, componentes standalone |
| i18n | `@ngx-translate/core` 18 con `provideTranslateHttpLoader` |
| Archivos de traducción | `src/assets/i18n/es.json`, `src/assets/i18n/en.json`, 17 claves cada uno |
| Idioma al arrancar | Fijado a `es` en `app.config.ts:49-52` |
| `LanguageService` | Implementado y **no inyectado por nadie** |
| Pruebas | Vitest con navegador Playwright, 152 en total |
| Inglés disponible | 121 cadenas en los `data-en` de `docs/appland-home-reference.dc.html` |

## Decisions

### TD-001: Los titulares con palabra resaltada se guardan con su marcado, y se pintan con `[innerHTML]`

Siete titulares llevan una palabra resaltada en mitad de la frase:

```html
Soluciones tecnológicas que impulsan el <span class="services__highlight">crecimiento</span> de tu empresa
```

La salida fácil es partirlos en tres claves — antes, resaltado, después — que es lo que el hero ya hace con `titleLead` y `titleHighlight`. **En inglés se rompe.** La traducción de esa frase es "Technology solutions that drive your company's growth": la palabra resaltada se va al final y el fragmento "después" queda vacío. Un reparto fijo de fragmentos impone el orden de palabras del español a todos los idiomas.

Decisión: la clave guarda la frase completa **con su `<span>` dentro**, y la plantilla la pinta con `[innerHTML]`. Cada idioma coloca el resaltado donde su gramática lo pida.

```json
"home.services.title": "Soluciones tecnológicas que impulsan el <span class=\"services__highlight\">crecimiento</span> de tu empresa"
```

El sanitizador de Angular procesa ese HTML y permite `span` con `class`, que es todo lo que se necesita. El contenido es nuestro y no viene de ningún visitante, así que no hay superficie de inyección.

**El hero es la excepción.** Ya resolvió esto con dos campos en `home-content.config.ts`, y el commit `0472509` documenta por qué: el resaltado se apagaba en silencio cuando la copia cambiaba. No se toca. Sus dos campos pasan a leerse de las traducciones, conservando la partición que ya tiene.

### TD-002: Claves jerárquicas por sección, sin tocar las 17 existentes

Las 17 claves actuales son planas y en camelCase (`ourService`, `whyAppland`). Las usa la ruta `/service`, que queda fuera del alcance.

Las nuevas van anidadas por sección: `home.hero.*`, `home.services.*`, `home.clients.*`, `menu.*`, `footer.*`. Así no colisionan con las viejas, se ve de un vistazo a qué sección pertenece cada texto, y el día que se limpien las 17 heredadas se sabe cuáles son.

### TD-003: El pipe `translate` en la plantilla, no el servicio en el TypeScript

`{{ 'home.services.title' | translate }}` y no una propiedad resuelta en la clase. El pipe se resuscribe solo al cambiar de idioma, que es el requisito FR-010. Resolver en el TypeScript obligaría a cada componente a suscribirse a `onLangChange` a mano.

Para los titulares de TD-001: `<h2 [innerHTML]="'home.services.title' | translate"></h2>`.

### TD-004: Las traducciones se precargan antes del primer render

NFR-006 pide que no se vea la clave cruda. `provideTranslateHttpLoader` las trae por HTTP después de arrancar, así que hay una ventana en la que el texto no está.

Se resuelve con `provideAppInitializer`, que ya se usa en `app.config.ts` para el offset de scroll: el arranque espera a que la traducción del idioma elegido esté cargada. El patrón ya existe en el archivo, no se inventa nada.

### TD-005: `LanguageService` se conecta en el inicializador, y se le quita el trabajo al constructor

Hoy `LanguageService` hace su trabajo en el constructor, lo que obliga a que alguien lo inyecte para que ocurra algo. Esa es exactamente la razón de que nunca se haya ejecutado.

Se mueve la resolución a un método explícito que llama el inicializador de TD-004. El constructor deja de tener efectos. Así el arranque es una secuencia legible — resolver idioma, cargar sus traducciones, renderizar — en vez de un efecto colateral de una inyección.

`app.config.ts` deja de fijar `lang: 'es'`, porque ese literal es justo lo que anula la decisión 4. El `fallbackLang` se mantiene en `es`.

### TD-006: El selector, dos botones en un `radiogroup`, al final de la barra

Dos botones ES / EN, no un desplegable: son dos opciones y un desplegable pide dos clics para lo que se resuelve en uno. Van al final de la barra de menú, después del botón de conversión, que es donde el usuario los pidió.

- `role="radiogroup"` con `aria-label`, y `aria-checked` en el activo, para que se anuncie cuál está puesto.
- Hereda las variables de color del menú; no introduce colores nuevos.
- En el menú compacto va dentro del panel desplegable, donde ya hay sitio, para no competir con el botón de conversión en pantallas angostas.

### TD-007: El inglés se escribe leyendo la frase entera, no la cadena suelta

FR-006 y SC-009. Reglas concretas:

- Los `data-en` de la maqueta son el punto de partida, no la respuesta. Se revisan uno por uno.
- Los términos del sector se quedan en su forma inglesa habitual: Staff Augmentation, AI agents, staff, no sus calcos.
- Las preguntas retóricas del español no se traducen literales si en inglés suenan forzadas.
- El titular de clientes va en presente: "Companies that trust us", no "have trusted us" (FR-007).
- El inglés de la maqueta es británico ("specialised", "optimisation"). Se unifica a esa variante en todo el archivo, por coherencia con lo ya escrito.

### TD-008: Las pruebas cargan traducciones reales, no un doble vacío

Cada prueba de componente registra las claves de ese componente en el `TestBed` con sus valores reales de `es.json`, y comprueba el texto renderizado. Una prueba contra un doble que devuelve la clave verificaría que el pipe está puesto, no que la copia es la correcta, y este spec existe precisamente porque nadie verificaba la copia.

Se añade además una prueba de archivo que compara los conjuntos de claves de `es.json` y `en.json` (SC-003).

### TD-009: El config guarda claves, y sus campos de copia se renombran con sufijo `Key`

`home-content.config.ts` pasa de contener frases a contener claves. La pregunta es si el campo sigue llamándose igual.

```ts
// Antes
{ id: 'software', name: 'Desarrollo de Software', summary: 'Tecnología a la medida…' }

// Opción descartada: mismo nombre, contenido distinto
{ id: 'software', name: 'home.services.software.name' }

// Decidido
{ id: 'software', nameKey: 'home.services.software.name', summaryKey: 'home.services.software.summary' }
```

Dejar el campo llamándose `name` conteniendo una clave hace que el modelo mienta sobre lo que guarda, y este archivo es el contrato del contenido: quien lo lea dentro de seis meses tiene que poder saber qué hay dentro sin abrir el JSON. El sufijo `Key` lo dice.

El coste es un diff grande de golpe: cada plantilla, componente y prueba que lee esos campos deja de compilar. Es también la mitigación, porque el compilador señala todos los puntos y no queda ninguno al azar. Se hace por tandas, con la suite entre medias (R-007).

Los campos afectados, por modelo: `ConversionAction.label`, `NavigationItem.label`, `FragmentLink.label`, `LabeledDestination.label`, `ServiceHighlight.label`, `AiApplication.label` y `.description`, `Service.name` y `.summary`, `Challenge.problem` y `.response`, `Benefit.statement` y `.description`, `CaseStudy.summary` y `.description`, `Product.summary`, `CountryPresence.name`, `ContactContent.title` y `.body`, `HeroContent.titleLead`, `.titleHighlight` y `.subtitle`, `FooterContent.brandSummary`, `ApprovedAsset.alt` y `ConversionAction.approvedMessage`.

### TD-010: Los nombres propios no llevan clave

`Client.name`, `CaseStudy.name` y `Product.name` guardan nombres de empresa y de producto: Toyota, Dilo, Ficohsa, Espresso Americano. Se quedan como texto literal, sin clave (FR-001c). Traducirlos sería cambiarle el nombre a un cliente.

`CountryPresence.name` sí lleva clave: "México" es "Mexico" y "Perú" es "Peru" en inglés.

Los nombres de producto del catálogo pendiente ("Restaurantes", "Clínicas") sí llevan clave: son categorías, no marcas.

### TD-011: El texto alternativo de las imágenes también se traduce

`ApprovedAsset.alt` es lo único que recibe quien navega con lector de pantalla. Dejarlo en español en la versión inglesa sería dejar esa parte del sitio sin traducir para justo esas personas. Lleva clave (FR-001d).

Las imágenes decorativas tienen `alt` vacío y `decorative: true`. Esas no llevan clave: no hay nada que traducir.

## Verification

| Qué | Cómo |
|---|---|
| NFR-001 | `npm run test:ci`, comparado contra la línea base de 152 |
| NFR-002 | `npm run lint` |
| NFR-003 | `npm run format:check` |
| NFR-004 | `npm run build` |
| SC-001 | Recorrido del inventario del spec, texto por texto, contra `7f34842` |
| SC-002 | Búsqueda de texto en español dentro de `src/app/**/*.html` |
| SC-005, SC-006 | El sitio levantado, con el navegador en cada idioma |
| SC-008 | El menú a 390, 768, 1024 y 1440 px |
| SC-009 | Lectura completa de `en.json` de corrido |

## Risks and Mitigations

- **R-001** (un texto se pierde): el inventario del spec es la lista de verificación. Se recorre entera al final, no por muestreo.
- **R-002** (claves desparejas): la prueba de TD-008 lo convierte en un fallo de CI.
- **R-003** (cambia el idioma que ve un visitante): es lo pedido. El selector de TD-006 y la persistencia de FR-008b son la salida.
- **R-004** (el selector desacomoda el menú): TD-006 lo mete en el panel desplegable en anchos angostos, que es donde el riesgo está. SC-008 lo comprueba a cuatro anchos.
- **R-005** (parpadeo de claves crudas): TD-004.
- **R-006** (el inglés de la maqueta arrastra sus propios problemas): TD-007 lo somete a revisión en vez de copiarlo.
- **R-007** (nuevo): `[innerHTML]` de TD-001 desactiva la interpolación de Angular en ese nodo. Si alguna clave necesitara un valor dinámico dentro, habría que resolverlo con parámetros del pipe. Ninguno de los siete titulares lo necesita hoy; queda anotado por si se añade uno.
