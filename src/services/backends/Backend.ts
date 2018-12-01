
import List from '@/models/List';
import Task from '@/models/Task';
import User from '@/models/users/User';
import Workspace from '@/models/Workspace';

export default abstract class Backend<U=User> {

    public abstract loadWorkspaces(user: U): Promise<Workspace[]>;

    public abstract unloadWorkspaces(): Promise<void>;

    public abstract createWorkspace(...args: any[]): Promise<Workspace>;

    public abstract createList(workspace: Workspace, ...args: any[]): Promise<List>;

    public abstract createTask(list: List, ...args: any[]): Promise<Task>;

    public abstract toggleTask(task: Task): Promise<void>;

}
