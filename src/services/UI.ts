import { Component, AsyncComponent } from 'vue';
import { Store } from 'vuex';

import Service from '@/services/Service';

import UUIDGenerator from '@/utils/UUIDGenerator';

interface State {
    dialogs: Dialog[];
}

export interface Dialog {
    id: number;
    component: Component | AsyncComponent;

    reject(...args: any[]): void,
    resolve(...args: any[]): void,
}

export default class UI extends Service {

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

    public openDialog(component: Component | AsyncComponent): Promise<any> {
        return new Promise((resolve, reject) => {
            const dialog: Dialog = {
                id: UUIDGenerator.generate(),
                component,
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
