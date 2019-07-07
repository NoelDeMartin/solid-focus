import { FieldType, MultiModelRelation, Attributes, Model } from 'soukai';
import { SolidModel } from 'soukai-solid';

import List from '@/models/soukai/List';

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

    public inbox: List;

    public lists?: List[];

    public activeList: List;

    public constructor(attributes?: Attributes, exists?: boolean) {
        super(attributes, exists);

        const inbox = new List({ url: this.url, name: 'Inbox' });

        inbox.editable = false;
        inbox.setRelationModels('workspace', this);

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

    public listsRelationship(): MultiModelRelation {
        return this.contains(List);
    }

}
