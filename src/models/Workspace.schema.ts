import { FieldType } from 'soukai';
import { defineSolidModelSchema } from 'soukai-solid';

export default defineSolidModelSchema({
    fields: {
        name: FieldType.String,
        listUrls: {
            type: FieldType.Array,
            items: FieldType.Key,
            required: true,
        },
    },
});
