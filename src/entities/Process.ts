import {Kernel, PROCESS_ALL_ACCESS} from "../libs/kernel";
import ref from 'ref';

export class Process {
    private handle: number;

    public constructor(private pid: number) {
    }

    public open(): this {
        this.handle = (new Kernel()).OpenProcess(PROCESS_ALL_ACCESS, false, this.pid);
        return this;
    }

    public close(): this {
        (new Kernel()).CloseHandle(this.handle);
        return this;
    }

    public readByte(address: number) {
        let type = ref.types.int8;
        let buf = ref.alloc(type);
        (new Kernel()).ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readInt8(0);
    }

    public readShort(address: number) {
        let type = ref.types.int16;
        let buf = ref.alloc(type);
        (new Kernel()).ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readInt16BE(0);
    }

    public readInt(address: number) {
        let type = ref.types.int32;
        let buf = ref.alloc(type);
        (new Kernel()).ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readInt32BE(0);
    }

    public readFloat(address: number) {
        let type = ref.types.float;
        let buf = ref.alloc(type);
        (new Kernel()).ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readFloatBE(0);
    }
}
