import { FieldType, defineModelSchema } from 'soukai';

export default defineModelSchema({
    fields: {
        name: FieldType.String,
        taskIds: {
            type: FieldType.Array,
            items: FieldType.Key,
        },
    },
});
