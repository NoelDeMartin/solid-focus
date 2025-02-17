import Model from './Task.schema';

export default class Task extends Model {

    public get completed(): boolean {
        return !!this.completedAt;
    }

    public get important(): boolean {
        return !!this.priority;
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

        await super.beforeSave();
    }

}
