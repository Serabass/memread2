import {Injector} from "../injector";
import {kernel, WFSO} from "../libs";
import {Process} from "../process";
import {FunctionAddress} from "./functions";
import {IVector3DA} from "./ped";

export class TaxiCab {
    public static create(sourcePos: IVector3DA, dropOffPos: IVector3DA) {
        let inj = new Injector(Process.instance);
        let src = inj.alloc(20)
            .buf(b => {
                b.writeFloat(sourcePos.a);
                b.writeFloat(sourcePos.z);
                b.writeFloat(sourcePos.y);
                b.writeFloat(sourcePos.x);
            });
        Process.instance.writeAlloc(src);
        let dropOff = inj.alloc(20)
            .buf(b => {
                b.writeFloat(dropOffPos.a);
                b.writeFloat(dropOffPos.z);
                b.writeFloat(dropOffPos.y);
                b.writeFloat(dropOffPos.x);
            });
        Process.instance.writeAlloc(dropOff);

        let alloc = inj.alloc(100)
            .fldDS(dropOff.address + 4 * 0)
            .fldDS(dropOff.address + 4 * 1)
            .fldDS(dropOff.address + 4 * 2)
            .fldDS(dropOff.address + 4 * 3)

            .fldDS(src.address + 4 * 0)
            .fldDS(src.address + 4 * 1)
            .fldDS(src.address + 4 * 2)
            .fldDS(src.address + 4 * 3)

            .relativeCall(FunctionAddress.CREATE_TAXI_CAB)
            .ret()
        ;

        Process.instance.writeAlloc(alloc);

        debugger;

        let aa = Buffer.alloc(5);
        kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        src.zeroRemote();
        dropOff.zeroRemote();
        alloc.zeroRemote();
    }

    public static release() {
        let inj = new Injector(Process.instance);
        let alloc = inj.alloc(100)
            .relativeCall(FunctionAddress.CREATE_TAXI_CAB)
        ;

        let aa = Buffer.alloc(5);
        kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        alloc.zeroRemote();
    }
}
