import {Game} from "../src/entities";
import {Process} from "../src/process";
import cliui from 'cliui';
import chalk from 'chalk';
const ui = cliui({width: 60})

function clear() {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}

Process.instance.open();
let player = Game.instance.player;
setInterval(() => {
    // clear();
    ui.resetOutput();

    ui.div(Game.instance.clock.time, chalk.green(`$${Game.instance.money.toString().padStart(8, '0')}`))
    ui.div(`A ${chalk.gray(player.armor.toFixed(2))}`, `H ${chalk.red(player.health.toFixed(2))}`)
    ui.div('');
    ui.div(player.wanted.stars);
    ui.div('');
    ui.div(player.lastControlledVehicle);
    console.log(ui.toString());
}, 1000);

// Process.instance.close();
