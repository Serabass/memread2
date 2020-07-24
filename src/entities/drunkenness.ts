import {Prop} from "../decorators/memory";
import {Entity} from "./entity";

export class Drunkenness extends Entity {
    @Prop(0x00) public enabled: boolean;
    @Prop(0x01) public countdownToggle: boolean;
}
