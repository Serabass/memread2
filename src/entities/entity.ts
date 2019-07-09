import {MemoryEntity} from "../decorators/memory";

@MemoryEntity()
export class Entity {
    public get address() {
        return `0x${this.baseAddress.toString(16)}`;
    }

    public static at(baseAddress: number = 0x00) {
        return new this(baseAddress);
    }

    constructor(protected baseAddress: number = 0x00) {

    }

    public toString(): string {
        return `${(this.constructor as any).name}@${this.address}`;
    }
}
