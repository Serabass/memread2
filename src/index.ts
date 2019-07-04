import ref from "ref";
import struct from "ref-struct";
import 'reflect-metadata';
// Create a class instance and native calls are proxied
import {Kernel} from "./libs/kernel";

const myLib = new Kernel();
let a = struct({
    dwSize: 'int',
    cntUsage: 'int',
    th32ProcessID: 'ulong *',
    th32DefaultHeapID: 'ulong *',
    th32ModuleID: 'int',
    cntThreads: 'int',
    th32ParentProcessID: 'int',
    pcPriClassBase: 'long',
    dwFlags: 'int',
    szExeFile: 'string',
});

let a1 = new a();
let structPtr = a1.ref();
debugger;
let snapshot = myLib.CreateToolhelp32Snapshot(0x00000002, null);
let x = myLib.Process32First(snapshot, 0);
debugger;
console.log(x);

/*
let proc = myLib.OpenProcess(0x001F0FFF, false, 224);
let pointer = ref.alloc('pointer');
myLib.ReadProcessMemory(proc, 0x94ADC8, pointer, 4, 0);
let r = pointer.readInt32BE(0);
let r2 = pointer.readInt32LE(0);
debugger;
let res = myLib.CloseHandle(proc);
debugger;
*/
