import BaseWorkspaces from '@/services/Workspaces';

import { User } from '@/services/Auth';

import Storage from '@/utils/Storage';

export default class Workspaces extends BaseWorkspaces {

    public async create(name: string): Promise<void> {
        this.addWorkspace({ name });
        Storage.set('workspaces', this.workspaces);
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
