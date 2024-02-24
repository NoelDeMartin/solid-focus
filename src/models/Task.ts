import { Cloud } from '@aerogel/plugin-offline-first';
import type { Attributes } from 'soukai';

import Model from './Task.schema';

export default class Task extends Model {

    public static readonly STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
    public static readonly STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

    public isCompleted(): boolean {
        return this.status === Task.STATUS_COMPLETED;
    }

    public async toggle(): Promise<void> {
        if (this.isCompleted()) {
            await this.updateAndSync({
                status: Task.STATUS_POTENTIAL,
                completedAt: null,
            });

            return;
        }

        await this.updateAndSync({
            status: Task.STATUS_COMPLETED,
            completedAt: new Date(),
        });
    }

    public async updateAndSync(attributes: Attributes): Promise<void> {
        await this.update(attributes);
        await Cloud.syncIfOnline(this);
    }

}
