import { Auth } from '@/services/types/Auth';
import { UI } from '@/services/types/UI';
import { Workspaces } from '@/services/types/Workspaces';

declare module 'vue/types/vue' {
    interface Vue {
        $auth: Auth;
        $ui: UI;
        $workspaces: Workspaces;
    }
}
