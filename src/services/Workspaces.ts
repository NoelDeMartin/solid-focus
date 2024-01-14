import { facade } from '@noeldemartin/utils';
import { trackModelCollection } from '@aerogel/plugin-soukai';

import Workspace from '@/models/Workspace';

import Service from './Workspaces.state';

export class WorkspacesService extends Service {

    public open(workspace: Workspace): void {
        this.currentWorkspaceId = workspace.id;
    }

    protected async boot(): Promise<void> {
        await trackModelCollection(Workspace, {
            service: this,
            property: 'workspaces',
        });
    }

}

export default facade(new WorkspacesService());
