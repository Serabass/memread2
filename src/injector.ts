import  "bytebuffer";
import {AllocationInfo} from "./allocation-info";
import {kernel} from "./libs";
import {Process} from "./Process";

const MEM_RESERVE = 0x2000;
const MEM_COMMIT = 0x1000;
const PAGE_READWRITE = 0x04;

export class Injector {
    constructor(public process: Process = Process.instance) {

    }

    public alloc(size: number): AllocationInfo {
        let baseAddress = kernel.VirtualAllocEx(this.process.handle,
            null,
            size,
            MEM_COMMIT | MEM_RESERVE,
            PAGE_READWRITE) as any;

        let le = kernel.GetLastError();

        if (!baseAddress) {
            debugger;
        }

        return new AllocationInfo(baseAddress, size, this);
    }
}
