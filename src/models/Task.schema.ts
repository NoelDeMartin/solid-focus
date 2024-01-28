import { FieldType, defineModelSchema } from 'soukai';

export default defineModelSchema({
    fields: {
        name: {
            type: FieldType.String,
            required: true,
        },
        completedAt: FieldType.Date,
    },
});
