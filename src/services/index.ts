import { required } from '@noeldemartin/utils';
import { translate } from '@aerogel/core';

import Workspace from '@/models/Workspace';
import type TasksList from '@/models/TasksList';

import Focus from './Focus';
import TasksLists from './TasksLists';
import Workspaces from './Workspaces';

export const globals = {
    $workspace: required(() => Workspaces.current, 'Current workspace is missing, can\'t use $workspace'),
    $tasksList: required(() => TasksLists.current, 'Current tasks list is missing, can\'t use $tasksList'),

    $listName(list: TasksList): string | undefined {
        return list instanceof Workspace ? translate('lists.inbox') : list.name;
    },
};

export const services = {
    $focus: Focus,
    $tasksLists: TasksLists,
    $workspaces: Workspaces,
};

export type AppGlobals = typeof globals;
export type AppServices = typeof services;

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties extends AppGlobals, AppServices {}
}
