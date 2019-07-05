import Prop from "../decorators/memory/prop";

export class Entity {
    @Prop.ubyte(0x5C) public modelIndex: number;

    constructor(protected baseAddress: number) {

    }

    public toString(): string {
        return `${(this.constructor as any).name}@0x${this.baseAddress.toString(16)}`;
    }
}
