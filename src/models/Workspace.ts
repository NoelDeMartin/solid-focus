import List from '@/models/List';

export default class Workspace<L=List> {

    public name: string;
    public lists: L[];
    public activeList: L | null;

    constructor(name: string, lists: L[] = [], activeList: L | null = null) {
        this.name = name;
        this.lists = lists;
        this.activeList = activeList;
    }

    public setActiveList(list: L): void {
        this.activeList = list;
    }

}
