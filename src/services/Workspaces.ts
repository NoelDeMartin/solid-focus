import { facade } from '@noeldemartin/utils';
import { trackModelCollection } from '@aerogel/plugin-soukai';

import Workspace from '@/models/Workspace';

import Service from './Workspaces.state';

export class WorkspacesService extends Service {

    public async open(workspace: Workspace): Promise<void> {
        await workspace.loadRelationIfUnloaded('lists');

        this.currentWorkspaceId = workspace.id;
    }

    protected async boot(): Promise<void> {
        await trackModelCollection(Workspace, {
            service: this,
            property: 'workspaces',
        });

        this.current && (await this.open(this.current));
    }

}

export default facade(new WorkspacesService());
