import { memo } from '@noeldemartin/utils';

import Workspace from '@/models/Workspace';

export function mintWorkspaceUrl(name: string): string;
export function mintWorkspaceUrl(collection: string, name: string): string;
export function mintWorkspaceUrl(collectionOrName: string, name?: string): string {
    const workspace = memo('mint-workspace-url', () => new Workspace());
    const collection = typeof name === 'string' ? collectionOrName : Workspace.collection;
    const oldCollection = Workspace.collection;

    Workspace.collection = collection;
    workspace.name = name ?? collectionOrName;
    workspace.mintUrl();
    Workspace.collection = oldCollection;

    return workspace.url;
}
