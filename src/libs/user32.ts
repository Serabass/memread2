import 'reflect-metadata';
import {Library, Method, Params, Ret} from "../decorators/ffi/method";
import {Keys} from "./Keys";

@Library({libPath: 'user32'})
export class User32 {
    public static get instance() {
        if (!this.singleton) {
            this.singleton = new User32();
        }

        return this.singleton;
    }

    private static singleton: User32;

    @Method({
        nativeName: 'MessageBoxW',
    })
    @Params('int', 'string', 'string', 'int')
    @Ret.int()
    public MessageBox: (hWnd: number,
                        text: string,
                        title: string,
                        type: number) => number;

    @Method()
    @Params('int')
    @Ret.short()
    public GetKeyState: (key: Keys) => number;

    public KeyPressed(key: Keys) {
        return this.GetKeyState(key) < 0;
    }

    constructor(path?: string) {
    }
}

export const user32 = new User32();
