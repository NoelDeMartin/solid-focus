import List, { ListJson } from '@/models/List';

export interface WorkspaceJson {
    id: any;
    name: string;
    lists: ListJson[];
}

export default class Workspace {

    public static fromJson(json: WorkspaceJson): Workspace {
        return new Workspace(
            json.id,
            json.name,
            json.lists.map(listJson => List.fromJson(listJson)),
        );
    }

    public id: any;
    public name: string;
    public lists: List[];
    public activeList: List | null;

    constructor(id: any, name: string, lists: List[] = [], activeList: List | null = null) {
        this.id = id;
        this.name = name;
        this.lists = lists;
        this.activeList = activeList;
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
