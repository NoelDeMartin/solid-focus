import BaseWorkspaces from '@/services/Workspaces';

import { User } from '@/services/Auth';

export default class Workspaces extends BaseWorkspaces {

    public async create(name: string): Promise<void> {
        // TODO
    }

    protected async loadUserWorkspaces(user: User): Promise<void> {
        // TODO
    }

}
