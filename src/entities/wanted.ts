import {MemoryEntity, Prop} from "../decorators";
import {Entity} from "./";

@MemoryEntity()
export class Wanted extends Entity {
    @Prop.int(0x0)
    public chaosLevel: number;

    @Prop.byte(0x1E)
    public activity: number;

    @Prop.byte(0x20)
    public visible: number;

}
