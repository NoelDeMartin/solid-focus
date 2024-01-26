import { defineRouteBindings, defineRoutes } from '@aerogel/plugin-routing';

import Workspaces from '@/services/Workspaces';
import type TasksList from '@/models/TasksList';
import type WorkspaceModel from '@/models/Workspace';

import Onboarding from './Onboarding.vue';
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
        name: 'onboarding',
        path: '/',
        component: Onboarding,
        beforeEnter: () => Workspaces.open(),
    },
    {
        name: 'workspace',
        path: '/:workspace/:list?',
        component: Workspace,
    },
]);
