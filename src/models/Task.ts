import Model from './Task.schema';

export default class Task extends Model {

    public static readonly STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
    public static readonly STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

    public get completed(): boolean {
        return !!this.completedAt;
    }

    public async toggle(): Promise<void> {
        if (this.completed) {
            await this.update({ completedAt: null });

            return;
        }

        await this.update({ completedAt: new Date() });
    }

    protected async beforeSave(): Promise<void> {
        if (this.exists() && !this.name) {
            this.name = this.description ?? 'Unknown';

            delete this.description;
        }

        this.status ??= this.completedAt ? Task.STATUS_COMPLETED : Task.STATUS_POTENTIAL;

        await super.beforeSave();
    }

}
