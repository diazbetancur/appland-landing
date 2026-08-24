# Feature Specification: APPLAND Home Redesign

**Feature Branch**: `001-appland-home-redesign`

**Created**: 2026-08-04

**Status**: Ready for Implementation

**Input**: User description: "Especificar la nueva Home de APPLAND para comunicar su oferta, generar confianza y convertir visitantes empresariales mediante una reunión o una conversación por WhatsApp."

## Scope

### Business Goal

La nueva Home debe permitir que responsables de empresas entiendan rápidamente qué hace APPLAND, qué problemas resuelve, qué servicios ofrece, qué experiencia respalda su propuesta y cómo iniciar una conversación comercial.

Las dos acciones de conversión son:

1. Agendar una reunión.
2. Escribir por WhatsApp.

### Source Authority

Las fuentes se interpretan con esta prioridad:

1. El brief PDF define el contenido oficial y el orden de las secciones.
2. La referencia visual ejecutable define la apariencia, jerarquía visual y comportamiento esperado.
3. El proyecto existente aporta restricciones técnicas que serán analizadas durante la planificación, no en esta especificación.
4. El runtime de la referencia sirve únicamente para visualizarla y queda fuera del producto.

No se requieren capturas adicionales para especificar ni validar esta feature.

### In Scope

- Header global con navegación y acción principal de conversión.
- Diez secciones principales en el orden definido por el brief.
- Footer global con información y destinos aprobados.
- Contenido visible únicamente en español.
- Navegación dentro de la Home.
- Presentación y selección de servicios.
- Recorrido manual de casos y productos aprobados.
- Presentación con movimiento pausable de clientes aprobados.
- Comportamiento adaptable a desktop, tablet y móvil.
- Acceso mediante mouse, touch, teclado y tecnologías asistivas.
- Experiencia equivalente cuando el usuario solicita movimiento reducido.
- Reglas de ocultamiento y destinos alternativos para contenido empresarial pendiente.
- Validación estructural, funcional y visual contra la referencia aprobada.

### Out of Scope

- Página interna de Servicios.
- Página interna de Casos de éxito o detalle de caso.
- Página interna Nosotros.
- Página interna Contacto.
- FAQ y página 404.
- CMS, panel administrativo, backend, CRM o integración de calendario.
- Traducción al inglés o selector de idioma.
- Testimonios de clientes.
- Creación o recreación de logos y mockups empresariales.
- Redacción de afirmaciones empresariales no aprobadas.
- Páginas o contenido de privacidad y términos.
- Automatización de regresión visual pixel-perfect.
- Capturas adicionales como requisito o dependencia.
- Plan técnico o decisiones de implementación.

### Functional Order and Official Content

La experiencia contiene un header global, diez secciones principales y un footer global. El footer puede describirse como la región once, sin convertir esa numeración en una restricción adicional. Si una sección condicionada no tiene contenido aprobado, las demás conservan su orden relativo.

1. **Hero**
   - Propósito: explicar la propuesta de APPLAND y ofrecer una vía inmediata de conversión.
   - Título: “Transformamos procesos complejos en soluciones digitales inteligentes.”
   - Subtítulo: “Desarrollo de software, Inteligencia Artificial, Automatización y Staff Augmentation para empresas que buscan crecer más rápido.”
   - Acciones: “Agendar una reunión”, “Conocer nuestros servicios” y, cuando corresponda a la composición aprobada, “Escribir por WhatsApp”.

2. **Empresas que han confiado en nosotros**
   - Propósito: aportar confianza mediante relaciones empresariales verificables.
   - Empresas mencionadas por el brief: Ficohsa, Grupo Terra, Tigo, Pepsi, Toyota y Avianca.
   - Solo se muestran empresas con logo oficial disponible y publicación autorizada.

3. **¿Qué desafíos podemos ayudarte a resolver?**
   - Procesos manuales que consumen tiempo: “Automatizamos tareas repetitivas para aumentar productividad.”
   - Sistemas desconectados: “Integramos plataformas, ERPs, CRMs y APIs.”
   - Equipos tecnológicos saturados: “Incorporamos talento especializado rápidamente.”
   - Atención al cliente ineficiente: “Implementamos agentes de IA que operan 24/7.”
   - Necesidad de lanzar una plataforma: “Diseñamos y desarrollamos soluciones escalables.”

4. **Soluciones tecnológicas que impulsan el crecimiento de tu empresa**
   - Desarrollo de Software: “Apps móviles, plataformas web y sistemas empresariales.”
   - Inteligencia Artificial: “Agentes IA, automatización, asistentes de voz y chat.”
   - Staff Augmentation: “Desarrolladores, QA, UX/UI y equipos dedicados.”
   - Automatización de Procesos: “Optimización operativa mediante IA e integraciones.”
   - Consultoría Tecnológica: “Transformación digital y arquitectura tecnológica.”

5. **Algunos proyectos desarrollados**
   - Toyota: App móvil para clientes.
   - Dilo: Aplicación financiera.
   - Solo se muestran casos con mockup e información oficial aprobados; el resto permanece oculto hasta contar con ambos.

   > **Actualización de contenido aprobada (2026-08-21):** el Product Owner sustituyó la lista original del brief (Toyota, Avianca, Dilo, Telemedicine Platform, Espresso Americano) por el criterio "solo se publica el caso que tenga mockup aprobado"; el orden visible acordado es Toyota, Dilo, Tengo, TV Azteca. Toyota y Dilo ya cuentan con mockup y descripción aprobados. Tengo y TV Azteca tienen mockup aprobado pero están pendientes de descripción oficial y permanecen ocultos hasta recibirla. Avianca, Telemedicine Platform y Espresso Americano quedan pendientes de mockup y permanecen ocultos.

6. **Inteligencia Artificial aplicada a negocios**
   - Agentes conversacionales.
   - Recepción de clientes.
   - Call Center IA.
   - WhatsApp IA.
   - Generación de Leads.
   - Agendamiento de citas.
   - Soporte 24/7.
   - Automatización documental.
   - Análisis inteligente.

   > **Actualización de contenido aprobada (2026-08-24):** el Product Owner amplió la sección a nueve aplicaciones agregando "Análisis inteligente", y aprobó una descripción de una línea para cada una, además de un párrafo de apoyo y la acción "Descubre cómo la IA puede ayudarte". Este contenido proviene de la referencia visual entregada por el Product Owner, no del brief original.

7. **Plataformas listas para implementar**
   - Categorías candidatas del brief: Restaurantes, Clínicas, Hoteles, Gimnasios, Laboratorios, Programas de Lealtad y E-commerce.
   - Solo se muestran productos aprobados como disponibles.

8. **¿Por qué trabajar con APPLAND?**
   - Más de 13 años de experiencia.
   - Equipo bilingüe.
   - Presencia internacional.
   - Cobertura multizona horaria.
   - Experiencia en fintech, salud, retail y consumo masivo.
   - Metodologías ágiles.
   - Soluciones escalables.
   - El enlace “Nosotros” del header dirige a esta sección y no crea una sección adicional.

   > **Actualización de contenido aprobada (2026-08-24):** el Product Owner aprobó una descripción de una línea para cada uno de los siete atributos, un rótulo, un nuevo título (“Por qué empresas eligen trabajar con nosotros”), un párrafo de apoyo y la acción “Conversemos sobre tu proyecto”. La referencia visual entregada incluye además un carrusel de testimonios; los testimonios permanecen fuera de alcance por FR-025 y no se implementaron.

9. **Equipo distribuido internacionalmente**
   - Honduras: HQ & Desarrollo.
   - Estados Unidos: Business Development.
   - Colombia: Software Development.
   - Panamá: Operaciones.
   - Bangladesh: Engineering.
   - Guatemala: QA & Support.

   > **Actualización de contenido aprobada (2026-08-24):** el Product Owner aprobó el rol de cada país, un párrafo de apoyo y la acción "Conoce nuestro equipo", además de mostrar la bandera de cada país. Las banderas son archivos SVG locales de dominio público; la prohibición vigente es el hotlink a un servicio remoto de banderas, no la bandera en sí.

10. **¿Listo para transformar tu negocio?**
    - Texto: “Conversemos sobre tu proyecto y descubre cómo la tecnología, la automatización y la inteligencia artificial pueden ayudarte a crecer.”
    - Acciones: “Agendar reunión” y “Escribir por WhatsApp”.
    - Contacto: mario@applandtech.com y +504 3394-9211.
    - Redes: LinkedIn e Instagram cuando dispongan de URL aprobada.

11. **Footer global**
    - Identidad de APPLAND.
    - Navegación disponible.
    - Servicios y casos oficiales.
    - Datos de contacto y redes con destinos aprobados.
    - Copyright.
    - Los enlaces de privacidad y términos se omiten hasta contar con URL aprobada.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprender y contactar (Priority: P1)

Como responsable de una empresa, quiero comprender rápidamente la propuesta de APPLAND y disponer de acciones claras para agendar una reunión o escribir por WhatsApp, para iniciar una conversación comercial sin buscar información en otras páginas.

**Why this priority**: Es el objetivo principal de conversión y la mínima experiencia que entrega valor empresarial.

**Independent Test**: Se puede probar presentando únicamente el header, Hero y bloque final de contacto; el visitante debe identificar la oferta y comenzar una acción de contacto válida.

**Acceptance Scenarios**:

1. **Given** un visitante que abre la Home por primera vez, **When** observa el Hero, **Then** identifica qué ofrece APPLAND y encuentra una acción para agendar una reunión.
2. **Given** que existe una URL de agendamiento aprobada, **When** el visitante activa “Agendar una reunión”, **Then** llega a ese destino válido.
3. **Given** que no existe una URL de agendamiento aprobada, **When** el visitante activa “Agendar una reunión”, **Then** llega al bloque final de contacto de la Home.
4. **Given** una acción de WhatsApp visible, **When** el visitante la activa, **Then** inicia una conversación con el número oficial y utiliza el mensaje aprobado si está disponible.

---

### User Story 2 - Navegar y explorar soluciones (Priority: P1)

Como potencial cliente, quiero navegar directamente a los desafíos y servicios relevantes y consultar cada servicio, para determinar si APPLAND responde a mi necesidad.

**Why this priority**: Permite convertir la propuesta general en una oferta comprensible y relevante para el problema del visitante.

**Independent Test**: Se puede probar con el header, desafíos y servicios; cada enlace debe llegar a su destino y cada servicio debe poder seleccionarse y consultarse.

**Acceptance Scenarios**:

1. **Given** el header visible, **When** el visitante selecciona “Servicios” o recorre las regiones de la Home, **Then** llega a la sección con su título visible y el header refleja como activo únicamente el enlace asociado a la región actual mediante tratamiento visual y semántica accesible.
2. **Given** el header visible, **When** el visitante selecciona “Nosotros”, **Then** llega a “¿Por qué trabajar con APPLAND?” sin crear ni atravesar una sección Nosotros adicional.
3. **Given** la sección de servicios, **When** el visitante selecciona un servicio con mouse, touch o teclado, **Then** distingue la opción activa y consulta su contenido oficial asociado.
4. **Given** una navegación compacta abierta, **When** el visitante selecciona una sección o cierra el menú, **Then** conserva un contexto de navegación claro y puede continuar desde el control que inició la acción.

---

### User Story 3 - Validar confianza (Priority: P2)

Como responsable de contratación, quiero revisar clientes, proyectos y atributos verificables de APPLAND, para evaluar su experiencia antes de contactar.

**Why this priority**: Reduce la incertidumbre comercial mediante evidencia aprobada y evita depender de afirmaciones no verificadas.

**Independent Test**: Se puede probar con clientes, casos y “¿Por qué trabajar con APPLAND?”; solo deben aparecer datos oficiales y los casos deben poder recorrerse manualmente.

**Acceptance Scenarios**:

1. **Given** que existe al menos un logo oficial aprobado, **When** el visitante consulta la región de clientes, **Then** ve únicamente los logos disponibles y autorizados.
2. **Given** que no existe ningún logo oficial aprobado, **When** se carga la Home, **Then** la región de clientes se omite por completo sin título aislado, nombres sustitutivos, carrusel vacío, logos recreados, placeholders ni mensajes pendientes.
3. **Given** el movimiento de clientes, **When** el visitante lo pausa o solicita reducción de movimiento, **Then** todos los logos visibles siguen siendo comprensibles sin movimiento continuo.
4. **Given** la sección de casos, **When** el visitante utiliza sus controles, touch o teclado, **Then** puede recorrer manualmente todos los casos oficiales visibles.
5. **Given** un caso sin mockup o destino aprobado, **When** se presenta el caso, **Then** muestra solo su contenido oficial y no presenta un mockup falso ni la acción “Ver caso”.
6. **Given** la sección “¿Por qué trabajar con APPLAND?”, **When** el visitante la consulta, **Then** encuentra los siete atributos oficiales y ningún testimonio provisional.

---

### User Story 4 - Explorar IA y productos aprobados (Priority: P2)

Como empresa interesada en automatización o plataformas listas para implementar, quiero conocer las aplicaciones de IA y los productos realmente disponibles, para solicitar información relevante.

**Why this priority**: Presenta dos líneas de oferta con alto potencial comercial sin publicar productos o capacidades no aprobadas.

**Independent Test**: Se puede probar con las secciones de IA y productos; IA debe mostrar sus nueve aplicaciones y productos debe respetar las reglas de aprobación y visibilidad.

**Acceptance Scenarios**:

1. **Given** la sección de IA, **When** el visitante la consulta, **Then** encuentra las nueve aplicaciones oficiales y una acción de contacto relacionada.
2. **Given** que no existe ningún producto aprobado, **When** se carga la Home, **Then** no aparecen productos, tarjetas vacías ni mensajes de contenido pendiente.
3. **Given** que existe al menos un producto aprobado, **When** el visitante consulta productos, **Then** puede recorrer manualmente los productos disponibles y solicitar información.
4. **Given** un producto sin recurso visual aprobado, **When** se presenta su información, **Then** no aparece un mockup inventado ni una indicación de placeholder.

---

### User Story 5 - Confirmar cobertura internacional (Priority: P2)

Como cliente internacional, quiero conocer la distribución geográfica de APPLAND, para validar su presencia y capacidad de cobertura multizona.

**Why this priority**: Refuerza la capacidad operativa para clientes internacionales sin desplazar el objetivo principal de conversión.

**Independent Test**: Se puede probar mostrando la sección compacta de equipo global antes del CTA final; deben aparecer los seis países oficiales.

**Acceptance Scenarios**:

1. **Given** un visitante que llega al tramo final de la Home, **When** consulta el equipo global, **Then** encuentra Honduras, Estados Unidos, Colombia, Panamá, Bangladesh y Guatemala.
2. **Given** la sección de equipo global, **When** se presenta en cualquier ancho de validación, **Then** permanece compacta y no desplaza ni oculta el CTA final.

---

### User Story 6 - Acceder sin barreras (Priority: P1)

Como usuario de teclado, lector de pantalla, dispositivo móvil o preferencia de movimiento reducido, quiero acceder a todo el contenido y a las acciones principales, para completar las mismas tareas que cualquier otro visitante.

**Why this priority**: El acceso a la propuesta y a la conversión debe ser equivalente para todos los usuarios desde el primer lanzamiento.

**Independent Test**: Se puede probar recorriendo la Home completa sin mouse, con ampliación y movimiento reducido, verificando navegación, selección de servicios, recorridos y CTA.

**Acceptance Scenarios**:

1. **Given** un usuario que navega solo con teclado, **When** recorre la Home, **Then** alcanza y opera todos los controles en un orden comprensible y con foco visible.
2. **Given** un usuario con reducción de movimiento, **When** recorre la Home, **Then** no recibe movimiento automático ni apariciones no esenciales y conserva todo el contenido.
3. **Given** cualquiera de los anchos 1440, 1280, 1024, 768, 390 o 360 px, incluida la transición entre 559 y 560 px, **When** el usuario consulta o redimensiona la Home, **Then** no encuentra contenido recortado, desplazamiento horizontal, salto visual ni controles de navegación o CTA duplicados, superpuestos o contradictorios.
4. **Given** una tecnología asistiva, **When** interpreta la Home, **Then** identifica el idioma español, un único encabezado principal, regiones con nombres comprensibles y estados de selección comunicados sin depender solo del color.

### Edge Cases

- La URL de agendamiento no está aprobada: el CTA dirige al bloque final de contacto.
- El mensaje de WhatsApp no está aprobado: se abre el contacto oficial sin inventar un mensaje.
- Una empresa carece de logo oficial o permiso: se omite sin recrear el logo.
- Ninguna empresa tiene un logo oficial aprobado: se omite por completo la región de clientes sin título aislado, nombres sustitutivos, carrusel vacío, placeholders ni mensajes pendientes.
- Un caso carece de mockup: se muestra su contenido oficial sin recurso falso ni espacio roto.
- Un caso carece de destino aprobado: la acción “Ver caso” permanece oculta.
- No hay productos aprobados: no se muestran la sección condicionada, tarjetas vacías ni mensajes provisionales.
- Un producto aprobado carece de recurso visual: su información continúa siendo comprensible sin un mockup inventado.
- No hay testimonios aprobados: el bloque se omite por completo.
- Una red social o enlace legal carece de URL aprobada: el enlace no se muestra.
- El visitante solicita reducción de movimiento: ningún contenido depende del movimiento para ser descubierto o comprendido.
- El texto aumenta de tamaño o el viewport se reduce a 360 px: el contenido y los controles permanecen disponibles sin solaparse ni recortarse.
- Un recurso inferior tarda en estar disponible: el Hero, la navegación y las acciones principales continúan visibles y utilizables.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La Home MUST conservar el orden relativo de las diez secciones principales definido por el brief.
- **FR-002**: La Home MUST mostrar únicamente contenido empresarial procedente del brief o aprobado posteriormente.
- **FR-003**: La experiencia MUST incluir un header global, las secciones aplicables y un footer global.
- **FR-004**: El header MUST incluir Inicio, Servicios, Casos de éxito, Nosotros y Contacto.
- **FR-005**: Cada enlace del header MUST dirigir a una sección existente y dejar visible su título o propósito al finalizar la navegación.
- **FR-006**: El enlace “Nosotros” MUST dirigir a “¿Por qué trabajar con APPLAND?” y MUST NOT crear ni requerir una sección adicional.
- **FR-007**: El header MUST permanecer disponible durante la navegación, diferenciarse visualmente del contenido después del desplazamiento y reflejar como activo el enlace asociado a la región actual; MUST existir como máximo un enlace activo y su estado MUST comunicarse visualmente y mediante semántica accesible.
- **FR-008**: La navegación compacta MUST poder abrirse, cerrarse y utilizarse mediante mouse, touch y teclado.
- **FR-009**: El Hero MUST presentar el título, subtítulo y acciones aprobadas.
- **FR-010**: “Agendar una reunión” MUST usar una URL aprobada o dirigir al bloque final de contacto cuando esa URL no exista.
- **FR-011**: “Escribir por WhatsApp” MUST usar el número oficial y MUST NOT inventar un mensaje pendiente de aprobación.
- **FR-012**: Clientes MUST mostrar únicamente logos oficiales disponibles y autorizados; si no existe al menos uno, la región completa MUST permanecer oculta sin sustitutos ni estado vacío público.
- **FR-013**: La presentación en movimiento de clientes MUST poder pausarse y MUST conservar el contenido cuando el movimiento esté reducido.
- **FR-014**: Desafíos MUST presentar los cinco problemas y respuestas oficiales.
- **FR-015**: Servicios MUST presentar los cinco servicios oficiales y permitir que el visitante seleccione y consulte cada uno.
- **FR-016**: La selección de servicios MUST comunicar claramente cuál opción está activa sin depender únicamente del color.
- **FR-017**: Casos MUST presentar únicamente los casos con mockup y descripción oficiales aprobados, en el orden acordado (Toyota, Dilo, Tengo, TV Azteca, Avianca, Telemedicine Platform, Espresso Americano), y permitir un recorrido manual mediante mouse, touch y teclado.
- **FR-018**: Los casos MUST admitir recursos oficiales posteriores sin requerir mockups, resultados o tecnologías inventadas.
- **FR-019**: La acción “Ver caso” MUST permanecer oculta mientras no exista un destino aprobado.
- **FR-020**: IA MUST presentar las nueve aplicaciones oficiales, cada una con su descripción aprobada, y una acción de contacto relacionada.
- **FR-021**: Productos MUST mostrar únicamente productos aprobados como disponibles.
- **FR-022**: Si no existe ningún producto aprobado, la sección de productos MUST permanecer oculta y MUST NOT mostrar placeholders o estados vacíos públicos.
- **FR-023**: Si existen productos aprobados, el visitante MUST poder recorrerlos manualmente y seleccionar “Solicitar información”.
- **FR-024**: “¿Por qué trabajar con APPLAND?” MUST presentar los siete atributos oficiales.
- **FR-025**: Los testimonios MUST permanecer omitidos en esta versión.
- **FR-026**: Equipo global MUST presentar Honduras, Estados Unidos, Colombia, Panamá, Bangladesh y Guatemala en una región compacta antes del CTA final.
- **FR-027**: El CTA final MUST incluir el título, texto, acciones y datos de contacto oficiales.
- **FR-028**: El footer MUST mostrar únicamente navegación, contenido, contacto y redes con información aprobada.
- **FR-029**: Los enlaces de privacidad, términos o redes sin URL aprobada MUST permanecer ocultos.
- **FR-030**: Todo el contenido visible MUST estar en español y la Home MUST NOT mostrar selector, controles de alternancia, atributos de referencia bilingües ni contenido inglés oculto sin uso.
- **FR-031**: La Home MUST NOT mostrar placeholders, mockups falsos, métricas inventadas, textos pendientes o enlaces muertos.
- **FR-032**: La experiencia MUST adaptarse a 1440, 1280, 1024, 768, 390 y 360 px sin perder contenido o funcionalidad; entre 559 y 560 px, el CTA y la navegación del header MUST cambiar coherentemente sin controles duplicados, superpuestos o contradictorios, salto visual ni desplazamiento horizontal.
- **FR-033**: En desktop, el Hero MUST presentar su contenido y visual como una composición de dos columnas.
- **FR-034**: En tablet y móvil, el Hero MUST presentar una composición de una columna y la navegación MUST ofrecer una alternativa compacta.
- **FR-035**: Las tarjetas, controles y regiones MUST reorganizarse sin producir recortes ni desplazamiento horizontal de página.
- **FR-036**: Todas las acciones y selecciones MUST poder operarse mediante teclado y mostrar foco visible.
- **FR-037**: El menú compacto MUST comunicar su estado y conservar un recorrido de foco comprensible al abrirse y cerrarse.
- **FR-038**: La jerarquía de contenido MUST incluir un único encabezado principal y encabezados de sección coherentes.
- **FR-039**: Las imágenes informativas MUST tener una descripción apropiada y los elementos decorativos MUST NOT interferir con tecnologías asistivas.
- **FR-040**: El color MUST NOT ser el único medio para comunicar estado, selección o disponibilidad.
- **FR-041**: La experiencia MUST ofrecer contraste y áreas interactivas suficientes para lectura y uso táctil.
- **FR-042**: La preferencia de reducción de movimiento MUST eliminar el movimiento no esencial sin ocultar información o controles.
- **FR-043**: El Hero, la navegación y las acciones principales MUST estar disponibles sin esperar a que terminen de cargar las secciones inferiores.
- **FR-044**: La carga de recursos MUST NOT causar cambios visibles que hagan que el usuario pierda su objetivo o active un control distinto del esperado.
- **FR-045**: La ausencia o demora de un recurso opcional MUST NOT producir contenido roto, errores visibles ni información falsa.
- **FR-046**: Las páginas internas MUST permanecer fuera del comportamiento y contenido especificados para esta feature.

### Key Entities

- **Región de Home**: Bloque funcional ordenado con propósito, título, contenido oficial, estado de visibilidad y destino de navegación opcional.
- **Elemento de navegación**: Etiqueta visible y región existente a la que conduce; “Nosotros” se relaciona con la región “¿Por qué trabajar con APPLAND?”.
- **Acción de conversión**: Acción visible, etiqueta, destino aprobado y comportamiento alternativo cuando el destino final no está disponible.
- **Cliente**: Empresa aprobada con nombre, logo oficial, autorización de publicación y estado visible.
- **Servicio**: Oferta oficial con nombre, descripción y estado de selección.
- **Caso de éxito**: Proyecto oficial con nombre, descripción breve, recurso visual opcional y destino opcional aprobado.
- **Aplicación de IA**: Capacidad oficial presentada en la sección de Inteligencia Artificial.
- **Producto**: Plataforma candidata con estado de aprobación; solo los productos aprobados pueden ser visibles y solicitar información.
- **Atributo de APPLAND**: Afirmación oficial utilizada para respaldar confianza.
- **Presencia global**: País oficial incluido en la cobertura internacional.
- **Recurso empresarial**: Logo, mockup, URL o texto sujeto a aprobación y a reglas de visibilidad.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Al menos 90% de los participantes que visitan la Home por primera vez identifica qué hace APPLAND y localiza la acción principal de contacto dentro de los primeros 10 segundos.
- **SC-002**: Al menos 90% de los participantes inicia una acción de reunión o WhatsApp en no más de dos decisiones desde el Hero o el CTA final.
- **SC-003**: El 100% de los enlaces del header conduce a la región correcta; “Nosotros” conduce a “¿Por qué trabajar con APPLAND?” y, al recorrer la Home, como máximo un enlace refleja visual y programáticamente la región activa.
- **SC-004**: El 100% del contenido empresarial publicado tiene origen en el brief o aprobación explícita posterior.
- **SC-005**: La Home presenta cero placeholders, enlaces muertos, productos no aprobados, testimonios provisionales o recursos empresariales inventados.
- **SC-006**: El 100% de servicios, casos y productos visibles puede consultarse o recorrerse mediante mouse, touch y teclado.
- **SC-007**: El 100% del movimiento persistente puede pausarse y el 100% del contenido continúa disponible con reducción de movimiento.
- **SC-008**: Las tareas de navegar, elegir un servicio, recorrer casos y comenzar contacto pueden completarse sin mouse y con foco visible.
- **SC-009**: En 1440, 1280, 1024, 768, 390 y 360 px, y al cruzar la frontera 559/560 px, la Home presenta cero regiones recortadas, controles duplicados o solapados, saltos visuales y desplazamiento horizontal de página.
- **SC-010**: En el 100% de las validaciones, el Hero, la navegación y las acciones principales son utilizables sin esperar la carga de contenido inferior.
- **SC-011**: En el 100% de las validaciones, ningún cambio visible durante la carga provoca pérdida de contexto, selección errónea o activación accidental.
- **SC-012**: El 100% de las empresas, productos y casos visibles cumple sus respectivas reglas de aprobación y disponibilidad.
- **SC-013**: La revisión visual en los seis anchos confirma la conservación del fondo oscuro, cian principal (marca real de APPLAND), naranja como acento secundario, jerarquía, tipografía, espaciado amplio, header cambiante y composición responsive aprobados.
- **SC-014**: La revisión funcional y de contenido confirma que las diez secciones aplicables mantienen el orden relativo del brief y que no se agregó una sección “Nosotros”.

Los perfiles, herramientas y umbrales técnicos para medir carga, estabilidad y respuesta se definirán posteriormente durante la planificación. Esta especificación evalúa únicamente resultados observables para el usuario.

## Assumptions

- El brief PDF continúa siendo la única fuente oficial de copy empresarial inicial.
- La referencia visual ejecutable es suficiente para evaluar apariencia y comportamiento sin capturas adicionales.
- La experiencia inicial muestra contenido únicamente en español.
- La nueva Home no presenta selector ES/EN, alternancia de idioma ni contenido inglés visible u oculto sin propósito.
- El footer puede describirse como la región once sin afectar el orden funcional de las diez secciones principales.
- El correo mario@applandtech.com y el teléfono +504 3394-9211 son datos oficiales. El correo fue corregido por el Product Owner el 2026-08-24; la versión anterior (hello@applandtech.com) queda descartada.
- LinkedIn (linkedin.com/company/appland-inc/) e Instagram (instagram.com/appland.inc/) son URLs oficiales recuperadas del footer previo al rediseño y aprobadas para publicación el 2026-08-24.
- Una URL de agendamiento pendiente usa el bloque final de contacto como destino alternativo.
- Un mensaje de WhatsApp pendiente no se inventa; se usa el número oficial sin mensaje prellenado hasta recibir aprobación.
- Los productos permanecen ocultos hasta contar con aprobación individual.
- La región de clientes permanece oculta cuando no existe al menos un logo oficial aprobado.
- “Ver caso” permanece oculto hasta contar con un destino aprobado.
- Los testimonios quedan completamente fuera de esta versión.
- Los enlaces sociales y legales permanecen ocultos si carecen de URL aprobada.
- Los recursos visuales pendientes no impiden especificar ni validar el resto de la Home.
- La fidelidad se valida de forma estructural, funcional y visual, sin automatización pixel-perfect obligatoria.

## Non-Blocking Business Dependencies

- Lista final de productos aprobados y sus textos oficiales.
- URL final para agendar una reunión.
- Mensaje final aprobado para WhatsApp.
- Logos oficiales disponibles y autorizaciones de publicación.
- Mockups oficiales de casos y productos.
- Destinos futuros para el detalle de casos.
- URLs oficiales de LinkedIn e Instagram.
- URLs futuras de privacidad y términos.
- Recursos visuales empresariales adicionales.
- Confirmación final de la tipografía de marca o su alternativa aprobada.

Estas dependencias no bloquean la especificación. La experiencia aplica las reglas de ocultamiento y destinos alternativos definidas anteriormente hasta que cada dato sea aprobado.
