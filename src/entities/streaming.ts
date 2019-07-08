import {MemoryEntity} from '../decorators';
import {Injector} from "../injector";
import {kernel} from "../libs";
import {Process} from "../process";
import {FunctionAddress} from "./functions";

@MemoryEntity()
export class Streaming {
    public requestModel(modelIndex: number, flags: number) {
        let inj = new Injector();
        let resultAlloc = inj.alloc(4);
        let alloc = inj.alloc(100)
            .pushInt32(modelIndex)
            .relativeCall(FunctionAddress.SPAWN_VEHICLE)
            .movResult(resultAlloc.address)
            .popECX()
            .popECX()
            .ret();

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);
        let res = Process.instance.read(resultAlloc.address, 'int');
        let res2 = Process.instance.read(res as number, 'int');

        if (typeof res !== 'number') {
            throw new Error();
        }

    }

}
