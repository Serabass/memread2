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

    // public write(address: number, type: string, value: any) {
    //     switch (type) {
    //         case 'byte':
    //             let byteMemBuffer: Buffer = new Buffer([]);
    //             byteMemBuffer.writeInt8(value, 0);
    //             return this.process.writeMemory(address, byteMemBuffer);
    //         case 'short':
    //             let shortMemBuffer: Buffer = new Buffer([]);
    //             shortMemBuffer.writeInt16BE(value, 0);
    //             return this.process.writeMemory(address, shortMemBuffer);
    //         case 'int':
    //             let intMemBuffer: Buffer = new Buffer([]);
    //             intMemBuffer.writeInt16BE(value, 0);
    //             return this.process.writeMemory(address, intMemBuffer);
    //         default:
    //             debugger;
    //     }
    // }

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
