import { defineRouteBindings, defineRoutes } from '@aerogel/plugin-routing';

import Workspaces from '@/services/Workspaces';
import { listName } from '@/utils/display';
import type TasksList from '@/models/TasksList';
import type WorkspaceModel from '@/models/Workspace';

import Landing from './landing/Landing.vue';
import Workspace from './workspace/Workspace.vue';

export const bindings = defineRouteBindings({
    workspace(slug) {
        return Workspaces.all.find((model) => model.slug === slug) ?? null;
    },
    async list(slug, { workspace }: { workspace?: WorkspaceModel }) {
        const lists = await workspace?.loadRelationIfUnloaded<TasksList[]>('lists');

        return lists?.find((model) => model.slug === slug);
    },
});

export const routes = defineRoutes([
    {
        name: 'landing',
        path: '/',
        component: Landing,
        beforeEnter: () => Workspaces.open(),
    },
    {
        name: 'workspace',
        path: '/:workspace/:list?',
        component: Workspace,
        title(params) {
            const { workspace, list } = params as { list?: TasksList; workspace: WorkspaceModel };

            return listName(list ?? workspace);
        },
    },
]);
