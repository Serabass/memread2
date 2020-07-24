import {MemoryEntity, Prop} from "../decorators/memory";

@MemoryEntity()
export class WheelStates {
    @Prop.byte(0x00) public leftFront: WheelState;
    @Prop.byte(0x01) public leftRear: WheelState;
    @Prop.byte(0x02) public rightFront: WheelState;
    @Prop.byte(0x03) public rightRear: WheelState;

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
