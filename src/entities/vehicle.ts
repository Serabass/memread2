import Prop from '../decorators/memory/prop';
import {Entity} from './entity';
import Game from './game';
import MemoryEntity from '../decorators/memory/memory-entity';

@MemoryEntity()
export class Vehicle extends Entity {

    @Prop(0x354, 'float')
    public health: number;

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
