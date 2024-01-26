import { required } from '@noeldemartin/utils';

import Workspaces from './Workspaces';
import TasksLists from './TasksLists';

export const globals = {
    $workspace: required(() => Workspaces.current, 'Current workspace is missing, can\'t use $workspace'),
    $tasksList: required(() => TasksLists.current, 'Current tasks list is missing, can\'t use $tasksList'),
};

export const services = {
    $workspaces: Workspaces,
    $tasksLists: TasksLists,
};

export type AppGlobals = typeof globals;
export type AppServices = typeof services;

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties extends AppGlobals, AppServices {}
}
