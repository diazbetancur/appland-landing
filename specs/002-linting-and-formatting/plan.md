# Implementation Plan: Linting and Formatting Baseline

**Branch**: `002-linting-and-formatting` | **Date**: 2026-08-31 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-linting-and-formatting/spec.md`

## Summary

Instalar ESLint y Prettier sobre el proyecto Angular 21 existente, sin cambiar arquitectura, runner de pruebas ni sistema de build. El resultado esperado es un comando de lint que termina en cero errores, un repositorio completamente formateado, y las 35 violaciones de modernización arquitectural registradas como advertencias con destino explícito al spec 006.

Este spec es deliberadamente el primero de los cinco porque es el único puramente aditivo: no altera comportamiento en tiempo de ejecución, y produce el instrumento con el que se medirá el éxito del spec 006.

## Technical Context

**Language/Version**: TypeScript 5.9.3, HTML5 y SCSS sobre Angular 21.2.19 / Angular CLI 21.2.20

**Runtime**: Node 24.16.0, npm 11.13.0

**Build system actual**: `@angular-devkit/build-angular:browser` (webpack). Su migración a `@angular/build:application` es el spec 003, no este.

**Testing actual**: Karma 6.4.4 y Jasmine 6.3 con ChromeHeadless. Su reemplazo por Vitest es el spec 004, no este.

**Baseline verificado el 2026-08-31**:

- `npm test -- --watch=false --browsers=ChromeHeadless` reporta `TOTAL: 87 SUCCESS` con código de salida 0. No requiere `CHROME_BIN`; Chrome 151 se autodetecta. No existe `karma.conf.js` propio.
- `npm run build` termina con código de salida 0. Total inicial 444.15 kB, transferencia estimada 111.13 kB, en 23.3 s. Reparto: `main` 403.84 kB, `polyfills` 35.59 kB, `styles` 3.82 kB, `runtime` 892 B.

**Arquitectura actual**: NgModule. 27 componentes y directivas con `standalone: false`, declarados en `src/app/app.module.ts`. Dos NgModules en total.

**Project Type**: Aplicación web Angular única

**Scale/Scope**: 31 archivos TypeScript de fuente, 24 archivos de especificación, 19 templates HTML, 21 hojas SCSS

## Decisions

Cada decisión registra la evidencia que la sustenta. Las versiones se consultaron en el registro de npm el 2026-08-31 y se contrastaron contra lo instalado.

### D-001: `angular-eslint` en la línea 21.4.0, no 22.x

La 21.x declara peer `@angular/cli: >= 21.0.0 < 22.0.0` y el proyecto tiene CLI 21.2.20. La 22.x soltó ese pin pero apunta a Angular 22. Usar 22.x contra un CLI 21 es territorio no declarado por el paquete.

### D-002: ESLint 10.9.1

**Corrección de una decisión previa.** La elección inicial fue ESLint 9 con el argumento de que era "la combinación con más recorrido". Ese argumento resultó falso: al instalar, npm reportó `eslint@9.39.5: This version is no longer supported`. La línea con soporte vigente es la 10, que no está deprecada, y tanto `angular-eslint` 21.4.0 como el parser de `typescript-eslint` 8.68.0 declaran `eslint: ^8.57.0 || ^9.0.0 || ^10.0.0`.

Nota de versionado: `@eslint/js` dejó de seguir la numeración de `eslint`. Su línea 10 está en 10.0.1, no en 10.9.x.

Instalación verificada sin avisos de deprecación ni conflictos de peer dependencies.

### D-003: `typescript-eslint` 8.68.0

Es peer requerido por `angular-eslint` (`^8.0.0`). Su parser declara `typescript: >=4.8.4 <6.1.0`, y el proyecto tiene 5.9.3.

### D-004: Sin `eslint-config-prettier`

Se leyó el contenido de `recommended.json` de `@angular-eslint/eslint-plugin` y de `@angular-eslint/eslint-plugin-template`: ninguno contiene reglas de formato. `eslint:recommended` y `typescript-eslint` recomendado tampoco. No hay conflicto que desactivar, así que la dependencia sería de adorno y viola NFR-003.

### D-005: `prefer-standalone` y `prefer-inject` en `warn`

El destino acordado con el usuario es `error`, pero alcanzable solo al final del spec 006. Configurarlas como error hoy dejaría el comando de lint en rojo durante cuatro specs consecutivos, y un linter permanentemente rojo deja de ser señal. Se configuran en `warn` con el destino documentado, y el spec 006 las promueve a `error` como su criterio de cierre.

### D-006: Alcance de Prettier limitado a `src/**/*.{ts,html,scss}`

Deja fuera `package-lock.json` (553 KB), `angular.json` y los `tsconfig*.json` tal como los genera Angular, y `src/assets/i18n/*.json`, que son datos consumidos en tiempo de ejecución y cuyo formato no aporta nada.

### D-007: `printWidth` en 120

Con el default de 80 se re-partirían líneas hoy legibles; por ejemplo la línea 2 de `src/app/components/why/why.component.ts` mide alrededor de 110 caracteres.

### D-008: `htmlWhitespaceSensitivity` en su default `css`

Cambiarlo a `ignore` permite a Prettier mover espacios que son significativos alrededor de elementos inline, alterando el render. Se conserva el default y se verifica con pruebas y compilación (R-002 del spec).

### D-009: `endOfLine` en `lf`

Evidencia: `git ls-files --eol` reporta `i/lf` para los archivos de fuente y `w/lf` en la mayoría, con `src/app/app.module.ts` en `w/mixed`. `core.autocrlf` está en `true` y no existe `.gitattributes`. Fijar `lf` coincide con el índice, evita un diff espurio de todo el repositorio y normaliza el archivo mixto.

### D-010: `ng lint` mediante `@angular-eslint/builder:lint`

Es el camino idiomático de Angular y el paquete `angular-eslint` ya arrastra el builder. La opción de patrones se llama `lintFilePatterns` y es un arreglo, verificado leyendo el `schema.json` del builder. El mismo schema expone `maxWarnings`, que se fijará al número exacto del inventario real para que la cuenta de advertencias no pueda crecer en silencio.

### D-011: Flat config en CommonJS

`package.json` no declara `"type": "module"`, así que `eslint.config.js` usa `require` y `module.exports`.

## Configuration Artifacts

### `eslint.config.js` (nuevo)

Los nombres de los configs exportados se verificaron extrayendo `angular-eslint@21.4.0` y leyendo su `dist/index.d.ts`: `tsAll`, `tsRecommended`, `templateAll`, `templateRecommended`, `templateAccessibility` y `processInlineTemplates`.

```js
// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    ignores: ['dist/**', 'tmp/**', 'out-tsc/**', '.angular/**', 'coverage/**', 'docs/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      // Destino: 'error' como criterio de cierre del spec 006.
      '@angular-eslint/prefer-standalone': 'warn',
      '@angular-eslint/prefer-inject': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
);
```

`docs/**` se ignora completo: contiene `support.js`, 69 KB generados que declaran en su primera línea que no deben editarse, y un HTML de referencia de diseño.

### Target `lint` en `angular.json` (nuevo)

```json
"lint": {
  "builder": "@angular-eslint/builder:lint",
  "options": {
    "lintFilePatterns": ["src/**/*.ts", "src/**/*.html"]
  }
}
```

`maxWarnings` se añade en una tarea posterior, con el valor tomado del inventario real.

### `.prettierrc.json` (nuevo)

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

`singleQuote` responde a `.editorconfig` (`quote_type = single`) y a la evidencia del código: 212 importaciones con comilla simple frente a 1 con doble.

### `.prettierignore` (nuevo)

Excluye `node_modules`, `dist`, `tmp`, `out-tsc`, `.angular`, `coverage`, `docs`, `package-lock.json` y `src/assets`.

### Scripts en `package.json` (modificado)

```json
"lint": "ng lint",
"lint:fix": "ng lint --fix",
"format": "prettier --write \"src/**/*.{ts,html,scss}\"",
"format:check": "prettier --check \"src/**/*.{ts,html,scss}\""
```

## File Map

| Archivo | Acción |
|---|---|
| `eslint.config.js` | crear |
| `.prettierrc.json` | crear |
| `.prettierignore` | crear |
| `package.json` | modificar: cuatro devDependencies y cuatro scripts |
| `package-lock.json` | modificar: resultado de la instalación |
| `angular.json` | modificar: target `lint` |
| `src/app/components/service/service.component.ts` | modificar: eliminar el `any` |
| `src/**/*.{ts,html,scss}` | modificar: formateo |
| `.specify/feature.json` | modificar: apuntar a este spec |

Archivos que este spec no toca: `src/main.ts`, `src/app/app.module.ts` y `src/app/app-routing.module.ts` en cuanto a estructura, `tsconfig*.json`, y cualquier archivo de especificación en cuanto a aserciones.

## Verification

Se ejecuta en este orden y se registra la salida real de cada comando:

1. `npm run lint` termina en 0 con cero errores (SC-001).
2. `npm run format:check` termina en 0 (SC-002).
3. Las advertencias son exactamente las de modernización, sin sorpresas sin explicar (SC-003).
4. `npm test -- --watch=false --browsers=ChromeHeadless` reporta 87 pasando (SC-004).
5. `npm run build` termina exitoso (SC-005).

Ninguna afirmación de completitud se emite sin la salida del comando correspondiente.

## Risks and Mitigations

| Riesgo | Mitigación |
|---|---|
| El inventario real revela violaciones no predichas, sobre todo variables e imports sin usar | El inventario se captura y se reporta al usuario **antes** de resolver nada; el alcance se confirma con esa evidencia (R-001) |
| El formateo de HTML altera espacios significativos | `htmlWhitespaceSensitivity` en su default; verificación por pruebas y compilación (D-008, R-002) |
| El formateo masivo degrada `git blame` | Aislado en su propio commit; aceptado explícitamente por el usuario (R-003) |
| Resolver el `any` de `service.component.ts` puede requerir entender el modelo de datos que ese componente consume | Se inspecciona el uso real antes de tipar; si el tipo correcto no es evidente, se consulta en vez de inventar un tipo |

## Pre-existing Condition Found

### Activo reemplazado

Durante la exploración apareció `src/assets/images/clients/GrupoTerra.png` modificado en el árbol de trabajo, con 111.241 bytes frente a los 89.932 de `HEAD`. Git lo trata como binario en ambos lados y las dos versiones tienen cabecera PNG válida, así que no es corrupción por fines de línea: es un reemplazo deliberado del logo. No proviene de este trabajo. El usuario confirmó que es intencional; queda como commit de activo separado, fuera de los commits de este spec.

### Vulnerabilidades preexistentes

`npm audit` reporta 5 vulnerabilidades (4 altas, 1 moderada) y **todas son anteriores a este spec**: provienen de `@angular-devkit/build-angular` a través de `webpack-dev-server`, `less`, `image-size` y `nanoid`. Ninguna la introdujo la instalación de este spec.

Consecuencia útil para la secuencia: el spec 003 sustituye precisamente ese builder por `@angular/build:application`, que no depende de webpack ni de `less`. Es probable que esas cinco desaparezcan como efecto colateral de esa migración. No se intenta remediarlas aquí, porque `npm audit fix` sobre el builder legacy es exactamente el cambio que el spec 003 hace de forma controlada.

### Causa raíz de los archivos sin pruebas

`angular.json` declara `"skipTests": true` para los schematics de `component`, `class`, `directive`, `guard`, `interceptor`, `pipe`, `resolver` y `service`. Es decir: el proyecto está configurado para **no generar especificaciones** al crear código nuevo.

Eso explica por qué cinco archivos no tienen pruebas, y significa que crearlas en el spec 005 trata el síntoma: cualquier archivo creado después volvería a nacer sin pruebas. Insumo para el spec 005, cuya decisión de invertir esos flags corresponde a ese spec y no a este.

### Sin `.gitattributes`

`core.autocrlf` está en `true` y no existe `.gitattributes`. Hoy no causa daño observable: los archivos de fuente están en LF tanto en el índice como en el árbol, con `src/app/app.module.ts` como única excepción en estado mixto, y los binarios están correctamente detectados como tales. Se deja registrado como condición latente, no se corrige aquí.

## Out of Scope Confirmations

- No se crea integración continua.
- No se configuran umbrales ni reportes de cobertura.
- No se migra arquitectura, runner ni sistema de build.
- No se añaden reglas de estilo ajenas a la corrección.
