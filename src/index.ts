import Game from "./entities/game";

let instance = Game.instance;

setInterval(() => {
    console.log(instance.player.ped.isInVehicle);
}, 1000);
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
