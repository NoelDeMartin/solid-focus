import { FieldType, MultiModelRelation, Attributes, Model } from 'soukai';
import { SolidModel } from 'soukai-solid';

import List from '@/models/soukai/List';

import { decorate } from '@/utils/decorators';
import Storage from '@/utils/Storage';

export default class Workspace extends SolidModel {

    public static ldpContainer = true;

    public static rdfContexts = {
        'lifecycle': 'http://purl.org/vocab/lifecycle/schema#',
    };

    public static rdfsClasses = ['lifecycle:TaskGroup'];

    public static fields = {
        name: {
            type: FieldType.String,
            rdfProperty: 'rdfs:label',
            required: true,
        },
    };

    public static classFields = ['inbox', 'activeList'];

    public inbox!: List;

    public lists?: List[];

    public activeList!: List;

    public setActiveList(list: List): void {
        this.activeList = list;

        Storage.set('activeListId', list.id);
    }

    public listsRelationship(): MultiModelRelation {
        return this.contains(List);
    }

    public async save<T extends Model>(containerUrl?: string): Promise<T> {
        const model = await super.save<T>(containerUrl);

        if (!this.inbox.exists()) {
            const list = (await List.find<List>(this.url))!;

            list.setRelationModels('tasks', []);

            this.setInbox(list);
        }

        return model;
    }

    protected initialize(attributes: Attributes, exists: boolean): void {
        super.initialize(attributes, exists);

        const list = new List(this.getAttributes(), false);

        list.setRelationModels('tasks', []);

        this.setInbox(list);

        if (this.exists()) {
            this.updateInbox();
        }
    }

    private async updateInbox(): Promise<void> {
        const list = await List.find<List>(this.getAttribute('url'));

        this.setInbox(list!);
    }

    private setInbox(list: List): void {
        const inbox = decorate(list, {
            getters: {
                name: () => 'Inbox',
            },
        });

        inbox.editable = false;
        inbox.setRelationModels('workspace', this);

        if (!this.activeList || this.activeList === this.inbox) {
            this.activeList = inbox;
        }

        this.inbox = inbox;
    }

}
