import {Game, Weather} from "../src/entities";
import {Process} from "../src/process";
import cliui from 'cliui';
import chalk from 'chalk';
const ui = cliui({width: 60})

function clear() {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}

Process.instance.open();
let game = Game.instance;
let player = game.player;
setInterval(() => {
    clear();
    ui.resetOutput();

    ui.div(game.clock.time, chalk.green(`$${game.money.toString().padStart(8, '0')}`), `${Weather[game.weather]}`)
    ui.div(`A ${chalk.gray(player.armor.toFixed(2))}`, `H ${chalk.red(player.health.toFixed(2))}`, '')
    ui.div('');
    ui.div(player.wanted.stars);
    ui.div('');
    ui.div(`${player.activeWeaponSlot}`);
    ui.div('');
    ui.div(`${player.position.toString()}`);
    console.log(ui.toString());
}, 100);

// Process.instance.close();
