import MemoryEntity from '../decorators/memory/memory-entity';
import Prop from '../decorators/memory/prop';
import {Entity} from './entity';
import Game from './game';
import {Ped} from "./ped";

@MemoryEntity()
export class Vehicle extends Entity {
    @Prop.float(0x100) public speed: number;
    @Prop.float(0x160) public cruiseSpeed: number;
    @Prop.float(0x354) public health: number;
    @Prop.array(0x1AC, Ped) public passengers: Ped[];
    @Prop(0x1CC, 'byte') public numPassengers: number;

    // @Prop(0x5C, 'byte')
    // public modelIndex: number;

    public static get pool() {
        return Game.instance.vehicles;
    }

    constructor(public baseAddress: number) {
        super(baseAddress);
    }
}
