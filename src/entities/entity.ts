import {MemoryEntity, Prop} from "../decorators/memory";
import EventEmitter from 'events';

@MemoryEntity()
export class Entity extends EventEmitter {
    @Prop.short(0x058)
    public readonly scanCode: number;

    public get address() {
        return `0x${this.baseAddress.toString(16)}`;
    }

    public static at(baseAddress: number = 0x00) {
        return new this(baseAddress);
    }

    constructor(public baseAddress: number = 0x00) {
        super();
    }

    public toString(): string {
        return `${(this.constructor as any).name}@${this.address}`;
    }
}
