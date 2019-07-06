import {MemoryEntity, Prop} from "../decorators/memory";
import {Entity} from "./";

@MemoryEntity()
export class Cheat extends Entity {
    public static singleton: Cheat;
    @Prop.bool(0x00A10ADC) public greenLights: boolean;
    @Prop.bool(0x00A10AB3) public weaponsForAll: boolean;

    public static get instance() {
        if (!this.singleton) {
            this.singleton = new Cheat(0);
        }

        return this.singleton;
    }
}
