import ref from 'ref';
import {DATATYPE} from "./datatype";
import {AllocationInfo} from "./injector";
import {getProcessId, kernel, PROCESS_ALL_ACCESS} from "./libs";

export class Process {

    public static get instance() {
        if (!this.singleton) {
            const processId = getProcessId(this.EXE);
            if (!processId) {
                throw new Error('Process not found');
            }

            this.singleton = new Process(processId);
            this.singleton.open();
        }
        return this.singleton;
    }

    public static factory(pid: number) {
        return new Process(pid);
    }

    private static singleton: Process;

    private static EXE: string = 'gta-vc.exe';
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

    public writeBuffer2(address: number, buffer: Buffer) {
        kernel.WriteProcessMemory(this.handle, address, buffer, buffer.length, 0);
    }

    public writeBuffer(buffer: Buffer, address: number) {
        buffer.forEach((b, i) => {
            this.write(address + i, 'ubyte', b);
        });
    }

    public read(address: number, type: DATATYPE) {
        switch (type) {
            case 'bool':
                return !!this.readByte(address);
            case 'byte':
                return this.readByte(address);
            case 'ubyte':
                return this.readUByte(address);
            case 'short':
                return this.readShort(address);
            case 'int':
                return this.readInt(address);
            case 'float':
                return this.readFloat(address);
            default:
                debugger;
        }
        throw new Error();
    }

    public readPointer(address: number, type: DATATYPE) {
        let addr = +this.read(address, 'int');
        return this.read(addr, type);
    }

    public write(address: number, type: string, value: any) {
        let buffer: Buffer;

        switch (type) {
            case 'bool':
                buffer = Buffer.alloc(1);
                buffer.writeInt8(+value, 0);
                break;
            case 'byte':
                buffer = Buffer.alloc(1);
                buffer.writeInt8(value, 0);
                break;
            case 'ubyte':
                buffer = Buffer.alloc(1);
                buffer.writeUInt8(value, 0);
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

        return this.writeBuffer2(address, buffer);
    }

    public writeAlloc(alloc: AllocationInfo) {
        for (let i = 0; i < alloc.offset + 1; i++) {
            let b = alloc.buffer[i];
            this.write(alloc.address + i, 'ubyte', b);
        }
    }
}
