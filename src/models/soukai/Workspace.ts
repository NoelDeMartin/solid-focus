import { FieldType, MultiModelRelation, Attributes, Model } from 'soukai';
import { SolidModel } from 'soukai-solid';

import List from '@/models/soukai/List';

import { decorate } from '@/utils/decorators';

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
    }

    public listsRelationship(): MultiModelRelation {
        return this.contains(List);
    }

    public async save<T extends Model>(containerUrl?: string): Promise<T> {
        const model = await super.save<T>(containerUrl);

        if (!this.inbox.exists()) {
            const list = (await List.find<List>(this.url))!;

            list.setRelationModels('tasks', []);

            this.setInbox(list, false);
        }

        return model;
    }

    protected initialize(attributes: Attributes, exists: boolean): void {
        super.initialize(attributes, exists);

        const list = new List(this.getAttributes(), false);

        list.setRelationModels('tasks', []);

        this.setInbox(list, true);

        if (this.exists()) {
            this.updateInbox();
        }
    }

    private async updateInbox(): Promise<void> {
        const list = await List.find<List>(this.getAttribute('url'));

        this.setInbox(list!, false);
    }

    private async setInbox(list: List, activate: boolean): Promise<void> {
        const activateInbox = activate || this.inbox === this.activeList;
        const inbox = decorate(list, {
            getters: {
                name: () => 'Inbox',
            },
        });

        inbox.editable = false;
        inbox.setRelationModels('workspace', this);

        if (activateInbox && !inbox.isRelationLoaded('tasks')) {
            await inbox.loadRelation('tasks');
        }

        this.inbox = inbox;

        if (activateInbox) {
            this.activeList = this.inbox;
        }
    }

}
