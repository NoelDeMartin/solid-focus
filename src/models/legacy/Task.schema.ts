import { FieldType } from 'soukai';
import { defineSolidModelSchema } from 'soukai-solid';

export default defineSolidModelSchema({
    rdfContexts: {
        lifecycle: 'http://purl.org/vocab/lifecycle/schema#',
        cal: 'http://www.w3.org/2002/12/cal/ical#',
        purl: 'http://purl.org/dc/terms/',
    },
    rdfsClass: 'lifecycle:Task',
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
        important: {
            rdfProperty: 'cal:priority',
            type: FieldType.Boolean,
        },
        dueDate: {
            rdfProperty: 'cal:due',
            type: FieldType.Date,
        },
        completedAt: {
            rdfProperty: 'cal:completed',
            type: FieldType.Date,
        },
        createdAt: {
            rdfProperty: 'purl:created',
            type: FieldType.Date,
        },
        updatedAt: {
            rdfProperty: 'purl:modified',
            type: FieldType.Date,
        },
    },
});
