import List from '@/models/soukai/List';
import Task from '@/models/soukai/Task';
import Workspace from '@/models/soukai/Workspace';

export interface WorkspaceJson {
    id: any;
    name: string;
    lists: ListJson[];
}

export interface ListJson {
    id: any;
    name: string;
    tasks: TaskJson[];
}

export interface TaskJson {
    id: any;
    name: string;
    completedAt?: number;
}

export function restoreWorkspace(json: WorkspaceJson): Workspace {
    const workspace = new Workspace(
        {
            url: json.id,
            name: json.name,
        },
        true,
    );

    workspace.setRelation('lists', json.lists.map(restoreList));

    for (const list of workspace.lists!) {
        list.setRelation('workspace', workspace);
    }

    return workspace;
}

export function serializeWorkspace(workspace: Workspace): WorkspaceJson {
    return {
        id: workspace.url,
        name: workspace.name,
        lists: workspace.isRelationLoaded('lists')
            ? workspace.lists!.map(serializeList)
            : [],
    };
}

export function restoreList(json: ListJson): List {
    const list = new List(
        {
            url: json.id,
            name: json.name,
        },
        true,
    );

    list.setRelation('tasks', json.tasks.map(restoreTask));

    return list;
}

export function serializeList(list: List): ListJson {
    return {
        id: list.url,
        name: list.name,
        tasks: list.isRelationLoaded('tasks')
            ? list.tasks!.map(serializeTask)
            : [],
    };
}

export function restoreTask(json: TaskJson): Task {
    return new Task(
        {
            url: json.id,
            name: json.name,
            completedAt: json.completedAt ? new Date(json.completedAt) : null,
        },
        true,
    );
}

export function serializeTask(task: Task): TaskJson {
    const json: TaskJson = {
        id: task.url,
        name: task.name,
    };

    if (task.completedAt) {
        json.completedAt = task.completedAt.getTime();
    }

    return json;
}
