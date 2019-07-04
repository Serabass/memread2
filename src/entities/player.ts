import Prop from '../decorators/memory/prop';
import {Entity} from './entity';
import {Ped} from './ped';
import Game from './game';
import MemoryEntity from '../decorators/memory/memory-entity';

@MemoryEntity()
export class Player extends Entity {
    @Prop(0x0, Ped)
    public ped: Ped;

    public static get instance() {
        return Game.instance.player;
    }

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }
}
