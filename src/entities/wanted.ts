import {MemoryEntity, Prop} from "../decorators";
import {Byte, Int32} from "../decorators/memory/native-types";
import {Entity} from "./entity";

// https://gtamods.com/wiki/Memory_Addresses_(VC)#CWanted

@MemoryEntity()
export class Wanted extends Entity {
    @Prop.int(0x0)
    public chaosLevel: number;

    @Prop(0x1E)
    public activity: Byte;

    @Prop(0x20)
    public readonly visible: Byte;

    public get stars() {
        return '⭐'.repeat(this.visible as number);
    }
}
