import {MemoryEntity, Prop} from '../decorators';
import {Float} from "../decorators/memory/native-types";
import {Entity} from './entity';

@MemoryEntity()
export class Vector3d extends Entity {
    @Prop(0x0)
    public x: Float;

    @Prop(0x4)
    public y: Float;

    @Prop(0x8)
    public z: Float;

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }

    public toString() {
        return `${this.x}:${this.y}:${this.z}`;
    }

}
