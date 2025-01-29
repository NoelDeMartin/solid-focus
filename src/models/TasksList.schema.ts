import { defineSolidContainerSchema, solidContainerFields } from 'soukai-solid';

export const tasksListFields = solidContainerFields;

export default defineSolidContainerSchema({
    fields: tasksListFields,
    history: true,
    timestamps: true,
});
