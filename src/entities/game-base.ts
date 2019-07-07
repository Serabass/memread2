import {Process} from "../process";
import {Entity} from './entity';
import {Vehicle} from './vehicle';

const VEHICLES_ADDR = 0xA0FDE4;

export abstract class GameBase extends Entity {

    public get vehicles(): Vehicle[] {
        let result: Vehicle[] = [];
        let addr = VEHICLES_ADDR;
        let entity = +Process.instance.read(addr, 'int');

        while (entity !== 0) {
            result.push(new Vehicle(entity));
            addr += 4;
            entity = +Process.instance.readPointer(addr, 'int');
        }

        return result;
    }

}
