// https://stackoverflow.com/questions/28795242/injecting-only-function-and-running-it-through-createremotethread-c
// http://www.cyberforum.ru/csharp-beginners/thread1974282.html
import 'reflect-metadata';
import {MemoryArrayPointer, MemoryPointer} from '../../pointer';

export function MemoryEntity(): ClassDecorator {
    return (target: any) => {
        let props = Reflect.getMetadata('props', target.prototype);

        if (!props) {
            props = {};
        }

        Object.keys(props).forEach((key) => {
            let prop = props[key];
            Object.defineProperty(target.prototype, key, {
                get() {
                    let {Game} = require('../../entities/game');
                    let baseAddress = this.baseAddress || 0x0;
                    let {offset, type} = prop;
                    switch (typeof type) {
                        case 'function':
                            return new type(baseAddress + offset);
                        case 'string':
                            return Game.instance.read(baseAddress + offset, type);
                        case 'object':
                            if (type instanceof MemoryArrayPointer) {
                                // WRONG
                                let result: any[] = [];
                                let p = baseAddress + offset;
                                let addr = Game.instance.read(p, 'int');
                                let i = 0;

                                while (addr !== 0) {
                                    result.push(new (type.cls as any)(addr as any) as any);
                                    p += 4;
                                    addr = Game.instance.read(p, 'int');
                                }

                                return result;
                            } else if (type instanceof MemoryPointer) {
                                let pointer = Game.instance.read(baseAddress + offset, 'int');

                                if (pointer === 0) {
                                    return null;
                                }

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
                    let {Game} = require('../../entities/game');
                    let {offset, type} = prop;
                    Game.instance.write(this.baseAddress + offset, type, value);
                },
            });
        });
    };
}
