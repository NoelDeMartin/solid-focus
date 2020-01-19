# v0.2.3

- Added hability to star tasks (using `cal:priority` rdf property).
- Implemented remembering last active workspaces and lists (using localStorage).
- Improved UX to edit tasks, lists and workspaces.
- [gh-8](https://github.com/NoelDeMartin/solid-focus/issues/8) Improved info on login screen.

# v0.2.2

- Updated dependencies.

# v0.2.1

- Added loading states for operations taking more than 1 second to complete.
- Handled network errors.
- Implemented some small UI tweaks.
- Fixed bugs:
    - [gh-7](https://github.com/NoelDeMartin/solid-focus/issues/7) Lists creation is broken in Offline mode

# v0.2.0

- Improved UX.
- Implemented the ability to edit and delete Workspaces, Lists and Tasks.
- Added Task scheduling and descriptions.
- Added markdown support for task names and descriptions.
- Added tasks sidepanel.
- Added [soukai](https://soukai.js.org/) dependency to manage data persistence.
- Improved documentation (including a schema of the RDF ontologies that have been used).
- Refactored [data schema](https://github.com/NoelDeMartin/solid-focus/tree/v0.2.0/docs#data-schema).

# v0.1.1

- Improved UX.
- Fixed bugs:
    - [gh-1](https://github.com/NoelDeMartin/solid-focus/issues/1) Handle expired sessions
    - [gh-2](https://github.com/NoelDeMartin/solid-focus/issues/2) solid-focus tries to load tasks from wrong resources
- Updated dependencies (Vue 2.6.6, Vuetify 1.5.1).
- Updated parsing of WebID profile according with [Solid specs](https://github.com/solid/solid-spec/blob/master/solid-webid-profiles.md#minimum-recommended-profile-information) (dropped support for vcard fields).
- Task id generation moved to the client.

# v0.1.0

- First version of the app.
- Workspaces, Lists and Tasks management.
- Login with Solid and for offline use (using localStorage).
