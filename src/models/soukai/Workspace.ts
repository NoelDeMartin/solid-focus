import { FieldType, MultipleModelsRelation, Attributes, Model } from 'soukai';
import { SolidModel } from 'soukai-solid';

import List, { ListJson } from '@/models/soukai/List';

export interface WorkspaceJson {
    id: any;
    name: string;
    lists: ListJson[];
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

    public static classFields = ['activeList'];

    public static fromJson(json: WorkspaceJson): Workspace {
        const workspace = new Workspace(
            {
                url: json.id,
                name: json.name,
            },
            true,
        );

        workspace.setRelation('lists', json.lists.map(listJson => List.fromJson(listJson)));

        for (const list of workspace.lists!) {
            list.setRelation('workspace', workspace);
        }

        return workspace;
    }

    public inbox: List;

    public lists?: List[];

    public activeList: List;

    public constructor(attributes?: Attributes, exists?: boolean) {
        super(attributes, exists);

        const inbox = new List({ url: this.url, name: 'Inbox' });

        inbox.setRelation('workspace', this);

        this.inbox = inbox;
        this.activeList = inbox;
    }

    public async save<T extends Model>(containerUrl?: string): Promise<T> {
        const model = await super.save<T>(containerUrl);

        if (!this.inbox.exists()) {
            this.inbox.setAttribute('url', this.url);
            this.inbox.setExists(true);
        }

        return model;
    }

    public setActiveList(list: List): void {
        this.activeList = list;
    }

    public listsRelationship(): MultipleModelsRelation {
        return this.contains(List);
    }

    public toJson(): WorkspaceJson {
        return {
            id: this.url,
            name: this.name,
            lists: this.isRelationLoaded('lists')
                ? this.lists!.map((list: List) => list.toJson())
                : [],
        };
    }

}
