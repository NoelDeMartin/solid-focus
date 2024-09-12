import type { Attributes } from 'soukai';

import Model from './Task.schema';

export default class Task extends Model {

    public static readonly STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
    public static readonly STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

    public get completed(): boolean {
        return this.status === Task.STATUS_COMPLETED;
    }

    public async toggle(): Promise<void> {
        if (this.completed) {
            await this.update({
                status: Task.STATUS_POTENTIAL,
                completedAt: null,
            });

            return;
        }

        await this.update({
            status: Task.STATUS_COMPLETED,
            completedAt: new Date(),
        });
    }

    protected initializeAttributes(attributes: Attributes, exists: boolean): void {
        if (exists && !('name' in attributes)) {
            attributes.name = attributes.description ?? 'Unknown';

            delete attributes.description;
        }

        super.initializeAttributes(attributes, exists);
    }

}
