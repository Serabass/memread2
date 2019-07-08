import {Prop} from "../decorators/memory";
import {Entity} from "./entity";

export class Drunkenness extends Entity {
    @Prop(0x0)
    public enabled: boolean;

    @Prop(0x1)
    public countdownToggle: boolean;
}
