# <p align="center"><img src="./CourseSchedulizerMediaFinal.png" alt="Course Schedulizer" title="Course Schedulizer"/></p>

📝 **Create semester schedules without stress.** This is the monorepository for the [`senior-knights/course-schedulizer`](https://github.com/senior-knights/course-schedulizer) project. For more information about the application, please view the [About Page](https://senior-knights.github.io/course-schedulizer/#/about) on our website. For help using the application, visit our [Help Page](https://senior-knights.github.io/course-schedulizer/#/help) (once we make it).

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

## Background

Every year, all department chairs at Calvin must develop a schedule for their department’s classes based on a spreadsheet provided to them by the Registrar. The schedule must contain the times, professors, and rooms for every class section in the department and the schedule must satisfy many constraints, for example: only one section can be in a room at a time, a professor can only teach one section at a time, among others. These constraints make it extremely difficult for the department chair to create a schedule without a tool to help them. We propose building a web application, named the Course Schedulizer, that will allow department chairs to visualize and manipulate their department course schedules. It will provide: the ability to upload and export department schedules via CSV, integration with the spreadsheets provided and required by the Registrar, two views to visualize the schedule data (by location and by instructor), schedule conflict detection and resolution suggestions (for honors portion), and many other features.

For more information, please visit the [About Page](https://senior-knights.github.io/course-schedulizer/#/about).

## How to use

Detailed information can be found on our [Help Page](https://senior-knights.github.io/course-schedulizer/#/help) (once we make it).Access our production website and upload a CSV following the prescribed specifications:

- Department: string
- Term: [0-9][0-9]/(FA | SP | IN)
- TermStart: mm/dd/yyyy
- AcademicYear: yyyy
- SectionName: SubjectCode-CourseNum-SectionCode
- SubjectCode: string
- CourseNum: string
- SectionCode: string
- CourseLevelCode: pos num
- MinimumCredits: pos num
- FacultyLoad: pos num
- Used: pos num
- Day10Used: pos num
- LocalMax: pos num
- Global Max: pos num
- RoomCapacity: pos num
- BuildingAndRoom: string
- MeetingDays: M?T?W?(TH)?(F)
- MeetingTime: xx:xx(AM | PM) - xx:xx(AM | PM)
- SectionStartDate: mm/dd/yyyy
- SectionEndDate: mm/dd/yyyy
- Building: string
- RoomNumber: string
- MeetingStart: xx:xx(AM | PM)
- MeetingStartInternal: xx:xx:xx 24-hour
- MeetingEnd: xx:xx(AM | PM)
- MeetingEndInternal: xx:xx:xx 24-hour
- Monday: "M" or ""
- Tuesday: "T" or ""
- Wednesday: "W" or ""
- Thursday: "TH" or ""
- Friday: "F" or ""
- ShortTitle: string
- Faculty: string (first and last)
- SectionStatus: string
- InstructionalMethod: "LEC" | "CPI" | "IND" | "TUT" | "SEM"

## Development

### Basic Introduction

This is a mono repository for the Course Schedulizer project. It is best used with [VS Code](https://code.visualstudio.com/). To begin editing, open the [workspace file](.vscode/course-schedulizer.code-workspace), located in `.vscode/`, with VS Code. Opening the workspace in VS Code will prompt to install extensions; please do so.

This provides information about the root repository, for the client app information, please view the [`client-course-schedulizer/README.md`](./client-course-schedulizer/README.md).

### Development Philosophy

`production` branch is a persistent branch that contains the most stable version of the Course Schedulizer. It requires two reviews to merge PRs to this branch.

`develop` branch is a persistent branch that contains the cutting edge version of the Course Schedulizer. It requires one review to merge PRs to this branch. Each PR is ideally around 100-200 LOC.

Code reviews are done on every PR merged into the two persistent branches. A PR is made with a branch following the naming convention of `<broad>/<specific>`. `<broad>` are things like `feature`, `docs`, `chore`, `fix`, etc.

### Repository Configuration

Because the application is open source, we use free minutes of GitHub actions to perform CI/CD. `ci.yml` tests on any push or PR against `develop` or `production`.

`.vscode/` contains the directory settings. It most notably uses Prettier to format code on save. Formatting will fix ESLint issues, organize imports, and then fix Editor Config and Prettier issues. `.editorconfig` and `.prettierrc.js` are located in the root and `.eslint.js` is specific to each application. For example, the client config in location inside the client folder.
