import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

export interface TaskJson {
    id: any;
    name: string;
    completedAt?: number;
}

export default class Task extends SolidModel {

    public static rdfContexts = {
        'lifecycle': 'http://purl.org/vocab/lifecycle/schema#',
        'prov': 'https://www.w3.org/ns/prov#',
        'provenance': 'http://purl.org/net/provenance/ns#',
    };

    public static rdfsClasses = ['lifecycle:Task', 'prov:Activity'];

    public static fields = {
        name: FieldType.String,
        completedAt: {
            type: FieldType.Date,
            rdfProperty: 'provenance:completedAt',
        },
    };

    public static fromJson(json: TaskJson): Task {
        return new Task(
            {
                url: json.id,
                name: json.name,
                completedAt: json.completedAt ? new Date(json.completedAt) : null,
            },
            true,
        );
    }

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

    public toJson(): TaskJson {
        const json: TaskJson = {
            id: this.url,
            name: this.name,
        };

        if (this.completedAt) {
            json.completedAt = this.completedAt.getTime();
        }

        return json;
    }

}
