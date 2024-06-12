import { translate } from '@aerogel/core';

import Workspace from '@/models/Workspace';
import type TasksList from '@/models/TasksList';

export function listName(list: TasksList): string | undefined {
    return list instanceof Workspace ? translate('lists.inbox') : list.name;
}
