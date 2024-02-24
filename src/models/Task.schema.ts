import { FieldType } from 'soukai';
import { defineSolidModelSchema } from 'soukai-solid';

export default defineSolidModelSchema({
    rdfContext: 'https://schema.org/',
    rdfContexts: {
        schema: 'https://schema.org/',
        tasks: 'https://vocab.noeldemartin.com/tasks/',
    },
    rdfsClass: 'Action',
    history: true,
    tombstone: false,
    fields: {
        name: {
            type: FieldType.String,
            required: true,
        },
        status: {
            rdfProperty: 'actionStatus',
            type: FieldType.Key,
        },
        completedAt: {
            rdfProperty: 'tasks:completedAt',
            type: FieldType.Date,
        },
    },
});
