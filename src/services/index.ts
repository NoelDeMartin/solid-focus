import { required } from '@noeldemartin/utils';

import { listName, workspaceName } from '@/utils/display';

import Focus from './Focus';
import Tasks from './Tasks';
import TasksLists from './TasksLists';
import Workspaces from './Workspaces';

export const globals = {
    $workspace: required(() => Workspaces.current, 'Current workspace is missing, can\'t use $workspace'),
    $tasksList: required(() => TasksLists.current, 'Current tasks list is missing, can\'t use $tasksList'),
    $listName: listName,
    $workspaceName: workspaceName,
};

export const services = {
    $focus: Focus,
    $tasks: Tasks,
    $tasksLists: TasksLists,
    $workspaces: Workspaces,
};

export type AppGlobals = typeof globals;
export type AppServices = typeof services;

declare module 'vue' {
    interface ComponentCustomProperties extends AppGlobals, AppServices {}
}
