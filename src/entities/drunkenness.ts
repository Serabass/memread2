import {Prop} from "../decorators/memory";
import {Entity} from "./entity";

export class Drunkenness extends Entity {
    @Prop.bool(0x0)
    public enabled: boolean;

    @Prop.bool(0x1)
    public countdownToggle: number;
}
