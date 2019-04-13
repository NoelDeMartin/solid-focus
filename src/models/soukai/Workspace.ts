import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

import List, { ListJson } from '@/models/soukai/List';

export interface WorkspaceJson {
    id: any;
    name: string;
    lists: ListJson[];
}

interface HasActiveList {
    activeList: List;
}

export default class Workspace extends SolidModel {

    public static ldpContainer = true;

    public static rdfContexts = {
        'lifecycle': 'http://purl.org/vocab/lifecycle/schema#',
    };

    public static rdfsClasses = ['lifecycle:TaskGroup'];

    public static fields = {
        name: FieldType.String,
    };

    public static fromJson(json: WorkspaceJson): Workspace {
        const workspace = new Workspace(
            {
                url: json.id,
                name: json.name,
            },
            true,
        );

        workspace.lists = json.lists.map(listJson => List.fromJson(listJson));

        if (workspace.lists.length > 0) {
            workspace.activeList = workspace.lists[0];
        }

        return workspace;
    }

    public lists: List[] = [];
    public activeList: List | null = null;

    public loaded: boolean = false;
    public loading: boolean = false;

    public hasActiveList(): this is HasActiveList {
        return !!this.activeList;
    }

    public setActiveList(list: List): void {
        this.activeList = list;
    }

    public addList(list: List): void {
        this.lists.push(list);
    }

    public toJson(): WorkspaceJson {
        return {
            id: this.url,
            name: this.name,
            lists: this.lists.map(list => list.toJson()),
        };
    }

}
