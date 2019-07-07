import {MemoryEntity} from '../decorators';
import {Injector} from "../injector";
import {kernel, WFSO} from "../libs";
import {Process} from "../process";
import {FunctionAddress} from "./functions";
import {Game} from './game';
import {Ped} from './ped';
import {Vehicle} from "./vehicle";

@MemoryEntity()
export class Player extends Ped {
    constructor(protected baseAddress: number) {
        super(baseAddress);
    }

    public static get instance() {
        return Game.instance.player;
    }

    public getCar() {
        let inj = new Injector();
        let resultAlloc = inj.alloc(4);
        let alloc = inj.alloc(100)
            .relativeCall(FunctionAddress.PLAYER_GET_CAR)
            .movEcxEax() // mov ecx, eax
            .movResult(resultAlloc.address)
            .ret();

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        let thread = kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        let res = Process.instance.read(resultAlloc.address, 'int');
        let res2 = Process.instance.read(res as number, 'int');

        if (typeof res !== 'number') {
            throw new Error();
        }

        return new Vehicle(res as number);
    }

    public fixCar(): number {
        let inj = new Injector();
        let resultAlloc = inj.alloc(4);
        let alloc = inj.alloc(100)
            .relativeCall(FunctionAddress.PLAYER_GET_CAR)
            .movEcxEax()
            .movResult(resultAlloc.address)
            .relativeCall(FunctionAddress.VEHICLE_FIX)
            .ret();

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        let thread = kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        let res = Process.instance.read(resultAlloc.address, 'int');
        let res2 = Process.instance.read(res as number, 'int');

        if (typeof res !== 'number') {
            throw new Error();
        }

        return res;
    }

}
