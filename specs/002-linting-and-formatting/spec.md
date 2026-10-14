# Feature Specification: Linting and Formatting Baseline

**Feature Branch**: `002-linting-and-formatting`

**Created**: 2026-08-31

**Status**: Ready for Implementation

**Input**: User description: "No hay linter en el proyecto. Antes de iniciar la campaña de corrección de bugs, montar linting y formateo. Objetivo: corrección y modernización obligatorias, formateando todo el repositorio."

## Scope

### Business Goal

El repositorio no tiene linter, ni formateador, ni CI. La única red de seguridad automatizada son 87 pruebas Karma/Jasmine. Está por comenzar una campaña de corrección de bugs y hay tres migraciones más planificadas (sistema de build, runner de pruebas, arquitectura standalone).

Esta feature instala primero la capa de análisis estático para que:

1. Todo cambio posterior entre ya conforme, sin obligar a re-tocar archivos después.
2. La migración a standalone del spec 006 tenga un medidor objetivo de progreso, en vez de depender de inspección manual.
3. La deriva de formato existente se resuelva una sola vez, antes de que las migraciones generen diffs grandes.

### Position in the Migration Sequence

Esta es la primera de cinco especificaciones acordadas. El orden es deliberado: cada paso se verifica contra una red de seguridad que no se está moviendo al mismo tiempo.

| Spec | Frente | Por qué en esta posición |
|---|---|---|
| **002** | Linting y formato | Puramente aditivo, cero riesgo de runtime. Provee el instrumento de medición para el 006. |
| 003 | Sistema de build (`browser` a `application`) | Prerequisito técnico del runner Vitest. |
| 004 | Karma a Vitest | Reemplaza la red de seguridad; se hace aislado para restablecer un baseline verde limpio. |
| 005 | Red de seguridad de pruebas | Cierra huecos de cobertura antes de la migración de mayor alcance. Nace ya en Vitest. |
| 006 | Standalone e `inject()` | El cambio de código más grande, verificado por Vitest y por ESLint. |

### In Scope

- ESLint con flat config, cubriendo TypeScript y templates HTML de Angular.
- Reglas de corrección: `eslint:recommended`, `typescript-eslint` recomendado, `angular-eslint` recomendado.
- Reglas de accesibilidad de templates de Angular.
- Prettier, con formateo aplicado a todo el código de aplicación.
- Target `lint` en la configuración del workspace y scripts de npm para lint y formato.
- Resolución de todas las violaciones que no dependan de las migraciones posteriores.
- Registro de las violaciones de modernización como deuda con destino explícito.

### Out of Scope

- Integración continua. No existe `.github/`; la aplicación de reglas queda local. Es su propio spec si se requiere.
- Umbrales y reportes de cobertura. `karma-coverage` está instalado pero nadie lo invoca.
- Las migraciones en sí (specs 003 a 006).
- Presets exhaustivos (`tsAll`, `templateAll`).
- Formateo de archivos de configuración raíz, `package-lock.json` y los JSON de i18n.
- Reglas de estilo no relacionadas con corrección (`typescript-eslint` stylistic).

### Measured Baseline

Medido el 2026-08-31 por inspección regla por regla del contenido de los presets, más conteo por `grep` y un script de análisis de templates. Ningún paquete fue instalado para obtener estas cifras.

| Regla | Severidad en el preset | Violaciones |
|---|---|---|
| `@angular-eslint/prefer-standalone` | error | **27** |
| `@angular-eslint/prefer-inject` | error | **8** |
| `@typescript-eslint/no-explicit-any` | error | **1** |
| `@angular-eslint/template/prefer-control-flow` | error | 0 |
| `@angular-eslint/use-lifecycle-interface` | warn | 0 |
| 11 reglas de accesibilidad de template | error | 0 |
| Resto de `angular-eslint` recomendado | error | 0 |

Estado del código no medible sin instalar: variables e imports sin usar. Se resuelve con un inventario real durante la implementación.

Deriva de formato: 945 líneas con indentación de 4 espacios frente a 777 con 2, conviviendo dentro de los mismos archivos, mientras `.editorconfig` declara `indent_size = 2`. Origen probable: schematics de migración de Angular reescribiendo decoradores sobre código escrito a mano.

## Requirements

### Functional Requirements

- **FR-001**: El proyecto debe exponer un comando único que analice TypeScript y templates HTML y termine con código de salida distinto de cero si existe cualquier error.
- **FR-002**: El análisis debe incluir las reglas de corrección de ESLint base, de TypeScript y de Angular.
- **FR-003**: El análisis debe incluir las reglas de accesibilidad de templates de Angular.
- **FR-004**: El análisis debe cubrir los templates escritos inline en decoradores, no solo los archivos `.html` separados.
- **FR-005**: El análisis debe excluir salidas de build, cachés, cobertura y activos generados que no son código fuente mantenido.
- **FR-006**: El proyecto debe exponer un comando que aplique formato y otro que solo lo verifique sin escribir.
- **FR-007**: El formato aplicado debe respetar lo ya declarado en `.editorconfig`: dos espacios de indentación y comillas simples en TypeScript.
- **FR-008**: Todo el código de aplicación debe quedar formateado, dejando el repositorio en un estado donde la verificación de formato pasa limpia.
- **FR-009**: Las violaciones que no dependen de migraciones posteriores deben quedar resueltas, no silenciadas.
- **FR-010**: Las dos reglas de modernización arquitectural deben quedar configuradas en severidad de advertencia, con su destino a error documentado en el spec 006.
- **FR-011**: Ninguna dependencia añadida debe entrar en conflicto con las versiones instaladas de Angular, TypeScript o el CLI.
- **FR-012**: El comportamiento en tiempo de ejecución de la aplicación no debe cambiar.

### Non-Functional Requirements

- **NFR-001**: Las 87 pruebas existentes deben seguir pasando sin modificación de sus aserciones.
- **NFR-002**: La compilación de producción debe seguir siendo exitosa.
- **NFR-003**: No se añaden dependencias cuya única función sea resolver conflictos que no existen en la configuración elegida.

## Success Criteria

- **SC-001**: El comando de lint termina en 0, con cero errores reportados.
- **SC-002**: El comando de verificación de formato termina en 0 sobre todo el código de aplicación.
- **SC-003**: Las advertencias reportadas por lint son exactamente las 35 de modernización arquitectural (27 más 8), sin advertencias inesperadas sin explicar.
- **SC-004**: La suite de pruebas reporta 87 pasando, igual que el baseline previo.
- **SC-005**: La compilación de producción termina exitosa.
- **SC-006**: El inventario real de violaciones queda registrado, incluyendo cualquier diferencia frente a la predicción del baseline medido.

## Assumptions

- **A-001**: El proyecto permanece en Angular 21; la actualización de configuración a 21 al día ocurre en el spec 003, no aquí.
- **A-002**: La arquitectura NgModule permanece intacta durante este spec; su migración es el spec 006.
- **A-003**: El runner de pruebas permanece Karma/Jasmine durante este spec; su reemplazo es el spec 004.
- **A-004**: No hay CI que deba actualizarse porque no existe.

## Risks

- **R-001**: El inventario real de lint puede revelar violaciones no predecibles por `grep`, principalmente variables e imports sin usar. Mitigación: el inventario se captura y se reporta antes de resolver nada, y el alcance de resolución se confirma con esa evidencia.
- **R-002**: Aplicar formato a los templates HTML puede alterar espacios significativos y con ello el render de elementos inline. Mitigación: conservar la sensibilidad a espacios por defecto del formateador y verificar con pruebas y compilación.
- **R-003**: El formateo masivo degrada la utilidad de `git blame` en las líneas afectadas. Aceptado explícitamente por el usuario; mitigado aislándolo en su propio commit.
