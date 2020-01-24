The application is still under development, which explains the lack of advanced features at the moment. The foundations have been completed recently, so the upcoming changes should be focused in new features.

PRs, issues and comments are welcome :).

- [Technology](#technology)
- [Data schema](#data-schema)
- [Architecture](#architecture)
- [Testing](#testing)
- [Development](#development)
- [Work journal](#work-journal)

-----

## Technology

The core technologies used in this project are the following:

- [Vue](https://vuejs.org/)
- [Vuex](https://vuex.vuejs.org/)
- [Vue CLI](https://cli.vuejs.org/)
- [Vuetify](https://vuetifyjs.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Soukai](https://soukai.js.org/)
- [Soukai Solid](https://github.com/NoelDeMartin/soukai-solid)
- [Solid Auth Client](https://github.com/solid/solid-auth-client)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Cypress](https://www.cypress.io/)

In order to understand the basic functionalities, you should at least be familiar with [Vue](https://vuejs.org/) and [Soukai](https://soukai.js.org/).

## Data schema

Data is modeled using 3 classes: Task, List and Workspace. When using Solid authentication, the definitions below use the following prefixes:

| Prefix     | Url                                     | Documentation                          |
| ---------- | --------------------------------------- | -------------------------------------- |
| ldp        | http://www.w3.org/ns/ldp#               | https://www.w3.org/ns/ldp              |
| rdfs       | http://www.w3.org/2000/01/rdf-schema#   | https://www.w3.org/TR/rdf-schema       |
| lifecycle  | http://purl.org/vocab/lifecycle/schema# | http://purl.org/vocab/lifecycle/schema |
| cal        | http://www.w3.org/2002/12/cal/ical#     | https://www.w3.org/TR/rdfcal           |
| purl       | http://purl.org/dc/terms/               | http://purl.org/dc/terms               |

![Data schema](Classes.jpg)

### Task

Types:

  - `ldp:Resource`
  - `lifecycle:Task`

Properties:

| Name        | RDF type                 | Description                           |
| ----------- | ------------------------ | ------------------------------------- |
| name        | `rdfs:label`             | Task name.                            |
| description | `rdfs:comment`           | Task description.                     |
| priority    | `cal:priority`           | Task Priority, will be 1 for starred tasks and missing for non-starred. |
| dueAt       | `cal:due`                | Scheduled date to complete the task.  |
| completedAt | `cal:completed`          | Date of completion of the task. If the task hasn't been completed, this property will be missing. |
| createdAt   | `purl:created`           | Date of creation of the task.         |
| updatedAt   | `purl:modified`          | Last date when the task was modified. |

### List

A List is a Solid container that contains Tasks.

Types:

- `ldp:Resource`
- `ldp:Container`
- `lifecycle:TaskGroup`

Properties:

| Name        | RDF type                 | Description                              |
| ----------- | ------------------------ | ---------------------------------------- |
| name        | `rdfs:label`             | List name.                               |
| createdAt   | `purl:created`           | Date of creation of the list.            |
| updatedAt   | `purl:modified`          | Last date when the list was modified.    |
| taskUrls    | `lifecycle:task`         | Urls to tasks contained within the list. |

### Workspace

A Workspace is a Solid container that contains both Tasks and Lists. Tasks contained directly under a Workspace are considered to be within the inbox "virtual List".

This class has the same properties as List (except taskUrls and the tasks relationship).

## Architecture

The main modules that make up the application are the following:

- **Services:** Singleton instances to manage some global aspect of the application. Each of these  services may wrap interactions with a Vuex module. These services are globally accesible on each Vue component prefixed with a `$`, for example `$services` and `$auth`.

  The two main services are `Workspaces`, used to manage data models, and `Auth`, used to manage authentication and session status.

- **Models:** Models encapsulate data entities and behaviour. There are two types of models: User models, used to encapsulate data for each authentication mode (Offline, Solid, etc.). And Soukai models, used to encapsulate application entities (Workspaces, Lists, Tasks, etc.).

- **Screens:** Application screens. There is only two at the moment: Login and Home. It isn't likely that any new screens are necessary in the short term, given that most features can be achieved using components and dialogs in the Home screen.

- **Dialogs:** Dialogs are used for auxiliary content such as entity creation forms. These can be open using the UI service, accessed within any Vue component with `$ui.openDialog`.

- **Components:** Screens and Dialogs are also Vue components, but there are other components that are defined stand-alone to be used as building blocks.

## Testing

There is currently only one unit test implemented, but most of the behaviour is tested with Cypress integration tests.

Integration tests can be run by executing `npm run cy:test`.

It can also be useful for debugging to execute these tests in a browser. In order to do that, you can launch the application with a testing environment running the `npm run test:serve` command and open the Cypress client with `npm run cy:open`.

## Development

The development of the application is ongoing in the `dev` branch, while the stable version can be found on `master`.

If you want to try an online deployment of the development version, it can be accessed here:  [https://solid-focus.netlify.com](https://solid-focus.netlify.com)

## Work journal

I have been journaling during the  development process, you can read about the evolution of the application and more in-depth information here:

- [Implementing a Task Manager using Solid](https://noeldemartin.com/tasks/implementing-a-task-manager-using-solid)
- [Improving Solid Focus Task Manager](https://noeldemartin.com/tasks/improving-solid-focus-task-manager)
- [Working on Solid Focus Task Manager](https://noeldemartin.com/tasks/working-on-solid-focus-task-manager)
