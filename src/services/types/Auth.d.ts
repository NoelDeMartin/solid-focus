import Service from '@/services/Service';

export interface User {
    id: string;
    name: string | null;
    avatarUrl: string | null;
}

export interface Auth extends Service {

    loggedIn: boolean;

    user: User;

    login(idp: string): Promise<void>;

    logout(): Promise<void>;

}
