import chalk from 'chalk';
import cliui from 'cliui';
import {Game, PedStatus, Weather} from "../src/entities";
import {Key} from "../src/libs/Keys";
import {Process} from "../src/process";

const ui = cliui({width: 40});

function clear() {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}

Process.instance.open();
let game = Game.instance;
game.clock.time = '12:00'
let player = game.player;
setInterval(() => {
    clear();
    ui.resetOutput();

    ui.div(game.clock.time, chalk.green(`$${game.money.toString().padStart(8, '0')}`), `${Weather[game.weather]}`);
    ui.div(`A ${chalk.gray(player.armor.toFixed(2))}`, `H ${chalk.red(player.health.toFixed(2))}`, '');
    ui.div(player.wanted.stars);
    ui.div('');
    ui.div(`WEAPON: ${player.activeWeaponSlot}`);
    ui.div('');
    if (player.isInVehicle) {
        let car = player.lastControlledVehicle;
        ui.div(` == 🚗 == `);
        ui.div(` ${(car.speed as number * 100).toFixed(2)} m/h`, `${car.health.toFixed(2)}`);
        ui.div(` Siren: ${chalk.green(car.siren)}`);
        ui.div(` Horn: ${chalk.green(car.horn)}`);
        ui.div(` == 🚗 == `);
        ui.div('');
    }
    ui.div(`${PedStatus[player.status]}`);
    ui.div(`${player.weapons.length}`);
    ui.div('');
    ui.div(`${player.position.toString()}`);
    ui.div(`${Key.tab}`);

    console.log(ui.toString());

    if (Key.tab) {
        game.money++;
    }

    if (Key.shift) {
        game.weather = Weather.ExtraSunny;
        game.clock.time = '12:00';
    }
}, 100);

// Process.instance.close();
