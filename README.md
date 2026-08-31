# Appland

This project uses [Angular CLI](https://angular.dev/tools/cli) 21.2.x.

## Prerequisites

- Node.js 20.19+, 22.12+, or 24.x. The repository pins Node 24.16.0 in `.nvmrc`.
- npm 11.x when using the pinned Node version.

With NVM for Windows, select the project runtime before installing or running the application:

```powershell
nvm use 24.16.0
npm install
```

## Development server

Run `npm start` for a local-only dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files. Do not expose the development server to an external network.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The browser artifacts are written to `dist/appland/browser/`.

The project uses the esbuild-based `@angular/build:application` builder. The previous webpack builder (`@angular-devkit/build-angular:browser`) was removed in `specs/003-build-system`, which is also why the output moved from `dist/appland/` into the `browser/` subdirectory.

## Code quality

- `npm run lint` runs ESLint over TypeScript, separate templates and inline templates, including Angular's template accessibility rules. It fails on any error and caps warnings at the current architectural-modernization debt.
- `npm run format` applies Prettier to `src/**/*.{ts,html,scss}`; `npm run format:check` verifies without writing.

## Running unit tests

Run `npm test` for watch mode, or `npm run test:ci` for a single run.

Tests execute on [Vitest](https://vitest.dev) through Angular's `@angular/build:unit-test` builder, in a real headless Chromium driven by Playwright. Karma and Jasmine were removed in `specs/004-vitest`.

Two details of that setup are load-bearing and easy to break:

- The test build uses its own `test` configuration in `angular.json`, which adds `zone.js/testing` and `zone.js/plugins/vitest-patch` to the polyfills. Without the Vitest patch, `zone.js` never installs the ProxyZone that `fakeAsync` requires, and every `fakeAsync` test fails.
- `src/test-setup.ts` restores spies after each test. Jasmine did that automatically and Vitest does not, so removing it makes a `vi.spyOn` leak into the tests that follow.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI, run `npx ng help` or see the [Angular CLI documentation](https://angular.dev/tools/cli).
