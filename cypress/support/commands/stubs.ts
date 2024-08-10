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

        await groceries.relatedTasks.create({ name: 'Bananas' });
        await groceries.relatedTasks.create({ name: 'Orange juice' });
        await groceries.relatedTasks.create({ name: 'Whole grain bread' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Fresh apples and pears' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Baby carrots' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Red and green grapes' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Peanut butter' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Cucumber' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Fresh strawberries' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Almond milk' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Romaine lettuce' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Mixed berries (frozen)' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Broccoli florets' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Whole grain pasta' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Fresh tomatoes' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Rolled oats' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Bell peppers (variety pack)' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Fresh basil leaves' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Canned black beans' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Brown rice' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Fresh oranges and lemons' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Canned tomatoes' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Baby spinach' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Mixed nuts' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Fresh garlic and onions' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Avocado' }).then((task) => task.toggle());
        await groceries.relatedTasks
            .create({ name: 'Fresh blueberries and raspberries' })
            .then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Zucchini and squash' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Whole wheat tortillas' }).then((task) => task.toggle());
        await groceries.relatedTasks.create({ name: 'Applesauce (unsweetened)' }).then((task) => task.toggle());

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
