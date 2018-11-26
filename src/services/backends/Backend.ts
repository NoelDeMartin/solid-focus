import Vue from 'vue';

import Service from '@/services/Service';

import List from '@/models/List';
import User from '@/models/User';
import Task from '@/models/Task';
import Workspace from '@/models/Workspace';

export default abstract class Backend<U=User> extends Service {

    constructor(app: Vue, user: U) {
        super(app, user);
    }

    public async init(user: U): Promise<void> {
        await super.init();
        await this.loadUserWorkspaces(user);
    }

    public abstract createWorkspace(...args: any[]): Promise<Workspace>;

    public abstract createList(workspace: Workspace, ...args: any[]): Promise<List>;

    public abstract createTask(list: List, ...args: any[]): Promise<Task>;

    protected abstract loadUserWorkspaces(user: U): Promise<void>;

}
