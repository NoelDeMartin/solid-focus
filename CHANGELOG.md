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
