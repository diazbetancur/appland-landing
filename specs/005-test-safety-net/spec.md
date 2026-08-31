# Feature Specification: Test Safety Net

**Feature Branch**: `005-test-safety-net`

**Created**: 2026-08-31

**Status**: Ready for Implementation

**Input**: Necesidad detectada durante el spec 002: la suite de pruebas es la única red de seguridad del proyecto, y tiene un falso positivo y varios huecos. El spec 006 es la migración de mayor alcance y necesita una red real antes de ejecutarse.

## Scope

### Business Goal

El proyecto no tiene integración continua, así que la suite de pruebas es su única verificación automatizada. Antes de la migración a standalone del spec 006, que reescribe la declaración de todos los componentes y el arranque de la aplicación, esa red debe ser confiable.

Hoy no lo es en tres puntos concretos, y los tres se corrigen aquí.

### Position in the Migration Sequence

Cuarta de cinco. Va después de Vitest a propósito, para que las pruebas nuevas nazcan ya en el runner definitivo y no haya que convertirlas.

| Spec | Frente | Estado |
|---|---|---|
| 002 | Linting y formato | Cerrado y empujado |
| 003 | Sistema de build | Cerrado y empujado |
| 004 | Karma a Vitest | Cerrado y empujado |
| **005** | **Red de seguridad de pruebas** | **Este** |
| 006 | Standalone e `inject()` | Pendiente; depende de esta red |

### The Three Problems

**P1: una prueba que no prueba nada.** `app-routing.module.spec.ts` es la única cobertura de routing del proyecto. No importa `AppRoutingModule`: construye `RouterTestingModule.withRoutes([...])` con una copia escrita a mano de las tres rutas y assertea contra esa copia. Seguiría pasando aunque `app-routing.module.ts` se borrara o se corrompiera.

**P2: la configuración de scroll no tiene cobertura.** `anchorScrolling: 'enabled'`, `scrollPositionRestoration: 'enabled'` y `scrollOffset: [0, 104]` viven solo en `app-routing.module.ts`. Ese `104` es el offset del header fijo: es lo que hace que la navegación a secciones de la Home caiga en el lugar correcto. El spec 006 convierte `RouterModule.forRoot(routes, {...})` en `provideRouter(...)`, y si esas tres opciones se pierden en la conversión, la navegación del landing se rompe sin que ninguna prueba lo note.

**P3: código muerto disfrazado de hueco de cobertura.** Cuatro archivos de fuente no tienen especificación. Medido el 2026-08-31, tres de ellos no se ejecutan nunca en la aplicación:

| Archivo | Usos reales | Diagnóstico |
|---|---|---|
| `components/choose-us/choose-us.component.ts` | 0 usos de `<app-choose-us>` | Muerto |
| `components/our-team/our-team.component.ts` | 0 usos de `<app-our-team>` | Muerto |
| `shared/directives/count-up.directive.ts` | `appCountUp` solo en `choose-us.component.html` | Muerto por arrastre |
| `components/service/card-template/card-template.ts` | 1 uso, en la ruta `/service` | **Vivo** |

Los dos componentes son remanentes de la Home anterior al rediseño del spec 001, que los reemplazó por `home-challenges`, `home-services`, `why` y `team-coverage`, y que declara la página "Nosotros" fuera de alcance. La directiva muere con su único consumidor. Cada uno es referenciado únicamente por `app.module.ts` y por sí mismo.

`app.module.ts` y `home-content.models.ts` no cuentan como huecos: el primero es wiring que desaparece en el spec 006, el segundo son solo interfaces y tipos.

**Causa raíz de P3.** `angular.json` declara `"skipTests": true` para los schematics de `component`, `class`, `directive`, `guard`, `interceptor`, `pipe`, `resolver` y `service`. El proyecto está configurado para no generar especificaciones. Cerrar los huecos actuales sin cambiar eso trata el síntoma: cualquier archivo creado después vuelve a nacer descubierto.

### In Scope

- Reescribir la prueba de routing para que assertee contra el módulo real.
- Añadir guardias ejecutables de las tres opciones de scroll.
- Crear la especificación de `card-template`, el único hueco de código vivo.
- Eliminar los tres archivos muertos, sus plantillas y hojas de estilo, y sus declaraciones en `app.module.ts`.
- Invertir `skipTests` a `false` en los ocho tipos de schematic.

### Out of Scope

- Cobertura de código y sus umbrales.
- Integración continua.
- La migración a standalone. Es el spec 006.
- Añadir pruebas a archivos que ya las tienen, salvo el caso de routing.
- Migrar `RouterTestingModule`, hoy deprecado, a `provideRouter`. Se deja señalado: su momento natural es el spec 006, cuando el routing se reescriba.

### Inherited Baseline

Al cierre del spec 004, commit `9035526`: **95 pruebas** en 25 archivos sobre Vitest en chromium real, lint en 0 errores y 42 advertencias, build en 450.02 kB.

## Requirements

### Functional Requirements

- **FR-001**: La prueba de routing debe assertear contra `AppRoutingModule`, no contra una copia de su configuración.
- **FR-002**: Debe fallar si se altera la tabla de rutas del módulo real.
- **FR-003**: Las tres opciones de scroll deben quedar fijadas por pruebas que lean la configuración efectiva del Router.
- **FR-004**: Cada guardia nuevo debe demostrarse capaz de fallar. Un guardia que pasa con la configuración alterada no es un guardia.
- **FR-005**: `card-template` debe tener especificación que cubra su comportamiento observable, no solo su instanciación.
- **FR-006**: Los tres archivos muertos y sus recursos deben quedar eliminados del proyecto, sin referencias colgantes.
- **FR-007**: Los schematics deben generar especificaciones para los archivos nuevos.
- **FR-008**: Ningún archivo de código vivo debe cambiar de comportamiento.

### Non-Functional Requirements

- **NFR-001**: El conteo de pruebas debe aumentar. Se parte de 95.
- **NFR-002**: El lint debe seguir en 0 errores. Las advertencias deben **bajar**, porque desaparecen tres archivos con `standalone: false` y un constructor con inyección clásica.
- **NFR-003**: El formato debe seguir verificándose limpio.
- **NFR-004**: La compilación de producción debe seguir siendo exitosa, y su tamaño no debería crecer.

## Success Criteria

- **SC-001**: La suite pasa completa y el conteo es mayor que 95.
- **SC-002**: La prueba de routing falla si se altera la tabla de rutas del módulo real, demostrado en la práctica.
- **SC-003**: Cada guardia de scroll falla si se altera su opción, demostrado en la práctica.
- **SC-004**: `npm run lint` termina en 0 y con menos de 42 advertencias.
- **SC-005**: `npm run format:check` termina en 0.
- **SC-006**: `npm run build` termina en 0 y el tamaño no crece.
- **SC-007**: No queda ninguna referencia a los tres símbolos eliminados en todo `src`.
- **SC-008**: `maxWarnings` de `angular.json` queda ajustado al número real posterior a las eliminaciones.

## Risks

- **R-001**: Eliminar componentes declarados en `app.module.ts` puede romper la compilación si alguna referencia se pasa por alto. Mitigación: se verificó que cada símbolo es referenciado solo por el módulo y por sí mismo; se confirma con compilación y pruebas.
- **R-002**: Un guardia mal escrito puede pasar siempre y dar falsa confianza, que es precisamente el defecto que este spec corrige. Mitigación: FR-004 exige demostrar el fallo alterando la configuración a propósito antes de aceptar el guardia.
- **R-003**: Invertir `skipTests` no afecta al código existente, pero cambia el resultado de todo `ng generate` futuro. Mitigación: queda documentado en el README.
- **R-004**: `card-template` recibe su entrada por `@Input` y su plantilla usa el pipe `translate`. Una prueba mal construida podría verificar el pipe en vez del componente. Mitigación: la prueba assertea la estructura que el componente produce a partir de su entrada.
