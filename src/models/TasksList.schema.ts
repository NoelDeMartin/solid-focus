import { FieldType, defineModelSchema } from 'soukai';

export default defineModelSchema({
    fields: {
        name: {
            type: FieldType.String,
            required: true,
        },
        taskIds: {
            type: FieldType.Array,
            items: FieldType.Key,
        },
    },
});
