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
      // Deuda de modernizacion arquitectural, medida el 2026-08-31: 27 y 8 violaciones respectivamente.
      // Se mantienen en 'warn' porque su resolucion es la migracion completa a standalone.
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
