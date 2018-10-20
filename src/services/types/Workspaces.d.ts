import Service from '@/services/Service';

export interface Workspace {
    name: string;
}

export interface Workspaces extends Service {

    empty: boolean;

    active: Workspace;

    create(name: string): Promise<void>;

}
