import Service from '@/services/Service';
import UI from '@/services/UI';
import Auth from '@/services/Auth';
import Workspaces from '@/services/Workspaces';

import User from '@/models/User';
import Workspace from '@/models/Workspace';

declare module 'vue/types/vue' {
    interface Vue {
        $services: Service[];
        $ui: UI;
        $auth: Auth;
        $workspaces: Workspaces;
    }
}
