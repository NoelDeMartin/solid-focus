import Task from '@/models/Task';
import BaseList from '@/models/List';
import Workspace from '@/models/solid/Workspace';

export default class List extends BaseList<Workspace> {

    public readonly url: string | null;

    constructor(
        name: string,
        tasks: Task[],
        url: string | null,
    ) {
        super(name, tasks);

        this.url = url;
    }

}
