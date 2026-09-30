/**
 * Datos de contacto que cambian sin tocar el codigo de la pagina.
 *
 * Angular los incluye en el bundle al compilar: cambiar un valor exige volver a hacer build y
 * deploy. `environment.ts` es el de produccion y `environment.development.ts` lo reemplaza en
 * `ng serve` (ver `fileReplacements` en `angular.json`).
 */
export const environment = {
  /** Agenda de citas de Google Calendar que abren el hero y el menu. */
  bookingUrl: 'https://calendar.app.google/mW7zYayDjc1WvNcu6',
  /** Numero de WhatsApp en formato internacional, sin `+` ni espacios, como lo pide `wa.me`. */
  whatsappNumber: '50433349211',
  contactEmail: 'hello@applandtech.com',
  /** Telefono tal como se marca (`tel:`) y tal como se lee en pantalla. */
  contactPhone: '+50433349211',
  contactPhoneDisplay: '+504 3334-9211',
};
