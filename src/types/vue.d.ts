import Auth from '@/services/Auth';
import UI from '@/services/UI';

declare module 'vue/types/vue' {
    interface Vue {
        $auth: Auth;
        $ui: UI;
    }
}
