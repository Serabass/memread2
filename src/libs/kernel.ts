// https://github.com/stegru/gpii-service/blob/7ee8b8e8179ac0bcfff9f7e7c83abbbb9f2f19e6/src/windows.js

import {Library, Method, never} from 'ffi-decorators';
import arrayType from "ref-array";
import Struct from "ref-struct";

let t = {
    BOOL: "int",
    HANDLE: "uint",
    PHANDLE: "void*",
    LP: "void*",
    SIZE_T: "ulong",
    WORD: "uint16",
    DWORD: "ulong",
    LONG: "long",
    ULONG: "ulong",
    PULONG: "ulong*",
    LPTSTR: "char*",
    Enum: "uint",
};
// GetProcessByName https://github.com/Zysen/node-winprocess/blob/master/winprocess.cc#L117

export let PROCESSENTRY32 = new Struct({
    dwSize: t.DWORD,
    cntUsage: t.DWORD,
    th32ProcessID: t.DWORD,
    th32DefaultHeapID: t.LP,
    th32ModuleID: t.DWORD,
    cntThreads: t.DWORD,
    th32ParentProcessID: t.DWORD,
    pcPriClassBase: t.LONG,
    dwFlags: t.DWORD,
    szExeFile: arrayType("char", 260),
});

function arrToStr(a) {
    return Array
        .from(a)
        .filter((c: any) => c !== 0)
        .map((c: any) => String.fromCharCode(c as any))
        .join('');
}

export const PROCESS_ALL_ACCESS = 0x1fffff;

@Library({libPath: 'kernel32'})
export class Kernel {

    @Method({types: ['bool', ['int', 'int', 'pointer', 'int', 'int']]})
    public ReadProcessMemory(hProcess: number,
                             lpBaseAddress: number,
                             lpBuffer: Buffer,
                             dwSize: number,
                             lpNumberOfBytesRead: any): number {
        return never();
    }

    @Method({types: ['bool', ['int', 'int', 'pointer', 'int', 'int']]})
    public WriteProcessMemory(hProcess: number,
                              lpBaseAddress: number,
                              lpBuffer: Buffer,
                              dwSize: number,
                              lpNumberOfBytesRead: any): number {
        return never();
    }

    @Method({types: ['int', ['int', 'bool', 'int']]})
    public OpenProcess(processAccess: number, bInheritHandle: boolean, processId: number): number {
        return never();
    }

    @Method({types: ['bool', ['int']]})
    public CloseHandle(handle: number) {
        return never();
    }

    @Method({types: ['int', ['int', 'int']]})
    public CreateToolhelp32Snapshot(dwFlags: number, th32ProcessID: any) {
        return never();
    }

    @Method({types: ['bool', [t.DWORD, 'pointer']]})
    public Process32First(hSnapshot: number, lppe: any) {
        return never();
    }

    @Method({types: ['bool', [t.DWORD, 'pointer']]})
    public Process32Next(hSnapshot: number, lppe: any) {
        return never();
    }

    @Method({types: ['int', []]})
    public GetLastError() {
        return never();
    }

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
