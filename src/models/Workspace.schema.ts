import { defineSolidModelSchema } from 'soukai-solid';
import { FieldType } from 'soukai';

import TasksList from '@/models/TasksList';

export default defineSolidModelSchema(TasksList, {
    rdfContexts: {
        tasks: 'https://vocab.noeldemartin.com/tasks/',
    },
    fields: {
        color: {
            type: FieldType.String,
            rdfProperty: 'tasks:color',
        },
        ...TasksList.fields,
    },
});
