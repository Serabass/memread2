import {Ped} from './ped';
import Game from './game';
import MemoryEntity from '../decorators/memory/memory-entity';

@MemoryEntity()
export class Player extends Ped {
    public static get instance() {
        return Game.instance.player;
    }

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }
}
