import Prop from "../decorators/memory/prop";
import {MODEL} from "./model";

export class Entity {
    @Prop.ubyte(0x5C) public modelIndex: MODEL;

    constructor(protected baseAddress: number) {

    }

    public toString(): string {
        return `${(this.constructor as any).name}@0x${this.baseAddress.toString(16)}`;
    }
}
