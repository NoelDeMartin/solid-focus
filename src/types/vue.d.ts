import Service from '@/services/Service';
import UI from '@/services/UI';
import Auth, { User } from '@/services/Auth';
import Workspaces, { Workspace } from '@/services/Workspaces';

declare module 'vue/types/vue' {
    interface Vue {
        $services: Service[];
        $ui: UI;
        $auth: Auth<User | any>;
        $workspaces: Workspaces<Workspace | any, User | any>;
    }
}
