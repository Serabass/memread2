import MemoryEntity from '../decorators/memory/memory-entity';
import Prop from '../decorators/memory/prop';
import {Entity} from './entity';
import Game from './game';

@MemoryEntity()
export class Vehicle extends Entity {
    @Prop.float(0x354) public health: number;

    // @Prop(0x1CC, 'byte')
    // public numPassengers: number;

    // @Prop(0x5C, 'byte')
    // public modelIndex: number;

    public static get pool() {
        return Game.instance.vehicles;
    }

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }

}
