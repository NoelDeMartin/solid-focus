import { Store } from 'vuex';

import Service from '@/services/Service';

import Task from '@/models/soukai/Task';

interface State {
    activeTask: Task | null;
    editing: boolean;
}

export default class Tasks extends Service {

    public get active(): Task | null {
        return this.storage.activeTask;
    }

    public get editing(): boolean {
        return this.storage.editing;
    }

    public setActive(task: Task | null, editing: boolean = false): void {
        this.app.$store.commit('setActiveTask', task);
        this.setEditing(editing);
    }

    public setEditing(editing: boolean): void {
        this.app.$store.commit('setEditing', editing);
    }

    protected get storage(): State {
        return this.app.$store.state.tasks
            ? this.app.$store.state.tasks
            : {};
    }

    protected registerStoreModule(store: Store<State>): void {
        store.registerModule('tasks', {
            state: {
                activeTask: null,
                editing: false,
            },
            mutations: {
                setActiveTask(state: State, activeTask: Task | null) {
                    state.activeTask = activeTask;
                },
                setEditing(state: State, editing: boolean) {
                    state.editing = editing;
                },
            },
        });
    }

    protected unregisterStoreModule(store: Store<State>): void {
        store.unregisterModule('tasks');
    }

}
