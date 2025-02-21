import { FieldType } from 'soukai';
import { defineSolidModelSchema } from 'soukai-solid';

export const STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
export const STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

export default defineSolidModelSchema({
    rdfsClasses: ['Action', 'ical:Vtodo'],
    rdfContexts: {
        default: 'https://schema.org/',
        ical: 'http://www.w3.org/2002/12/cal/ical#',
    },
    history: true,
    tombstone: false,
    fields: {
        name: {
            type: FieldType.String,
            required: true,
            alias: '_summary',
        },
        description: FieldType.String,
        status: {
            type: FieldType.Key,
            rdfProperty: 'actionStatus',
        },
        priority: {
            type: FieldType.Number,
            rdfProperty: 'ical:priority',
        },
        dueDate: {
            type: FieldType.Date,
            rdfProperty: 'ical:due',
        },
        completedAt: {
            type: FieldType.Date,
            rdfProperty: 'ical:completed',
        },
        _summary: {
            type: FieldType.String,
            rdfProperty: 'ical:summary',
        },
    },
    hooks: {
        beforeSave() {
            this.setAttribute('status', this.getAttribute('completedAt') ? STATUS_COMPLETED : STATUS_POTENTIAL);
        },
    },
});
