import {Library, Method, never} from 'ffi-decorators';

@Library({libPath: 'user32'})
export class User32 {
    constructor(path?: string) {
    }

    @Method({nativeName: 'MessageBoxW', types: ['int', ['int', 'string', 'string', 'int']]})
    public MessageBox(hWnd: number, text: string, title: string, type: number): number {
        return never();
    }

    @Method({types: ['short', ['int']]})
    public GetKeyState(key: number): number {
        return never();
    }
}

export const user32 = new User32();
