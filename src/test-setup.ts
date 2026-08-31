import { afterEach, vi } from 'vitest';

/**
 * Setup global de pruebas.
 *
 * Jasmine restauraba automaticamente cada espia creado con `spyOn` al terminar la prueba.
 * Vitest no lo hace por defecto: un `vi.spyOn` sobrevive al caso que lo creo y contamina los
 * siguientes. Eso hacia fallar a RevealOnScrollDirective, donde el espia de `matchMedia` de la
 * prueba de movimiento reducido se filtraba a la prueba siguiente y la directiva salia temprano.
 *
 * Este hook restablece la semantica que las 95 pruebas asumian cuando se escribieron.
 */
afterEach(() => {
  vi.restoreAllMocks();
});
