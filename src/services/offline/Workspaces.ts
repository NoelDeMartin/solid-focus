import BaseWorkspaces from '@/services/Workspaces';

import Workspace from '@/models/Workspace';
import List from '@/models/List';
import User from '@/models/User';

import Storage from '@/utils/Storage';

export default class Workspaces extends BaseWorkspaces {

    public async create(name: string): Promise<Workspace> {
        const inbox = new List('Inbox');
        const workspace = new Workspace(name, [inbox], inbox);

        this.addWorkspace(workspace);

        Storage.set('workspaces', this.all);

        return workspace;
    }

    protected async init(): Promise<void> {
        await super.init();

        const workspaces = Storage.get('workspaces');

        if (workspaces !== null) {
            this.initWorkspaces(workspaces);
        }
    }

    protected async loadUserWorkspaces(user: User): Promise<void> {
        // nothing to do here
    }

}
