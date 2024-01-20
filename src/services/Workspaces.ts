import { facade } from '@noeldemartin/utils';
import { Router } from '@aerogel/plugin-routing';
import { trackModelCollection } from '@aerogel/plugin-soukai';
import { watchEffect } from 'vue';

import Workspace from '@/models/Workspace';

import Service from './Workspaces.state';

export class WorkspacesService extends Service {

    public async open(workspace?: Workspace): Promise<boolean> {
        workspace ??= this.all[0];

        if (!workspace) {
            return false;
        }

        await Router.push({
            name: 'workspace',
            params: {
                workspace: workspace.slug,
                list: '',
            },
        });

        return true;
    }

    public async openLastVisited(): Promise<boolean> {
        const workspace = this.all.find((model) => model.id === this.lastVisitedWorkspaceId);

        if (!workspace) {
            return false;
        }

        return await this.open(workspace);
    }

    protected async boot(): Promise<void> {
        await trackModelCollection(Workspace, {
            service: this,
            property: 'all',
        });

        watchEffect(() => (this.lastVisitedWorkspaceId = this.current?.id ?? this.lastVisitedWorkspaceId));
    }

}

export default facade(new WorkspacesService());
