import {kernel, PROCESS_ALL_ACCESS} from "../libs/kernel";
import ref from 'ref';

export class Process {
    public handle: number;

    public constructor(private pid: number) {
    }

    public open() {
        this.handle = kernel.OpenProcess(PROCESS_ALL_ACCESS, false, this.pid);
        return this;
    }

    public close() {
        kernel.CloseHandle(this.handle);
        return this;
    }

    public readByte(address: number) {
        let type = ref.types.int8;
        let buf = ref.alloc(type);
        kernel.ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readInt8(0);
    }

    public readUByte(address: number) {
        let type = ref.types.int8;
        let buf = ref.alloc(type);
        kernel.ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readUInt8(0);
    }

    public readShort(address: number) {
        let type = ref.types.int16;
        let buf = ref.alloc(type);
        kernel.ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readInt16BE(0);
    }

    public readInt(address: number) {
        let type = ref.types.int32;
        let buf = ref.alloc(type);
        kernel.ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readInt32LE(0);
    }

    public readFloat(address: number) {
        let type = ref.types.float;
        let buf = ref.alloc(type);
        kernel.ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readFloatLE(0);
    }

    public write(address: number, buffer: Buffer) {
        kernel.WriteProcessMemory(this.handle, address, buffer, buffer.length, 0);
    }
}
