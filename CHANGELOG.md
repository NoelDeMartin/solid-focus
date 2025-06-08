# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.3.1](https://github.com/NoelDeMartin/solid-focus/releases/tag/v0.3.1) - 2025-06-08

### Added

- `schema:name` now falls back to using `schema:description` when missing.
- Network status is now watched when going offline.
- UI Tweaks.

## [v0.3.0](https://github.com/NoelDeMartin/solid-focus/releases/tag/v0.3.0) - 2025-05-30

- App rebuilt from scratch using [Aerogel](https://aerogel.js.org/), check out the [Rebuilding Solid Focus with Aerogel](https://www.youtube.com/playlist?list=PLA3GcuMVHSbzxnR45Gzu2w7QuKs247tE5) video series and the [Making a Web Application Framework](https://noeldemartin.com/tasks/making-a-web-application-framework) development journal to learn more.

## [v0.2.3](https://github.com/NoelDeMartin/solid-focus/releases/tag/v0.2.3) - 2020-01-19

- Added ability to star tasks (using `cal:priority` rdf property).
- Implemented remembering last active workspaces and lists (using localStorage).
- Improved UX to edit tasks, lists and workspaces.
- [gh-8](https://github.com/NoelDeMartin/solid-focus/issues/8) Improved info on login screen.

## [v0.2.2](https://github.com/NoelDeMartin/solid-focus/releases/tag/v0.2.2) - 2019-12-01

- Updated dependencies.

## [v0.2.1](https://github.com/NoelDeMartin/solid-focus/releases/tag/v0.2.1) - 2019-12-01

- Added loading states for operations taking more than 1 second to complete.
- Handled network errors.
- Implemented some small UI tweaks.
- Fixed bugs:
    - [gh-7](https://github.com/NoelDeMartin/solid-focus/issues/7) Lists creation is broken in Offline mode

## [v0.2.0](https://github.com/NoelDeMartin/solid-focus/releases/tag/v0.2.0) - 2019-08-05

- Improved UX.
- Implemented the ability to edit and delete Workspaces, Lists and Tasks.
- Added Task scheduling and descriptions.
- Added markdown support for task names and descriptions.
- Added tasks sidepanel.
- Added [soukai](https://soukai.js.org/) dependency to manage data persistence.
- Improved documentation (including a schema of the RDF ontologies that have been used).
- Refactored [data schema](https://github.com/NoelDeMartin/solid-focus/tree/v0.2.0/docs#data-schema).

## [v0.1.1](https://github.com/NoelDeMartin/solid-focus/releases/tag/v0.1.1) - 2019-02-22

- Improved UX.
- Fixed bugs:
    - [gh-1](https://github.com/NoelDeMartin/solid-focus/issues/1) Handle expired sessions
    - [gh-2](https://github.com/NoelDeMartin/solid-focus/issues/2) solid-focus tries to load tasks from wrong resources
- Updated dependencies (Vue 2.6.6, Vuetify 1.5.1).
- Updated parsing of WebID profile according with [Solid specs](https://github.com/solid/solid-spec/blob/master/solid-webid-profiles.md#minimum-recommended-profile-information) (dropped support for vcard fields).
- Task id generation moved to the client.

## [v0.1.0](https://github.com/NoelDeMartin/solid-focus/releases/tag/v0.1.0) - 2018-12-25

- First version of the app.
- Workspaces, Lists and Tasks management.
- Login with Solid and for offline use (using localStorage).
