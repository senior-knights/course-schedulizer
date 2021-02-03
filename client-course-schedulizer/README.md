# Client Course Schedulizer

📝 **Create semester schedules without stress.** This is the client folder for the [`senior-knights/course-schedulizer`](https://github.com/senior-knights/course-schedulizer) project. For more information about the application, please view the [About Page](https://senior-knights.github.io/course-schedulizer/#/about) on our website. For help using the application, visit our [Help Page](https://senior-knights.github.io/course-schedulizer/#/help) (once we make it).

<a href="https://senior-knights.github.io/course-schedulizer/"><img alt="prod build" src="https://img.shields.io/badge/schedulizer-8C2131?logo=internet-explorer" /></a>
<a href="https://github.com/senior-knights/course-schedulizer"><img src="https://img.shields.io/github/workflow/status/senior-knights/course-schedulizer/Deployment.svg" alt="deployment status"></a>
<a href="https://www.calvin.edu"><img alt="https://senior-knights.github.io/course-schedulizer/" src="https://img.shields.io/badge/calvin-knights-F3CD00?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAB8lBMVEUAAAB4eHgZUUa+lp2ShYdOT1EvLS7/2ewfHh4oJif///9ISU8uLCzQwpcICAUxLzBGREU7OTpxbm5tbGsACgZvbm0rXlRRT1BSUFD//9IeHiBTUVF1dHJXamRoZmUBBDC3spvw26AJCQxFTnBubW4CBTS/t5r//8IVFht/gYCacniaWWOqeICvlZp9cnQAAAB1c3OgjI+dZW+ZPk6cgYd9fn6ri5DCrYkpOVcuLCxPT0+Be3yZWGTryWmhl30hICCAfn+ylZm5nXgAAENWVVWhl5mkhY3ewX2yholxc3QAAAAAAEHIsXGxhoxzdHMYWktUZGmQjILszHWzlXoAAD5JTk2XhYiqfH6teHvNlnSjl39ESkmci4/Rq3/FrYhxcm8WPlGdmILUunH2ylLTu3ZRWnVtcYG5qX7pxF3rwmCqn34AF2SZk4TUuG7XumxeZn9xc320poOimIGeRFSgR1K7gIiYOEmpVlXkuIXwyX/wxnSlTVLu0KL/+Nz//e//7rOhTl3Tn4P//Or9+/rv2sTZqIHPkFz22aHJmJ+7en+7fIe7e4btw3W9gIy5eoW+g429gIrz05rfwL3LnajFh3D0w1z/3nn/773u0Y7uuVbIhFytX2HGhGTntmzOmHznr1O0Z1ieRFXTl2L5x0nlrlr3ykssme+IAAAAc3RSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACax+vrLLAJBfcz+hDrYvw0DCjTc808NgeSiAzOgrOrcHQIFnt4eAQ9j+Z8DEXfN6/5wDoLuzCIDQ8L9vg8WhOz6XgNEwsgUG5lvA/jZ2AAAAI1JREFUCNc9y8FHQwEAx/Hf5xIREzNj0mGKmTEdslT2GJP+3yfR28syKdJhpEP/RsQuO7yt48fXV4Rz8GUjBwMoqNf+5NBQAZX1r6MRprDwSWu8E08+HLtoVirvkvblP18lnavdXXuR7i3cYFmTXtGAZ5XkZLavHiU5NefaygNJkv4dkzflT8Ocuaf0vQXX3B/iTs/DcAAAAABJRU5ErkJggg==" /></a>
<a href="https://sharp-babbage-a45ee2.netlify.app/"><img alt="dev build" src="https://img.shields.io/badge/schedulizer%20dev-71B1C8?logo=internet-explorer" /></a>

> Created by current students at [Calvin University](https://calvin.edu/) for their [computer science senior project](https://cs.calvin.edu/courses/cs/396/).

## Built with

<a href="https://reactjs.org/"><img alt="https://senior-knights.github.io/course-schedulizer/" src="https://img.shields.io/badge/react-000?logo=react" /></a>
<a href="https://www.typescriptlang.org/"><img alt="https://senior-knights.github.io/course-schedulizer/" src="https://img.shields.io/badge/typescript-000?logo=typescript" /><a/>
<a href="https://code.visualstudio.com/"><img alt="https://senior-knights.github.io/course-schedulizer/" src="https://img.shields.io/badge/VS Code-000?logo=visual%20studio%20code" /></a>
<a href="https://github.com/"><img alt="https://senior-knights.github.io/course-schedulizer/" src="https://img.shields.io/badge/github-000?logo=github" /></a>
<a href="https://www.npmjs.com/"><img alt="https://senior-knights.github.io/course-schedulizer/" src="https://img.shields.io/badge/npm-000?logo=npm" /></a>
<a href="https://www.netlify.com/"><img alt="https://senior-knights.github.io/course-schedulizer/" src="https://img.shields.io/badge/netlify-000?logo=netlify" /></a>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How to use

`csv/` contains test files for the application.

`public/` contains files import when deploying the application.

`src/` contains all source files that build the client application. For development techniques, see below.

`.eslintrc.js` is a specific ESLint config. `.env` allows for overriding the Create React App ESLint config.

The `.tsconfig` has been modified to allow for barreling and absolute imports.

[Husky](https://typicode.github.io/husky/#/) is used with [Lint Staged](https://github.com/okonet/lint-staged) to format all code to the ESLint rules when they are committed. This insures that changes pushed are not confused by changing syntax or code style.

## Development

This will go through the development process for the `client-course-schedulizer` application.

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!** Would not recommend using this. Use [craco](https://github.com/gsoft-inc/craco) instead of ejecting.

### `npm run deploy`

Used by GitHub actions to deploy the build. Will trigger `predeploy` command.

## Development Philosophy

React's functional programming is great for dealing with complex, stateful user interfaces. With React, all data is either primitives or an object (which includes functions) since the library focuses on immutability. Each React component defines how every view will behave for a given state. Generally, each view is rendered whenever the data is updated.

### Barrelling

Every folder contains `index.ts` that exports all from every file in the folder which allows for barrelling and absolute imports.

### Structure

`assets/` contains every image or other "artful" content used in the client app.

`components/` contains all React components in the project. Every component resides within a folder, that is its exported name written in `PascalCase`. When a folder is used for additional storage, such as `pages/` (for the apps views) and `reuseables/` (for components used in many other components), they are written in `camelCase`. Each component folder contains `index.ts`, `ComponentName.tsx`, `ComponentName.test.tsx`, and `ComponentName.scss`. Sometimes they will contain a `componentNameService.ts` or additional folders for children components.

`styles/` contains global styles. Uses Sass in SCSS form.

`types/` contains module type declares for NPM packages that do not ship with types.

`utilities/` contains helper functions, logic, interfaces, constants, services, and all other code-related things that are not React Components.

`index.tsx` is the entry point into the React application.

### Packages

We typically use packages rather than rolling our own features. This saves times and catches more edge cases, typically.
