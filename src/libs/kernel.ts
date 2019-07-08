// https://github.com/stegru/gpii-service/blob/7ee8b8e8179ac0bcfff9f7e7c83abbbb9f2f19e6/src/windows.js

import arrayType from "ref-array";
import Struct from "ref-struct";
import {Library, Method} from "../decorators/ffi/method";
import {Param} from "../decorators/ffi/param";
import {types} from "./types";

// GetProcessByName https://github.com/Zysen/node-winprocess/blob/master/winprocess.cc#L117

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

export const PROCESS_ALL_ACCESS = 0x1fffff;

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

    @Method({types: ['bool', ['int', 'int', 'pointer', 'int', 'int']]})
    public ReadProcessMemory: (hProcess: number,
                               lpBaseAddress: number,
                               lpBuffer: Buffer,
                               dwSize: number,
                               lpNumberOfBytesRead: any) => number;

    @Method({types: ['bool', ['int', 'int', 'pointer', 'int', 'int']]})
    public WriteProcessMemory: (hProcess: number,
                                lpBaseAddress: number,
                                lpBuffer: Buffer,
                                dwSize: number,
                                lpNumberOfBytesRead: any) => number;

    @Method({types: ['int', ['int', 'bool', 'int']]})
    public OpenProcess: (processAccess: number,
                         bInheritHandle: boolean,
                         processId: number) => number;

    @Method({types: ['bool', ['int']]})
    public CloseHandle: (handle: number) => boolean;

    @Method({types: ['int', ['int', 'int']]})
    public CreateToolhelp32Snapshot: (dwFlags: number,
                                      th32ProcessID: any) => number;

    @Method({types: ['bool', [types.DWORD, 'pointer']]})
    public Process32First: (hSnapshot: number,
                            lppe: any) => boolean;

    @Method({types: ['bool', [types.DWORD, 'pointer']]})
    public Process32Next: (hSnapshot: number,
                           lppe: any) => boolean;

    @Method({types: ['int', []]})
    public GetLastError: () => number;

    @Method({types: ['int', ['int', 'void *', 'ulong', 'uint', 'uint']]})
    public VirtualAllocEx: (hProcess,
                            lpAddress,
                            dwSize,
                            flAllocationType,
                            flProtect) => number;

    @Method({types: ['int', ['int', 'int', 'ulong', 'uint', 'int', 'uint', 'uint *']]})
    public CreateRemoteThread: (hProcess,
                                lpThreadAttributes,
                                dwStackSize,
                                lpStartAddress,
                                lpParameter,
                                dwCreationFlags,
                                lpThreadId) => number;

    @Method({types: ['int', ['int', 'uint']]})
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
