import { facade } from '@noeldemartin/utils';
import { markRaw } from 'vue';

import Service from './Focus.state';
import type { FooterAnimation } from './Focus.state';

export class FocusService extends Service {

    public toggleCompleted(): void {
        this.showCompleted = !this.showCompleted;
    }

    public setFooterAnimation(animation: FooterAnimation | null): void {
        this.footerAnimation = animation === null ? null : markRaw(animation);
    }

    protected async boot(): Promise<void> {
        this.visits++;
    }

}

export default facade(FocusService);
