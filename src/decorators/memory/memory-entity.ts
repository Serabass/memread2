// https://stackoverflow.com/questions/28795242/injecting-only-function-and-running-it-through-createremotethread-c
// http://www.cyberforum.ru/csharp-beginners/thread1974282.html

import 'reflect-metadata';
import Game from '../../entities/game';
import {MemoryArrayPointer, MemoryPointer} from '../../pointer';

export default function MemoryEntity(): ClassDecorator {
    return (target: any) => {
        let props = Reflect.getMetadata('props', target.prototype);

        if (!props) {
            props = {};
        }

        Object.keys(props).forEach((key) => {
            let prop = props[key];
            Object.defineProperty(target.prototype, key, {
                get() {
                    let {offset, type} = prop;
                    switch (typeof type) {
                        case 'function':
                            return new type(this.baseAddress + offset);
                        case 'string':
                            return Game.instance.read(this.baseAddress + offset, type);
                        case 'object':
                            if (type instanceof MemoryArrayPointer) {
                                // WRONG
                                let result = [];
                                let p = this.baseAddress + offset;
                                let addr = Game.instance.read(p, 'int');

                                debugger;
                                let i = 0;
                                while (addr !== 0) {
                                    result.push(new (type.cls as any)(addr));
                                    p += 4;
                                    addr = Game.instance.read(p, 'int');
                                }

                                return result;
                            } else if (type instanceof MemoryPointer) {
                                let pointer = Game.instance.read(this.baseAddress + offset, 'int');
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
                set() {
                    debugger;
                },
            });
        });
    };
}
