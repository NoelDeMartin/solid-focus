import Service from '@/services/Service';

export interface User {
    id: string;
    name: string | null;
    avatarUrl: string | null;
}

export default abstract class Auth extends Service {

    public get loggedIn(): boolean {
        return this.app.$store.state.user !== null;
    }

    public get user(): User {
        return this.app.$store.state.user as User;
    }

    public abstract login(idp: string): Promise<void>;

    public abstract logout(): Promise<void>;

}
