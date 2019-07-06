import {FunctionAddress} from "./entities/functions";
import {kernel} from "./libs/kernel";
import {Process} from "./Process";

const MEM_RESERVE = 0x2000;
const MEM_COMMIT = 0x1000;
const PAGE_READWRITE = 0x04;

export class AllocationInfo {
    public buffer: Buffer;

    public offset = 0;

    constructor(public address: number, public size: number) {
        this.buffer = Buffer.alloc(size);
    }

    public uInt8(value: number) {
        this.buffer.writeUInt8(value, this.incOffset());
        return this;
    }

    public int32(value: number) {
        this.buffer.writeInt32LE(value, this.incOffset());
        return this;
    }

    public calculateOffset(step: number, fn: number) {
        return -(this.address - fn + step) - 5;
    }

    public pushInt32(value: number) {
        this.buffer.writeUInt8(0x68, this.incOffset());
        this.buffer.writeInt32LE(value, this.incOffset(4));

        return this;
    }

    public pushUInt8(value: number) {
        this.buffer.writeUInt8(0x6A, this.incOffset());
        this.buffer.writeUInt8(value, this.incOffset());

        return this;
    }

    public relativeCall(fn: FunctionAddress) {
        let offsetValue = this.offset;
        this.buffer.writeUInt8(0xE8, this.incOffset()); // relative call
        let offset = this.calculateOffset(offsetValue, fn);
        this.buffer.writeInt32LE(offset, this.incOffset(4)); // fnAddr

        return this;
    }

    public movResult(address: number) {
        this.buffer.writeUInt8(0x89, this.incOffset());
        this.buffer.writeUInt8(0x0D, this.incOffset()); // mov DWORD PTR ds:result
        this.buffer.writeInt32LE(address, this.incOffset(4));

        return this;
    }

    public popECX() {
        this.buffer.writeUInt8(0x59, this.incOffset());

        return this;
    }

    public pushEAX() {
        this.buffer.writeUInt8(0x50, this.incOffset());
        return this;
    }

    public movEAXOffset(offset: number) {
        this.buffer.writeUInt8(0xA1, this.incOffset());
        this.buffer.writeUInt32LE(offset, this.incOffset(4));

        return this;
    }

    public ret() {
        this.buffer.writeUInt8(0xC3, this.incOffset());

        return this;
    }

    private incOffset(value = 1) {
        let oldValue = this.offset;
        this.offset += value;
        return oldValue;
    }
}

export class Injector {
    constructor(public process: Process) {

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

        return new AllocationInfo(baseAddress, size);
    }
}
