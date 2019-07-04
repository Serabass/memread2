import {Process} from "./Process";
import {Vehicle} from './vehicle';
import {Entity} from './entity';
import {DATATYPE} from '../datatype';

const VEHICLES_ADDR = 0xA0FDE4;

export abstract class GameBase extends Entity {
    public process: Process;

    public read(address: number, type: DATATYPE) {
        switch (type) {
            case 'byte':
                return this.process.readByte(address);
            case 'short':
                return this.process.readShort(address);
            case 'int':
                return this.process.readInt(address);
            case 'float':
                return this.process.readFloat(address);
            default:
                debugger;
        }
        throw new Error();
    }

    public readPointer(address: number, type: DATATYPE) {
        let addr = this.read(address, 'int');
        return this.read(addr, type);
    }

    public write(address: number, type: string, value: any) {
        let buffer: Buffer;

        switch (type) {
            case 'byte':
                buffer = Buffer.alloc(1);
                buffer.writeInt8(value, 0);
                break;
            case 'short':
                buffer = Buffer.alloc(2);
                buffer.writeInt16LE(value, 0);
                break;
            case 'int':
                buffer = Buffer.alloc(4);
                buffer.writeInt32LE(value, 0);
                break;
            case 'float':
                buffer = Buffer.alloc(4);
                buffer.writeFloatLE(value, 0);
                break;
            default:
                return;
        }

        return this.process.write(address, buffer);
    }

    public get vehicles(): Vehicle[] {
        let result: Vehicle[] = [];
        let addr = VEHICLES_ADDR;
        let entity = this.read(addr, 'int');

        while (entity !== 0) {
            result.push(new Vehicle(entity));
            addr += 4;
            entity = this.readPointer(addr, 'int');
        }

        return result;
    }
}
