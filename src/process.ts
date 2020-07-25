import ref from 'ref';
import {AllocationInfo} from "./allocation-info";
import {DATATYPE} from "./datatype";
import {Byte, Float, FString, FStringReversed, Int32, Short, UByte} from "./decorators/memory/native-types";
import {getProcessId, kernel, ProcessAccessFlags} from "./libs";

/**
 * Управление процессом
 */
export class Process {
    /**
     * Синглтон
     */
    public static get instance() {
        if (!this.singleton) {
            const processId = getProcessId(this.EXE);
            if (!processId) {
                throw new Error('Process not found');
            }

            this.singleton = new Process(processId);
        }
        return this.singleton;
    }

    /**
     * Синглтон
     */
    protected static singleton: Process;

    /**
     * Имя Exe-файла
     */
    private static EXE: string = 'gta-vc.exe';

    /**
     * Хендл процесса
     */
    public handle: number;

    public constructor(private pid: number) {
    }

    /**
     * Открыть найденный процесс для управления
     */
    public open() {
        this.handle = kernel.OpenProcess(ProcessAccessFlags.All, false, this.pid);
        return this;
    }

    /**
     * Закрываем хендл процесса
     */
    public close() {
        kernel.CloseHandle(this.handle);
        return this;
    }

    /**
     * Читаем байт по указанному адресу
     *
     * @param address
     */
    public readByte(address: number): Byte {
        let type = ref.types.int8;
        let buf = ref.alloc(type);
        kernel.ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readInt8(0);
    }

    /**
     * Читаем беззнаковый байт по указанному адресу
     *
     * @param address
     */
    public readUByte(address: number) {
        let type = ref.types.int8;
        let buf = ref.alloc(type);
        kernel.ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readUInt8(0);
    }

    /**
     * Читаем двухбайтовое число по указанному адресу
     *
     * @param address
     */
    public readShort(address: number) {
        let type = ref.types.int16;
        let buf = ref.alloc(type);
        kernel.ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readInt16BE(0);
    }

    /**
     * Читаем четырёхбайтовое число по указанному адресу
     *
     * @param address
     */
    public readInt(address: number) {
        let type = ref.types.int32;
        let buf = ref.alloc(type);
        kernel.ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readInt32LE(0);
    }

    /**
     * Читаем флоат по указанному адресу
     *
     * @param address
     */
    public readFloat(address: number) {
        let type = ref.types.float;
        let buf = ref.alloc(type);
        kernel.ReadProcessMemory(this.handle, address, buf, type.size, 0);
        return buf.readFloatLE(0);
    }

    public writeBuffer2(address: number, buffer: Buffer) {
        kernel.WriteProcessMemory(this.handle, address, buffer, buffer.length, 0);
    }

    public writeBuffer(address: number, buffer: Buffer) {
        buffer.forEach((b, i) => {
            this.write(address + i, UByte, b);
        });
    }

    public read(address: number, type: DATATYPE) {
        switch (type) {
            case Boolean:
                return !!this.readByte(address);
            case Byte:
                return this.readByte(address);
            case UByte:
                return this.readUByte(address);
            case Short:
                return this.readShort(address);
            case Int32:
                return this.readInt(address);
            case Float:
                return this.readFloat(address);
            default:
                debugger;
        }
        throw new Error();
    }

    public readFString(address: number, size: number) {
        let buf = Buffer.alloc(size);
        kernel.ReadProcessMemory(this.handle, address, buf, size, 0);

        return buf.toString('ascii');
    }

    public readFStringReversed(address: number, size: number) {
        let buf = Buffer.alloc(size);
        kernel.ReadProcessMemory(this.handle, address, buf, size, 0);

        return buf.toString('ascii').split('').reverse().join('');
    }

    public readPointer(address: number, type: DATATYPE) {
        let addr = this.readInt(address);
        console.log(addr);
        return this.read(addr, type);
    }

    public write(address: number, type: DATATYPE, value: any, meta: any = {}) {
        let buffer: Buffer;

        switch (type) {
            case Boolean:
                buffer = Buffer.alloc(1);
                buffer.writeInt8(+value, 0);
                break;
            case Byte:
                buffer = Buffer.alloc(1);
                buffer.writeInt8(value, 0);
                break;
            case UByte:
                buffer = Buffer.alloc(1);
                buffer.writeUInt8(value, 0);
                break;
            case Short:
                buffer = Buffer.alloc(2);
                buffer.writeInt16LE(value, 0);
                break;
            case Int32:
                buffer = Buffer.alloc(4);
                buffer.writeInt32LE(value, 0);
                break;
            case Float:
                buffer = Buffer.alloc(4);
                buffer.writeFloatLE(value, 0);
                break;
            case FStringReversed:
                let rev = value.split('').reverse().join('');
                buffer = Buffer.from(rev as string, 'ascii');
                break;
            case FString:
                buffer = Buffer.from(value as string, 'ascii');
                break;
            default:
                return;
        }

        return this.writeBuffer2(address, buffer);
    }

    public writeAlloc(alloc: AllocationInfo) {
        for (let i = 0; i < alloc.buffer.offset + 1; i++) {
            let b = alloc.buffer.buffer[i];
            this.write(alloc.address + i, UByte, b);
        }
    }
}
