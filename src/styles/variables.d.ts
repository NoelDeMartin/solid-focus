declare module '@/styles/variables' {

    export interface StyleVariables {

        colors: {
            'jade': string;
        };

        widths: {
            'panel': number;
            'collapsed-panel': number;
        };

        transitions: {
            'normal': number;
        },

    }

    const variables: StyleVariables;

    export default variables;

}
