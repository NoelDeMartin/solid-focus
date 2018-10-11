import Auth from '@/services/Auth';

declare module 'vue/types/vue' {
    interface Vue {
        $auth: typeof Auth;
    }
}
