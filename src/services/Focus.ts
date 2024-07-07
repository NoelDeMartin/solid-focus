import { facade } from '@noeldemartin/utils';

import Service from './Focus.state';

export class FocusService extends Service {

    public toggleCompleted(): void {
        this.showCompleted = !this.showCompleted;
    }

    protected async boot(): Promise<void> {
        this.visits++;
    }

}

export default facade(FocusService);
