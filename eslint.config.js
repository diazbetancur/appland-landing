// @ts-check
// Flat config en CommonJS: package.json no declara "type": "module".
// Ver specs/002-linting-and-formatting/plan.md para la justificacion de cada eleccion.
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    // Salidas de build, caches, cobertura y activos generados.
    // docs/ contiene support.js (69 KB generados que declaran no editarse) y un HTML de referencia de diseno.
    ignores: ['dist/**', 'tmp/**', 'out-tsc/**', '.angular/**', 'coverage/**', 'docs/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    // Permite analizar templates escritos inline en decoradores, no solo archivos .html separados.
    processor: angular.processInlineTemplates,
    rules: {
      // Estas dos reglas nacieron en 'warn' en el spec 002, con 27 y 8 violaciones, porque
      // resolverlas era la migracion completa a standalone. El spec 006 la ejecuto y las
      // llevo a cero, asi que aqui se promueven a 'error' como estaba previsto: a partir de
      // ahora, cualquier reintroduccion de NgModule o de inyeccion por constructor falla.
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/prefer-inject': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
  },
);
