import { Component, AsyncComponent } from 'vue';
import { Store } from 'vuex';

import Service from '@/services/Service';

import Arr from '@/utils/Arr';
import UUIDGenerator from '@/utils/UUIDGenerator';

import Alert from '@/dialogs/Alert.vue';
import Loading from '@/dialogs/Loading.vue';

interface State {
    dialogs: Dialog[];
}

export enum Layout {
    Mobile = 'mobile',
    Tablet = 'tablet',
    Desktop = 'desktop',
}

export interface Dialog {
    id: number;
    component: Component | AsyncComponent;
    props: { [property: string]: any };

    reject(...args: any[]): void,
    resolve(...args: any[]): void,
}

export default class UI extends Service {

    private loadingDialogID: number | null = null;

    public get layout(): Layout {
        return this.mobile ? Layout.Mobile : null
            || this.tablet ? Layout.Tablet : null
            || Layout.Desktop;
    }

    public get mobile(): boolean {
        return this.app.$vuetify.breakpoint.xs;
    }

    public get tablet(): boolean {
        return this.app.$vuetify.breakpoint.sm;
    }

    public get desktop(): boolean {
        return this.app.$vuetify.breakpoint.mdAndUp;
    }

    public get dialogs(): Dialog[] {
        return this.app.$store.state.ui.dialogs;
    }

    public get mobileBreakpoint(): number {
        return 600;
    }

    public showLoading(message: string | null = null): void {
        if (this.loadingDialogID === null) {
            this.openDialog(Loading, message ? { message } : {});
            this.loadingDialogID = Arr.last(this.dialogs).id;
        }
    }

    public hideLoading(): void {
        if (this.loadingDialogID !== null) {
            this.completeDialog(this.loadingDialogID);
            this.loadingDialogID = null;
        }
    }

    public openDialog(
        component: Component | AsyncComponent,
        props: { [property: string]: any } = {},
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            const dialog: Dialog = {
                id: UUIDGenerator.generate(),
                component,
                props,
                resolve,
                reject,
            };

            this.app.$store.commit('addDialog', dialog);
        });
    }

    public closeDialog(id: number, ...args: any[]): void {
        for (const dialog of this.dialogs) {
            if (dialog.id === id) {
                dialog.reject(...args);
                break;
            }
        }

        this.app.$store.commit('removeDialog', id);
    }

    public completeDialog(id: number, ...args: any[]): void {
        for (const dialog of this.dialogs) {
            if (dialog.id === id) {
                dialog.resolve(...args);
                break;
            }
        }

        this.app.$store.commit('removeDialog', id);
    }

    public async wrapAsyncOperation(
        operation: Promise<any>,
        message: string | null = null
    ): Promise<any> {
        this.showLoading(message);

        try {
            const result = await operation;

            this.hideLoading();

            return result;
        } catch (e) {
            this.hideLoading();

            this.openDialog(Alert, {
                type: 'error',
                message: e.message || 'Unknown Error',
            });
        }
    }

    protected registerStoreModule(store: Store<State>): void {
        store.registerModule('ui', {
            state: {
                dialogs: [],
            },
            mutations: {
                addDialog(state: State, dialog: Dialog) {
                    state.dialogs.push(dialog);
                },
                removeDialog(state: State, id: number) {
                    for (const dialog of state.dialogs) {
                        if (dialog.id === id) {
                            state.dialogs.splice(state.dialogs.indexOf(dialog), 1);
                            break;
                        }
                    }
                },
            },
        });
    }

    protected unregisterStoreModule(store: Store<State>): void {
        store.unregisterModule('ui');
    }

}
