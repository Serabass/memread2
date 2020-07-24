declare module 'cliui' {
    interface CliUIOptions {
        width: number;
    }

    function cliui(options: CliUIOptions): CliUI;

    class CliUI {
        public resetOutput();
        public div(...columns: string[]);
        public toString();
    }

    export = cliui;
}
