import {MemoryEntity, Prop} from "../decorators/memory";
import {MODEL} from "./model";

@MemoryEntity()
export class Entity {
    @Prop.ubyte(0x5C)
    public readonly modelIndex: MODEL;

    constructor(protected baseAddress: number) {

    }

    public get address() {
        return `0x${this.baseAddress.toString(16)}`;
    }

    public toString(): string {
        return `${(this.constructor as any).name}@${this.address}`;
    }
}
