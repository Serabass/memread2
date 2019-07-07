import {Player} from "./entities";
import {user32} from "./libs";

setInterval(() => {
    Player.instance.health = 120;
    if (user32.GetKeyState(9) < 0) {
        let car = Player.instance.getCar();
        console.log(car.health);
        console.log(car.modelIndex);
    }
}, 500);

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
