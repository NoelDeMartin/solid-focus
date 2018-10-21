import UI from '@/services/UI';
import Auth from '@/services/Auth';
import Workspaces from '@/services/Workspaces';

declare module 'vue/types/vue' {
    interface Vue {
        $ui: UI;
        $auth: Auth;
        $workspaces: Workspaces;
    }
}
