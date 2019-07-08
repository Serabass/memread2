import * as ByteBuffer from "bytebuffer";
import {FunctionAddress} from "./entities";
import {kernel} from "./libs";
import {Process} from "./Process";

const MEM_RESERVE = 0x2000;
const MEM_COMMIT = 0x1000;
const PAGE_READWRITE = 0x04;

export class AllocationInfo {
    public buffer: ByteBuffer;

    public offset = 0;

    public get hexAddr() {
        return this.address.toString(16);
    }

    constructor(public address: number, public size: number) {
        debugger;
        this.buffer = new (ByteBuffer as any)(size, true);
    }

    public buf(cb: (b: ByteBuffer) => any) {
        cb(this.buffer);
        return this;
    }

    public uInt8(value: number) {
        this.buffer.writeUint8(value);
        return this;
    }

    public int32(value: number) {
        this.buffer.writeInt32(value);
        return this;
    }

    public calculateOffset(step: number, fn: number) {
        return -(this.address - fn + step) - 5;
    }

    public pushInt32(value: number) {
        this.buffer
            .writeUint8(0x68)
            .writeInt32(value);

        return this;
    }

    public pushUInt8(value: number) {
        this.buffer
            .writeUint8(0x6A)
            .writeUint8(value);

        return this;
    }

    public relativeCall(fn: FunctionAddress) {
        let offsetValue = this.offset;
        let offset = this.calculateOffset(offsetValue, fn);
        this.buffer
            .writeUint8(0xE8)  // relative call
            .writeInt32(offset); // fnAddr

        return this;
    }

    public movResult(address: number) {
        this.buffer
            .writeUint8(0x89)
            .writeUint8(0x0D) // mov DWORD PTR ds:result
            .writeInt32(address);

        return this;
    }

    public popECX() {
        this.buffer.writeUint8(0x59);
        return this;
    }

    public pushEAX() {
        this.buffer.writeUint8(0x50);
        return this;
    }

    public movEcxEax() {
        this.buffer.writeUint8(0x89);
        this.buffer.writeUint8(0xC1);
        return this;
    }

    public movDSToEcx(address: number) {
        this.buffer.writeUint8(0x8B)
            .writeUint8(0x0D)
            .writeUint32(address)
        ;
        return this;
    }

    public movEAXOffset(offset: number) {
        this.buffer
            .writeUint8(0xA1)
            .writeUint32(offset);

        return this;
    }

    public ret() {
        this.buffer
            .writeUint8(0xC3);
        return this;
    }
}

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

        return new AllocationInfo(baseAddress, size);
    }
}
