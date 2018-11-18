import List from '@/models/List';
import BaseWorkspace from '@/models/Workspace';

export default class Workspace extends BaseWorkspace<List> {

    public readonly url: string;

    constructor(
        name: string,
        lists: List[] = [],
        activeList: List | null = null,
        url: string,
    ) {
        super(name, lists, activeList);

        this.url = url;
    }

}
