# Course Schedulizer Client

The Course Schedulizer is a single-page application that allows users to view and interact with course schedules. The client is built with a focus on user experience and accessibility. See the [Calvin Knights root](../README.md) for general information on this project.

[![node js](https://img.shields.io/badge/node_js-000?logo=node.js)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-000?logo=pnpm)](https://pnpm.io/)
[![react js](https://img.shields.io/badge/react_js-000?logo=react)](https://react.dev/)
[![create react app](https://img.shields.io/badge/create_react_app-000?logo=createreactapp)](https://create-react-app.dev/)
[![typescript](https://img.shields.io/badge/typescript-000?logo=typescript)](https://www.typescriptlang.org/)
[![github](https://img.shields.io/badge/github-121013?logo=github&logoColor=white)](https://github.com/)
[![github pages](https://img.shields.io/badge/github_pages-121013?logo=github&logoColor=white)](https://pages.github.com/)
[![netlify](https://img.shields.io/badge/netlify-000?logo=netlify)](https://www.netlify.com/)
[![vscode](https://img.shields.io/badge/vscode-000?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE+SURBVHgBjVJNToNAFP5moInpiiPIDdqauDY9gh6g1BO4s9EFYceqqRcQepEat02UjXvaE8hGtBHmOdMiZQAjb8FLePP9vB+GLuG+Adn3BJS5YKaHHM/whxvWEeiA8kAvsIDv801k/QluBaogh+PuxUU/j2UOGiT30aQdeAgOkW9lthQT+lmE2+i0Agxr7xPN+P47WzvgvFCgDQhLMOYeHVIMRlcgPpeIi9+/x4FpBFpEEMYlTnpb7L5WVTAvn/jnIUgsNRhJF6kxVmtpIS1sN9dBZQ3SsjDH7cpN4DsE8woCxWGDZyt8pIO6Mj9cTgFUgxHGCP6ZByGuKwZt9PirVB3oYMpsObdY9hvi0xyV/akZCDGtiVnNntVxLIYJ2mK2nsotPLZUqNtt79I6QSIn8vQ/WCeYS8EHpOZCOf0BmnSexRUGtfwAAAAASUVORK5CYII=)](https://code.visualstudio.com/)

## Scripts

[Create React App](https://create-react-app.dev/) builds the following built-in scripts.

- `pnpm start` runs the app in the development mode.
  Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

- `pnpm test` launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

- `pnpm build` builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed!

- `pnpm deploy` is used by GitHub actions to deploy the build. It will trigger the `predeploy` script.

We don&rsquo;t suggest using `pnpm eject` (see [this Stack Overflow post](https://stackoverflow.com/questions/48308936/what-does-this-react-scripts-eject-command-do)).

## Workflows

You can manage the Node and pnpm versions manually, but we suggest specifying them using Node [Corepack](https://nodejs.org/api/corepack.html), and [pnpm](https://pnpm.io/). To do this,

1. [Install a recent version of node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs), e.g., using [nvm](https://github.com/nvm-sh/nvm).
1. Setup your environment by running `corepack enable pnpm`, which enables Corepack, bundled with Node as an &ldquo;experimental&rdquo;, non-default feature, with pnpm.

With this done, Corepack will auto-install the pnpm version specified in [`package.json`](package.json) (as `packagemanager`), and pnpm will auto-install the Node version specified in [`.npmrc`](.npmrc) (as [`use-node-version`](https://pnpm.io/npmrc#use-node-version)).

**To run the Schedulizer locally:**

1. `git checkout` the branch you want to work on (e.g., your dedicated feature branch).
1. `cd client-course-schedulizer` to move into the monorepo&rsquo;s client application sub-directory.
1. `pnpm install` to install the required NodeJS packages as specified in `package.json`.
1. `pnpm start` to run the website on [localhost:3000](http://localhost:3000).

Edits you make to the code will automatically update the website in your browser.

**To deploy the Schedulizer to the development server:**

1. Create a pull request to merge your fully-implemented-and-tested feature branch into the `develop` branch. You can test your branch locally by running:
   - `pnpm start` to manually test your changes.
   - `pnpm test` Launches the test runner in the interactive watch mode. See the section about [running tests](https://create-react-app.dev/docs/running-tests/) for more information.

GitHub is configured to require on review by a team member for all merges into the `develop` branch. When the merge is approved:

1. The continuous integration (CI) workflow specified in [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml) will automatically run the tests. The tests are specified in `src/**/*.test.*` files and run using [Jest](https://jestjs.io/).
1. If the tests pass, the CI workflow will automatically merge your PR into the `develop` branch.
1. When it detects new code in the `develop` branch, [Netlify](https://www.netlify.com/) will automatically deploy the new version of the `develop` branch to the development server. See the:
   - Development server dashboard at: [https://app.netlify.com/sites/sharp-babbage-a45ee2](https://app.netlify.com/sites/sharp-babbage-a45ee2)
   - Running application at: [https://sharp-babbage-a45ee2.netlify.app](https://sharp-babbage-a45ee2.netlify.app)

**To deploy a new production version of the Schedulizer to the production server:**

Follow the same workflow as for the development server, but merge the `develop` branch into the `production` branch. Note that:

- The `production` branch is also requires a review by a team member.
- Merging into the `production` branch will trigger both the CI workflow (discussed above) and the Deploy workflow specified in [`../.github/workflows/deploy.yml`](../.github/workflows/deploy.yml). You can test this locally by running:
  - `pnpm start` to manually test your changes.
  - `pnpm test` to run the tests.
  - `pnpm build` to build the application deployment bundle.
- The deploy workflow auto-deploys the new version of the `production` branch on GitHub Pages, see: [https://senior-knights.github.io/course-schedulizer](https://senior-knights.github.io/course-schedulizer).

**TODO**: The deploy script has not yet been tested with pnpm. Fix this before merging into `production`.

## Directories

- `csv/` contains sample course schedules in `.csv` and `.xlsx` formats. The files include new and old formats, which are not compatible.

- `public/` contains every image or other &ldquo;artful&rdquo; content used in the client app.

- `src/` contains all source files that build the client application.

  - `src/assets` contains images used by the application
  - `src/components` contains all React components in the project. Every component resides within a folder, that is its exported name written in `PascalCase`. When a folder is used for additional storage, such as `pages/` (for the apps views) and `reuseables/` (for components used in many other components), they are written in `camelCase`. Each component folder contains `index.ts`, `ComponentName.tsx`, `ComponentName.test.tsx`, and `ComponentName.scss`. Sometimes they will contain a `componentNameService.ts` or additional folders for children components. Note that `pages/HarmonyPage` has been removed from the UI.
  - `src/data` contains constraints on times within which classes may start. These constraints are run in R; see Prof. Pruim for details.
  - `src/styles` contains global styles using [Sass](https://sass-lang.com/) in SCSS form.
  - `src/types` contains module type declares for NPM packages that do not ship with types.
  - `src/utilities` contains helper functions, logic, interfaces, constants, services, and all other code-related things that are not React Components.
    - `utilities/contexts` establishes the global state of the app.
    - `utilities/helpers` provides various helpful functions for development use.
    - `utilities/hooks` provides hooks for interacting with the schedule.
    - `utilities/interfaces` defines the app interfaces and data interfaces.
    - `utilities/reducers` provides functions to perform multiple setState updates at once that depend on each other.
    - `utilities/services` provides services, e.g., for detecting conflict, calculating faculty load, etc.

- `.tsconfig` has been modified to allow for: [barrelling](https://basarat.gitbook.io/typescript/main-1/barrel), which combines the exports from each module in a directory into a single `index.ts` module, and [absolute imports](https://medium.com/geekculture/making-life-easier-with-absolute-imports-react-in-javascript-and-typescript-bbdab8a8a3a1), which allows for cleaner imports.

- `index.tsx` is the entry point into the React application.

[Husky](https://typicode.github.io/husky/#/) is used with [Lint Staged](https://github.com/okonet/lint-staged) to format all code to the ESLint rules when they are committed. This insures that changes pushed are not confused by changing syntax or code style.

## Development Philosophy

React&rsquo;s functional programming is great for dealing with complex, stateful user interfaces. With React, all data is either primitives or an object (which includes functions) since the library focuses on immutability. Each React component defines how every view will behave for a given state. Generally, each view is rendered whenever the data is updated.

We typically use packages rather than rolling our own features. This saves times and catches more edge cases, typically.
