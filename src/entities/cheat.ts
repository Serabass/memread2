import MemoryEntity from "../decorators/memory/memory-entity";
import Prop from "../decorators/memory/prop";
import {Entity} from "./entity";

@MemoryEntity()
export default class Cheat extends Entity {
    public static singleton: Cheat;
    public static get instance() {
        if (!this.singleton) {
            this.singleton = new Cheat(0);
        }

        return this.singleton;
    }

    @Prop.bool(0x00A10ADC) public greenLights: boolean;
    @Prop.bool(0x00A10AB3) public weaponsForAll: boolean;
}