import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

export default class Task extends SolidModel {

    public static rdfContexts = {
        'lifecycle': 'http://purl.org/vocab/lifecycle/schema#',
        'prov': 'https://www.w3.org/ns/prov#',
        'provenance': 'http://purl.org/net/provenance/ns#',
        'dc': 'http://purl.org/dc/terms/',
    };

    public static rdfsClasses = ['lifecycle:Task', 'prov:Activity'];

    public static fields = {
        name: {
            type: FieldType.String,
            required: true,
        },
        description: {
            type: FieldType.String,
            rdfProperty: 'dc:description',
        },
        completedAt: {
            type: FieldType.Date,
            rdfProperty: 'provenance:completedAt',
        },
    };

    get completed(): boolean {
        return !!this.completedAt;
    }

    public toggle(): void {
        if (this.completed) {
            delete this.completedAt;
        } else {
            this.completedAt = new Date;
        }
    }

}
