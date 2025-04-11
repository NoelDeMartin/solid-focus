import { arraySorted, compare } from '@noeldemartin/utils';
import { computed, onMounted, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';

import Workspaces from '@/services/Workspaces';
import { listName, workspaceName } from '@/utils/display';
import type Task from '@/models/Task';
import type TasksList from '@/models/TasksList';
import type Workspace from '@/models/Workspace';

async function indexList(workspace: Workspace, list: TasksList, results: Ref<SearchResult[]>): Promise<void> {
    results.value.push({
        key: list.url,
        url: list.url,
        searchableText: listName(list)?.toLowerCase().replace(/\s+/g, '') ?? '',
        workspace,
        list,
    });

    const tasks = await list.loadRelationIfUnloaded<Task[]>('tasks');

    for (const task of tasks) {
        results.value.push({
            key: task.url,
            url: task.url,
            searchableText: task.name.toLowerCase().replace(/\s+/g, ''),
            workspace,
            list,
            task,
        });
    }
}

async function indexWorkspace(workspace: Workspace, results: Ref<SearchResult[]>): Promise<void> {
    results.value.push({
        key: `workspace-${workspace.url}`,
        url: workspace.url,
        searchableText: workspaceName(workspace)?.toLowerCase().replace(/\s+/g, '') ?? '',
        workspace,
    });
}

function compareResults(a: SearchResult, b: SearchResult): number {
    const listComparison = compare(!a.list, !b.list);
    const taskComparison = compare(!a.task, !b.task);
    const completedComparison = compare(a.task?.completed, b.task?.completed);
    const textComparison = compare(a.searchableText, b.searchableText);

    return [taskComparison, listComparison, completedComparison, textComparison].find((result) => result !== 0) ?? 0;
}

export interface SearchResult {
    key: string;
    url: string;
    searchableText: string;
    task?: Task;
    list?: TasksList;
    workspace: Workspace;
}

export function useSearch(query: Ref<string>): ComputedRef<SearchResult[]> {
    const results = ref([]) as Ref<SearchResult[]>;
    const filteredResults = computed(() =>
        arraySorted(
            query.value === ''
                ? results.value
                : results.value.filter((result) =>
                    result.searchableText.includes(query.value.toLowerCase().replace(/\s+/g, ''))),
            compareResults,
        ));

    onMounted(async () => {
        const currentWorkspace = Workspaces.current;

        if (!currentWorkspace) {
            return;
        }

        await Promise.all([
            indexList(currentWorkspace, currentWorkspace, results),
            ...(currentWorkspace.lists?.map((list) => indexList(currentWorkspace, list, results)) ?? []),
        ]);

        for (const workspace of Workspaces.all) {
            if (workspace === currentWorkspace) {
                continue;
            }

            indexWorkspace(workspace, results);
        }
    });

    return filteredResults;
}
