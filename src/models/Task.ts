import Model from './Task.schema';

export default class Task extends Model {

    public static readonly STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
    public static readonly STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

    public isCompleted(): boolean {
        return !!this.completedAt;
    }

    public async toggle(): Promise<void> {
        if (this.isCompleted()) {
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

}
