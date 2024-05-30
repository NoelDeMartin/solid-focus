import { FieldType } from 'soukai';
import { defineSolidModelSchema } from 'soukai-solid';

export default defineSolidModelSchema({
    rdfsClass: 'schema:Action',
    rdfContexts: {
        tasks: 'https://vocab.noeldemartin.com/tasks/',
    },
    history: true,
    tombstone: false,
    fields: {
        name: {
            type: FieldType.String,
            required: true,
        },
        description: FieldType.String,
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
