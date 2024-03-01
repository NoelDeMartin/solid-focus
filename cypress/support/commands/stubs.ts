export function createStubs(open: boolean = true): void {
    cy.model('Workspace').then(async (Workspace) => {
        const main = await Workspace.create({ name: 'Main' });

        await main.relatedTasks.create({ name: 'Learn Typescript' }).then((task) => task.toggle());
        await main.relatedTasks.create({ name: 'Learn Vue' }).then((task) => task.toggle());
        await main.relatedTasks.create({ name: 'Learn TailwindCSS' }).then((task) => task.toggle());
        await main.relatedTasks.create({ name: 'Learn Aerogel' });
    });

    cy.model('Workspace').then(async (Workspace) => {
        const household = await Workspace.create({ name: 'Household' });
        const groceries = await household.relatedLists.create({ name: 'Groceries' });
        const recipes = await household.relatedLists.create({ name: 'Recipes' });

        await household.relatedTasks.create({ name: 'Clean room' });
        await household.relatedTasks.create({ name: 'Clean Neko\'s litter box' }).then((task) => task.toggle());

        await groceries.relatedTasks.create({ name: 'Chickpeas' });
        await groceries.relatedTasks.create({ name: 'Tomatoes' });
        await groceries.relatedTasks.create({ name: 'Nuts' });

        await recipes.relatedTasks.create({ name: 'Ramen' });
        await recipes.relatedTasks.create({ name: 'Pizza' }).then((task) => task.toggle());
        await recipes.relatedTasks.create({ name: 'Baba Ganoush' }).then((task) => task.toggle());
    });

    cy.model('Workspace').then(async (Workspace) => {
        const japanese = await Workspace.create({ name: 'Japanese' });
        const manga = await japanese.relatedLists.create({ name: 'Manga' });

        await japanese.relatedTasks.create({ name: 'Learn Hiragana' }).then((task) => task.toggle());
        await japanese.relatedTasks.create({ name: 'Learn Katakana' }).then((task) => task.toggle());
        await japanese.relatedTasks.create({ name: 'Learn Heisig Kanji' });

        await manga.relatedTasks.create({ name: 'Read One Piece' });
        await manga.relatedTasks.create({ name: 'Read Yotsubato' }).then((task) => task.toggle());
    });

    if (open) {
        cy.model('Workspace').then((Workspace) => Workspace.all().then((workspaces) => workspaces[0].open()));
    }
}
