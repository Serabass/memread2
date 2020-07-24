// https://github.com/stegru/gpii-service/blob/7ee8b8e8179ac0bcfff9f7e7c83abbbb9f2f19e6/src/windows.js

import arrayType from "ref-array";
import Struct from "ref-struct";
import {Library, Method, Params, Ret} from "../decorators/ffi/method";
import {types} from "./types";

// GetProcessByName https://github.com/Zysen/node-winprocess/blob/master/winprocess.cc#L117

export enum ProcessAccessFlags {
    All = 0x001F0FFF,
    Terminate = 0x00000001,
    CreateThread = 0x00000002,
    VirtualMemoryOperation = 0x00000008,
    VirtualMemoryRead = 0x00000010,
    VirtualMemoryWrite = 0x00000020,
    DuplicateHandle = 0x00000040,
    CreateProcess = 0x000000080,
    SetQuota = 0x00000100,
    SetInformation = 0x00000200,
    QueryInformation = 0x00000400,
    QueryLimitedInformation = 0x00001000,
    Synchronize = 0x00100000
}

export let PROCESSENTRY32 = new Struct({
    dwSize: types.DWORD,
    cntUsage: types.DWORD,
    th32ProcessID: types.DWORD,
    th32DefaultHeapID: types.LP,
    th32ModuleID: types.DWORD,
    cntThreads: types.DWORD,
    th32ParentProcessID: types.DWORD,
    pcPriClassBase: types.LONG,
    dwFlags: types.DWORD,
    szExeFile: arrayType("char", 260),
});

function arrToStr(a) {
    return Array
        .from(a)
        .filter((c: any) => c !== 0)
        .map((c: any) => String.fromCharCode(c as any))
        .join('');
}

export enum WFSO {
    INFINITE = 0xFFFFFFFF,
    WAIT_ABANDONED = 0x00000080,
    WAIT_OBJECT_0 = 0x00000000,
    WAIT_TIMEOUT = 0x00000102,
}

/**
 * TODO Implement VirtualFreeEx method
 */
@Library({libPath: 'kernel32'})
export class Kernel {
    private static singleton: Kernel;

    public static get instance() {
        if (!this.singleton) {
            this.singleton = new Kernel();
        }

        return this.singleton;
    }

    @Method()
    @Params('int', 'int', 'pointer', 'int', 'int')
    @Ret.bool()
    public ReadProcessMemory: (hProcess: number,
                               lpBaseAddress: number,
                               lpBuffer: Buffer,
                               dwSize: number,
                               lpNumberOfBytesRead: any) => boolean;

    @Method()
    @Params('int', 'int', 'pointer', 'int', 'int')
    @Ret.bool()
    public WriteProcessMemory: (hProcess: number,
                                lpBaseAddress: number,
                                lpBuffer: Buffer,
                                dwSize: number,
                                lpNumberOfBytesRead: any) => boolean;

    @Method()
    @Params('int', 'bool', 'int')
    @Ret.int()
    public OpenProcess: (processAccess: number,
                         bInheritHandle: boolean,
                         processId: number) => number;

    @Method()
    @Params('int')
    @Ret.bool()
    public CloseHandle: (handle: number) => boolean;

    @Method()
    @Params('int', 'int')
    @Ret.int()
    public CreateToolhelp32Snapshot: (dwFlags: number,
                                      th32ProcessID: any) => number;

    @Method()
    @Params(types.DWORD, 'pointer')
    @Ret.bool()
    public Process32First: (hSnapshot: number,
                            lppe: any) => boolean;

    @Method()
    @Params(types.DWORD, 'pointer')
    @Ret.bool()
    public Process32Next: (hSnapshot: number,
                           lppe: any) => boolean;

    @Method()
    @Ret.int()
    public GetLastError: () => number;

    @Method()
    @Params('int', 'void *', 'ulong', 'uint', 'uint')
    @Ret.int()
    public VirtualAllocEx: (hProcess,
                            lpAddress,
                            dwSize,
                            flAllocationType,
                            flProtect) => number;

    @Method()
    @Params('int', 'int', 'ulong', 'uint', 'int', 'uint', 'uint *')
    @Ret.int()
    public CreateRemoteThread: (hProcess,
                                lpThreadAttributes,
                                dwStackSize,
                                lpStartAddress,
                                lpParameter,
                                dwCreationFlags,
                                lpThreadId) => number;

    @Method()
    @Params('int', 'uint')
    @Ret.int()
    public WaitForSingleObject: (hProcess, wait) => number;
}

export function getProcessId(exeName: string) {
    let pEntry = new PROCESSENTRY32();
    pEntry.dwSize = PROCESSENTRY32.size;
    let snapshot = kernel.CreateToolhelp32Snapshot(0x00000002, null);
    let proc = kernel.Process32First(snapshot, pEntry.ref());

    do {
        let exe = arrToStr(pEntry.szExeFile);
        if (exe === exeName) {
            return pEntry.th32ProcessID;
        }
        pEntry = new PROCESSENTRY32();
        pEntry.dwSize = PROCESSENTRY32.size;
        proc = kernel.Process32Next(snapshot, pEntry.ref());
    } while (proc);
}

export const kernel = new Kernel();
