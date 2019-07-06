import {MemoryEntity} from '../decorators';
import {Game, Ped} from './';

@MemoryEntity()
export class Player extends Ped {
    constructor(protected baseAddress: number) {
        super(baseAddress);
    }

    public static get instance() {
        return Game.instance.player;
    }
}
