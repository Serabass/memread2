import MemoryEntity from "../decorators/memory/memory-entity";
import Prop from "../decorators/memory/prop";
import {Entity} from "./entity";

@MemoryEntity()
export class Wanted extends Entity {
    @Prop.int(0x000) public chaosLevel: number;
    @Prop.byte(0x1E) public activity: number;
    @Prop.byte(0x20) public visible: number;
}
