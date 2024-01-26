import { FieldType, defineModelSchema } from 'soukai';

export default defineModelSchema({
    fields: {
        name: FieldType.String,
        listIds: {
            type: FieldType.Array,
            items: FieldType.Key,
            required: true,
        },
    },
});
