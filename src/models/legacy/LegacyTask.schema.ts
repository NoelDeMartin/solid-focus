import { FieldType } from 'soukai';
import { defineSolidModelSchema } from 'soukai-solid';

export default defineSolidModelSchema({
    rdfsClass: 'lifecycle:Task',
    rdfContexts: {
        lifecycle: 'http://purl.org/vocab/lifecycle/schema#',
        cal: 'http://www.w3.org/2002/12/cal/ical#',
        purl: 'http://purl.org/dc/terms/',
    },
    history: true,
    tombstone: false,
    defaultResourceHash: '',
    fields: {
        name: {
            type: FieldType.String,
            rdfProperty: 'rdfs:label',
            required: true,
        },
        description: {
            type: FieldType.String,
            rdfProperty: 'rdfs:comment',
        },
        priority: {
            rdfProperty: 'cal:priority',
            type: FieldType.Number,
        },
        dueDate: {
            rdfProperty: 'cal:due',
            type: FieldType.Date,
        },
        completedAt: {
            rdfProperty: 'cal:completed',
            type: FieldType.Date,
        },
        legacyCreatedAt: {
            rdfProperty: 'purl:created',
            type: FieldType.Date,
            alias: 'createdAt',
        },
        legacyUpdatedAt: {
            rdfProperty: 'purl:modified',
            type: FieldType.Date,
            alias: 'updatedAt',
        },
    },
});
