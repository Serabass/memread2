import chalk from 'chalk';
import cliui from 'cliui';
import {Game, PedStatus, RadioStation, VehicleType, Weather} from "../src/entities";
import {Key} from "../src/libs/Keys";
import {Process} from "../src/process";

function clear() {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}

const ui = cliui({width: 40});

Process.instance.open();
let game = Game.instance;
game.carDensity = 0.0;
game.clock.time = '12:00';
let player = game.player;

setInterval(() => {
    clear();
    ui.resetOutput();

    ui.div(`${Game.instance.vehicles.length}`);
    ui.div('');

    ui.div(game.clock.time, chalk.green(`$${game.money.toString().padStart(8, '0')}`), `${Weather[game.weather]}`);
    ui.div(`A ${chalk.gray(player.armor.toFixed(2))}`, `H ${chalk.red(player.health.toFixed(2))}`, '');
    ui.div(player.wanted.stars);
    ui.div('');
    ui.div(` 🔪 : ${player.activeWeaponSlot}`);
    ui.div('');
    ui.div(`${PedStatus[player.status]}`);
    ui.div(`${player.weapons.length}`);
    ui.div('');
    ui.div(`${player.position.toString()}`);
    ui.div(`Can be damaged: ${player.canBeDamaged}`);


    if (player.isInVehicle) {
        let car = player.lastControlledVehicle;
        ui.div(` |  == 🚗 == `);
        ui.div(` |  ${(car.speed as number * 100).toFixed(2)} m/h`, `${car.health.toFixed(2)}`);
        ui.div(` |  Siren: ${(car.siren ? '🗸' : '')}`);
        ui.div(` |  Horn: ${(car.horn ? '🗸' : '')}`);
        ui.div(` |  Accelerator Pedal: ${car.acceleratorPedal}`);
        ui.div(` |  Radio: ${RadioStation[car.radioStation]}`);
        ui.div(` |  Type: ${VehicleType[car.type]}`);
        ui.div(` |  Mass: ${car.mass}`);
        ui.div(` |  Burnout: ${car.carBurnout}`);
        ui.div(` |  specialProps: ${car.specialProps.toString(2)}`);
        ui.div(` |  == 🚗 == `);
        ui.div(' | ');

        if (Key.ctrl) {
            car.collisionPower++;
        }
    }

    for (let p of player.nearestPeds) {
        p.health = 100;
        p.armor = 0;
    }

    console.log(ui.toString());

    if (Key.tab) {
        player.canBeDamaged = !player.canBeDamaged;
        player.fastShoot = !player.fastShoot;
    }

    if (Key.shift) {
        game.weather = Weather.ExtraSunny;
        game.clock.time = '12:00';
    }
}, 300);

// Process.instance.close();
