import List, { ListJson } from '@/models/soukai/List';

export interface WorkspaceJson {
    id: any;
    name: string;
    lists: ListJson[];
}

interface HasActiveList {
    activeList: List;
}

export default class Workspace {

    public static fromJson(json: WorkspaceJson): Workspace {
        const lists = json.lists.map(listJson => List.fromJson(listJson));

        return new Workspace(
            json.id,
            json.name,
            lists,
            lists.length > 0 ? lists[0] : null,
        );
    }

    public id: any;
    public name: string;
    public lists: List[];
    public activeList: List | null;

    public loaded: boolean = false;
    public loading: boolean = false;

    constructor(id: any, name: string, lists: List[] = [], activeList: List | null = null) {
        this.id = id;
        this.name = name;
        this.lists = lists;
        this.activeList = activeList;
    }

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
            id: this.id,
            name: this.name,
            lists: this.lists.map(list => list.toJson()),
        };
    }

}
