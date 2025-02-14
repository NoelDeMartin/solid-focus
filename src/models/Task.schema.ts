import { FieldType } from 'soukai';
import { defineSolidModelSchema } from 'soukai-solid';

export const STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
export const STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

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
        important: {
            rdfProperty: 'tasks:important',
            type: FieldType.Boolean,
        },
        dueDate: {
            rdfProperty: 'tasks:dueDate',
            type: FieldType.Date,
        },
        completedAt: {
            rdfProperty: 'tasks:completedAt',
            type: FieldType.Date,
        },
    },
    hooks: {
        beforeSave() {
            this.setAttribute('status', this.getAttribute('completedAt') ? STATUS_COMPLETED : STATUS_POTENTIAL);
        },
    },
});
