import Service from '@/services/Service';
import UI from '@/services/UI';
import Auth from '@/services/Auth';
import Config from '@/services/Config';
import Workspaces from '@/services/Workspaces';

declare module 'vue/types/vue' {
    interface Vue {
        $services: Service[];
        $ui: UI;
        $auth: Auth;
        $config: Config;
        $workspaces: Workspaces;
    }
}
