# APPLAND Home — Referencia de diseño

## Objetivo

Esta carpeta contiene las referencias funcionales y visuales para implementar
la nueva Home de APPLAND dentro del proyecto Angular existente.

## Prioridad de las fuentes

1. `appland-web-brief.pdf` define contenido, alcance y orden de las secciones.
2. `appland-home-reference.dc.html` define la apariencia y el comportamiento observable.
3. El proyecto existente define arquitectura, estándares, componentes, dependencias y restricciones técnicas.
4. `support.js` solo permite visualizar la referencia y nunca forma parte de producción.

## Restricciones

- El HTML de referencia no es código productivo.
- No copiar todo el HTML, CSS o JavaScript directamente al proyecto.
- No introducir estilos inline.
- No reemplazar la arquitectura actual.
- No inventar métricas, testimonios, clientes o resultados.
- No incorporar placeholders como información definitiva.
- El sitio inicial será únicamente en español.
- Debe respetarse el sistema de diseño oscuro con naranja como acento.
- Debe implementarse usando componentes Angular reutilizables.
- Las animaciones deben respetar `prefers-reduced-motion`.

## Alcance inicial

Implementar únicamente la Home completa.

Las páginas internas quedan fuera de este primer alcance:

- Servicios.
- Casos de éxito.
- Detalle de caso.
- Nosotros.
- Contacto.
- FAQ.
- 404.

## Objetivo de conversión

CTA principal: Agendar una reunión.

CTA secundario: Escribir por WhatsApp.

## Validación visual

La referencia visual oficial es `appland-home-reference.dc.html`.

Debe inspeccionarse directamente en los siguientes anchos:

- 1440 px
- 1280 px
- 1024 px
- 768 px
- 390 px
- 360 px

No se requieren capturas adicionales para iniciar o completar el spec.
Si el runtime de la referencia no puede ejecutarse, debe analizarse su HTML,
CSS, tokens, estructura y comportamiento sin bloquear la implementación.
