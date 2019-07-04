import {Library, Method, never} from 'ffi-decorators';

// GetProcessByName https://github.com/Zysen/node-winprocess/blob/master/winprocess.cc#L117

/**
 * Needed:
 *  CreateToolhelp32Snapshot
 *  Process32First
 *  Process32Next
 */

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

    @Method({types: ['int', ['int', 'bool', 'int']]})
    public OpenProcess(processAccess: number, bInheritHandle: boolean, processId: number) {
        return never();
    }

    @Method({types: ['bool', ['int']]})
    public CloseHandle(handle: number) {
        return never();
    }
}
