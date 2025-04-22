import { defineSolidContainerSchema } from 'soukai-solid';
import { FieldType } from 'soukai';

import TasksList from '@/models/TasksList';
import { tasksListFields } from '@/models/TasksList.schema';

export default defineSolidContainerSchema(TasksList, {
    rdfContexts: {
        tasks: 'https://schema.org/',
    },
    fields: {
        color: {
            type: FieldType.String,
            rdfProperty: 'schema:color',
        },
        ...tasksListFields,
    },
});
