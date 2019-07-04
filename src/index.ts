import ref from "ref";
import 'reflect-metadata';

// Create a class instance and native calls are proxied
import {Kernel} from "./libs/kernel";

const myLib = new Kernel();
let proc = myLib.OpenProcess(0x001F0FFF, false, 224);
let pointer = ref.alloc('pointer');
myLib.ReadProcessMemory(proc, 0x94ADC8, pointer, 4, 0);
let r = pointer.readInt32BE(0);
let r2 = pointer.readInt32LE(0);
debugger;
let res = myLib.CloseHandle(proc);
debugger;
