// https://stackoverflow.com/questions/28795242/injecting-only-function-and-running-it-through-createremotethread-c
// http://www.cyberforum.ru/csharp-beginners/thread1974282.html
import 'reflect-metadata';
import {Entity, Weapon} from "../../entities";
import {Memory, MemoryArray, MemoryArrayPointer, MemoryPointer} from '../../pointer';
import {Process} from "../../process";
import {Bit, Byte, Float, FString, FStringReversed, Int32, Short, UByte} from "./native-types";

export function MemoryEntity<T extends Entity>(): ClassDecorator {
    return (target: any) => {
        let props = Reflect.getMetadata('mem:props', target.prototype);

        if (!props) {
            props = {};
        }

        Object.entries(props).forEach(([key, prop]: any[]) => {
            let {offset, type, meta} = prop;
            let get: any = (() => {
                switch (typeof type) {
                    case 'function':
                        return function(this: any) {
                            let baseAddress = this.baseAddress || 0x00;
                            let address = baseAddress + offset;

                            switch (type) {
                                case Float:
                                case Byte:
                                case UByte:
                                case Int32:
                                case Boolean:
                                case Short:
                                    return Process.instance.read(address, type);
                                case FStringReversed:
                                    return Process.instance.readFStringReversed(address, meta.size);
                                case FString:
                                    return Process.instance.readFString(address, meta.size);

                                case Bit:
                                    let val = Process.instance.read(address, Byte) as number;
                                    return !!((val >> meta.bitIndex) & 7);
                                default:
                                    debugger;
                            }

                            return new type(address);
                        };

                    case 'object':
                        if (type instanceof MemoryArrayPointer) {
                            return function(this: any) {
                                let baseAddress = this.baseAddress || 0x00;
                                // WRONG
                                let result: any[] = [];
                                let p = baseAddress + offset;
                                let addr = Process.instance.readInt(p);

                                while (addr !== 0) {
                                    result.push(new (type.cls as any)(addr as any) as any);
                                    p += 4;
                                    addr = Process.instance.readInt(p);
                                }

                                return result;
                            };
                        } else if (type instanceof MemoryArray) {
                            return function(this: any) {
                                let t = type as MemoryArray;
                                let baseAddress = this.baseAddress || 0x00;
                                let result: any[] = [];

                                for (let i = 0; i < t.count; i++) {
                                    let p = baseAddress + offset + (i * t.size);
                                    let w = Weapon.at(p);
                                    result.push(w);
                                }

                                return result;
                            };
                        } else if (type instanceof MemoryPointer) {
                            return function(this: any) {
                                let baseAddress = this.baseAddress || 0x00;
                                let pointer = Process.instance.read(baseAddress + offset, Int32);

                                if (pointer === 0) {
                                    return null;
                                }

                                return type.cls.at(pointer as any);
                            };
                        } else if (type instanceof Memory) {
                            return function(this: any) {
                                let baseAddress = this.baseAddress || 0x00;
                                debugger;
                                return type.cls.at(baseAddress + offset);
                            };
                        } else {
                            debugger;
                        }
                }
            })();

            Object.defineProperty(target.prototype, key, {
                enumerable: true,
                get,
                set(value) {
                    let baseAddress = this.baseAddress || 0x00;
                    Process.instance.write(baseAddress + offset, type, value, meta);
                },
            });
        });
    };
}
