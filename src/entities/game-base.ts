import {Int32} from "../decorators/memory/native-types";
import {Process} from "../process";
import {Entity} from './entity';
import {Vehicle} from './ped';

const VEHICLES_ADDR = 0xA0FDE4;

export abstract class GameBase extends Entity {

    public get vehicles(): Vehicle[] {
        let result: Vehicle[] = [];
        let addr = VEHICLES_ADDR;
        let entity = +Process.instance.read(addr, Int32);

        while (entity !== 0) {
            result.push(new Vehicle(entity));
            addr += 4;
            entity = +Process.instance.readPointer(addr, Int32);
        }

        return result;
    }

}
