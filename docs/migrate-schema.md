# Migrate schema

If you were using an old version of the app, it's likely that you've come across a message telling you that you should migrate to a new format.

This is important in order to improve compatibility with other apps, and it should also improve the overall stability of the app. I'm still supporting the old format for backwards compatibility, but it's more likely that bugs sneak in without noticing.

If you want to understand what I mean with "compatibility with other apps", I gave a presentation that should help you learn more: [Interoperable Serendipity](https://noeldemartin.com/solid-world-2025).

If you're already familiar with Solid and RDF, and you're curious to see what has changed in the schema, you can check out these files:

-   [New tasks schema](../src/models/Task.schema.ts)
-   [Legacy tasks schema](../src/models/legacy/LegacyTask.schema.ts)
