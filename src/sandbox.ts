import * as ffi from 'ffi';
import {Library, Method} from "ffi-decorators";
import {Kernel} from "./lib";

let types = ['bool', 'pointer', 'int', 'float', 'string'];

for (let ret of types) {
    for (let hProcess of types) {
        for (let lpBaseAddress of types) {
            for (let lpBuffer of types) {
                for (let dwSize of types) {
                    for (let lpNumberOfBytesRead of types) {
                        let options = [ret, [hProcess, lpBaseAddress, lpBuffer, dwSize, lpNumberOfBytesRead]];
                        try {

                            let libm = ffi.Library('libm', {
                                ceil: ['double', ['double']],
                            });
                            libm.ceil(1.5); // 2

                            let ownPropertyDescriptor = Object
                                .getOwnPropertyDescriptor(Kernel.prototype, 'ReadProcessMemory');
                            Method({types: options as any})(Kernel.prototype, 'ReadProcessMemory', null as any);

                            Library({libPath: 'user32'})(Kernel);
                            const myLib = new Kernel();
                            let res = myLib.ReadProcessMemory(1, 2, new Buffer(1), 4, 5,);

                            debugger;
                        } catch (e) {

                        }
                    }
                }
            }
        }
    }
}
