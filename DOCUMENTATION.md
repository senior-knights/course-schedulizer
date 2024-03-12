Course Schedulizer: DOCUMENTATION





- How to run the `develop` branch locally for developers:
  - `git clone`: clone the repo to local computer and `cd` into the folder
  - `git checkout develop`: switch to `develop` branch
  - `cd client-course-schedulizer`: `cd` into the client folder
  - `pnpm install`: install all packages in package.json
    - Current requirement: pnpm 8.6.0 or above, node 18 or above
  - `pnpm start`: run the website on localhost:3000
- Develop Branch - For development, deployed on [Course Schedulizer (sharp-babbage-a45ee2.netlify.app)](https://sharp-babbage-a45ee2.netlify.app/#/)
- .github/workflows: the github auto-test and auto-deploy scripts
  - ci.yml: automatically test the latest update
    - Trigger: push to all branches, PR to `develop` and `production`
    - Work environment: ./client-course-schedulizer
    - Steps:
      - Set up actions for pnpm and node
      - Update pnpm version
      - Install pnpm dependencies
      - Run pnpm test on the latest push or PR
  - deploy.yml: auto-deploy
    - This script is not updated to use pnpm yet, must be updated before pushing to `production` or error will occur
- Important files: client-course-schedulizer/csv
  - This folder contains sample course schedules in .csv and .xlsx formats
  - Not compatible with latest Workday format, might be replaced in later versions
- Important files: client-course-schedulizer/src - 
  - Folder `assets` - Contains images utilized by the application
  - Folder `components` - Contains important elements of the program interface (to be discussed in further detail later)
  - Folder `data` - Features constraints on times within which classes may start
    - May need to run some outside R command to get the correct data
    - Ask Prof. Pruim for more information about how this folder works
  - Folder `styles` - Establishes colors and fonts used in the application
  - Folder `types` - Establishes objects used in the application (best not to alter this)
  - Folder `utilities` - Various functions and objects to help the application function (to be discussed in further detail later)
  - Other files - Handle server operations
- Important Files - src/components
  - App Folder - Features navigational components, and tests to run
    - App/App.tsx - Provides navigational info
  - Footer Folder - Handles display of the bottom of the page
  - Header Folder - Handles display of the top of the page, including navigational buttons
  - Tabs Folder - Handles tabs that appear in the Schedulizer window
  - Toolbar Folder - Handles functions in toolbars that appear in the Schedulizer window
  - Pages Folder - Handles the pages that are accessible by way of the header
    - SchedulizerPage - Implements the Tabs found in the components/Tabs folder
    - AboutPage - Contains some information regarding the Schedulizer, and the developers working on it
      - AboutPage/TeamMemberProfile - Handles team members as objects to display uniformly
    - HelpPage - Displays information that will help new users learn to use the application
    - HarmonyPage - Highly Experimental - A system meant to create an ideal schedule based on constraints, currently nonfunctional and not under active development		NOT IN USE NOW
  - Reusables Folder - Handles object-classes that are used in various parts of the app
- Important Files - src/utilities
  - Contexts - Establish the global state of the app
  - Helpers - Provide various helpful functions for development use
  - Hooks - Provide hooks for interacting with the schedule
  - Interfaces - Define the app interfaces and data interfaces
  - Reducers - Provide a function to perform multiple setState updates at once that depend on each other.
  - Services - Provide services for eg: detecting conflict, calculate faculty load, etc.

