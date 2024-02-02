import { FieldType } from 'soukai';
import { defineSolidModelSchema } from 'soukai-solid';

export default defineSolidModelSchema({
    fields: {
        name: {
            type: FieldType.String,
            required: true,
        },
        completedAt: FieldType.Date,
    },
});
