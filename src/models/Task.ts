import Model from './Task.schema';

export default class Task extends Model {

    public isCompleted(): boolean {
        return !!this.completedAt;
    }

    public async toggle(): Promise<void> {
        await this.update({ completedAt: this.isCompleted() ? null : new Date() });
    }

}
