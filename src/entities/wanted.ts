import {MemoryEntity, Prop} from "../decorators";
import {Byte, Int32} from "../decorators/memory/native-types";
import {Entity} from "./entity";

@MemoryEntity()
export class Wanted extends Entity {
    @Prop(0x0)
    public chaosLevel: Int32;

    @Prop(0x1E)
    public activity: Byte;

    @Prop(0x20)
    public readonly visible: Byte;

}
