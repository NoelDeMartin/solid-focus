import List from '@/models/List';

export default class Workspace {

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

}
