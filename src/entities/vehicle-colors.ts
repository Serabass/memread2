import {MemoryEntity, Prop} from "../decorators/memory";
import {Entity} from "./entity";

@MemoryEntity()
export class VehicleColors extends Entity {
    @Prop.byte(0x00) public primary: number;
    @Prop.byte(0x01) public secondary: number;

    protected constructor(public baseAddress: number) {
        super(baseAddress);
    }

    public static at(baseAddress: number) {
        return new VehicleColors(baseAddress);
    }
}
