import Workspaces from './Workspaces';

export const services = {
    $workspaces: Workspaces,
};

export type AppServices = typeof services;

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties extends AppServices {}
}
