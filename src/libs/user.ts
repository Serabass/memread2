import {Library, Method, never} from "ffi-decorators";

@Library({libPath: 'user32'})
export class User {
    constructor(path?: string) {
    }

    @Method({nativeName: 'MessageBoxW', types: ['int', ['int', 'string', 'string', 'int']]})
    public MessageBox(hWnd: number, text: string, title: string, type: number): number {
        return never();
    }

}
