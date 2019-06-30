declare module '@/styles/variables' {

    export interface StyleVariables {

        colors: {
            'jade': string;
            'jade-accent': string;
        };

        widths: {
            'panel': number;
            'panel-collapsed': number;
            'panel-large': number;
        };

        transitions: {
            'normal': number;
        },

    }

    const variables: StyleVariables;

    export default variables;

}
