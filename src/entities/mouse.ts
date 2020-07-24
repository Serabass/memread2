import {MemoryEntity, Prop} from '../decorators';
import {Float} from "../decorators/memory/native-types";
import {Entity} from "./entity";

@MemoryEntity()
export class Mouse extends Entity {
    @Prop(0x936910)
    public x: Float;

    @Prop(0x936914)
    public y: Float;

    public static singleton: Mouse;

    public static get instance() {
        if (!this.singleton) {
            this.singleton = new Mouse();
        }

        return this.singleton;
    }

    protected constructor(protected baseAddress: number = 0x0) {
        super(baseAddress);
    }
}

