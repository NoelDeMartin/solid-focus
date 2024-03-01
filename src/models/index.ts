import type Task from '@/models/Task';
import type TasksList from '@/models/TasksList';
import type Workspace from '@/models/Workspace';

declare module 'soukai' {
    interface ModelsRegistry {
        Task: typeof Task;
        TasksList: typeof TasksList;
        Workspace: typeof Workspace;
    }
}
