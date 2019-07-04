import Prop from '../decorators/memory/prop';
import {Entity} from './entity';
import MemoryEntity from '../decorators/memory/memory-entity';

@MemoryEntity()
export class Vector3d extends Entity {
    @Prop.float(0x0)
    public x: number;

    @Prop.float(0x4)
    public y: number;

    @Prop.float(0x8)
    public z: number;

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }

    public toString() {
        return `${this.x}:${this.y}:${this.z}`;
    }

}
