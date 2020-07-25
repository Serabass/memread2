import {MemoryEntity, Prop} from "../decorators/memory";
import {Entity} from "./entity";

@MemoryEntity()
export class WheelStates extends Entity {
    @Prop.byte(0x00) public leftFront: WheelState;
    @Prop.byte(0x01) public leftRear: WheelState;
    @Prop.byte(0x02) public rightFront: WheelState;
    @Prop.byte(0x03) public rightRear: WheelState;

    protected constructor(public baseAddress: number) {
        super(baseAddress);
    }

    public static at(baseAddress: number) {
        return new WheelStates(baseAddress);
    }

    public get json() {
        return {
            leftFront: this.leftFront,
            leftRear: this.leftRear,
            rightFront: this.rightFront,
            rightRear: this.rightRear,
        };
    }
}

export enum WheelState {
    NORMAL,
    POPPED,
    NONE,
}
