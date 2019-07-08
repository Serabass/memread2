// https://stackoverflow.com/questions/28795242/injecting-only-function-and-running-it-through-createremotethread-c
// http://www.cyberforum.ru/csharp-beginners/thread1974282.html
import 'reflect-metadata';
import {MemoryArrayPointer, MemoryPointer} from '../../pointer';
import {Process} from "../../process";
import {Byte, Float, Int32, Short, UByte} from "./native-types";

export function MemoryEntity(): ClassDecorator {
    return (target: any) => {
        let props = Reflect.getMetadata('props', target.prototype);

        if (!props) {
            props = {};
        }

        Object.keys(props).forEach((key) => {
            let prop = props[key];
            Object.defineProperty(target.prototype, key, {
                enumerable: true,
                get() {
                    let baseAddress = this.baseAddress || 0x0;
                    let {offset, type} = prop;
                    switch (typeof type) {
                        case 'function':
                            let address = baseAddress + offset;

                            switch (type) {
                                case Float:
                                case Byte:
                                case UByte:
                                case Int32:
                                case Boolean:
                                case Short:
                                    return Process.instance.read(address, type);

                                default:
                                    debugger;
                            }

                            debugger;
                            return new type(address);
                        case 'string':
                            debugger;
                            return Process.instance.read(baseAddress + offset, type);
                        case 'object':
                            if (type instanceof MemoryArrayPointer) {
                                // WRONG
                                let result: any[] = [];
                                let p = baseAddress + offset;
                                let addr = Process.instance.read(p, Int32);

                                while (addr !== 0) {
                                    result.push(new (type.cls as any)(addr as any) as any);
                                    p += 4;
                                    addr = Process.instance.read(p, Int32);
                                }

                                return result;
                            } else if (type instanceof MemoryPointer) {
                                let pointer = Process.instance.read(baseAddress + offset, Int32);

                                if (pointer === 0) {
                                    return null;
                                }

                                console.log('DEBUG:', key, prop);
                                return new (type.cls as any)(pointer);
                            } else {
                                debugger;
                            }
                            break;
                        default:
                            debugger;
                    }
                    // return Game.instance.read();
                },
                set(value) {
                    let {offset, type} = prop;
                    Process.instance.write(this.baseAddress + offset, type, value);
                },
            });
        });
    };
}
