import {FunctionAddress, Game} from "../src/entities";
import {Injector} from "../src/injector";
import {Key} from "../src/libs/Keys";
import {Process} from "../src/process";

function clear() {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}
clear();
Process.instance.open();

Game.instance.helpMessage('CHEAT1');
