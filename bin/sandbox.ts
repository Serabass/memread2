import {Game, Player, Vehicle} from "../src/entities";
import {Process} from "../src/process";

function clear() {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}
Process.instance.open();

console.log(Game.instance.player.lastControlledVehicle.wheelStates.json);
