import chalk from 'chalk';
import cliui from 'cliui';
import {Game, MODEL, Ped, RadioStation, VehicleType, Weather} from "../src/entities";
import {WheelState} from "../src/entities/wheels";
import {Key} from "../src/libs/Keys";
import {Process} from "../src/process";

function coin() {
    return Math.random() >= 0.5;
}

const INTERVAL = 500;

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

let fn = () => {
    clear();
    ui.resetOutput();

    player.fireProof = true;
    player.canBeDamaged = true;
    player.health = 250;
    ui.div('');

    ui.div(game.clock.time, chalk.green(`$${game.money.toString().padStart(8, '0')}`), `${Weather[game.weather]}`);
    ui.div(`A ${chalk.gray(player.armor.toFixed(2))}`, `H ${chalk.red(player.health.toFixed(2))}`, '');
    ui.div(player.wanted.stars);
    ui.div('');
    ui.div(` 🔪 : ${player.activeWeaponSlot} / ${player.weapons.length}`);
    ui.div('');
    ui.div(`${player.position.toString()}`);
    ui.div(`Can be damaged: ${player.canBeDamaged}`);


    if (player.lastDamagedBy) {
        ui.div(`LastDamaged: ${MODEL[player.lastDamagedBy.modelIndex]}`);
    }

    if (player.isInVehicle) {
        let car = player.lastControlledVehicle;
        ui.div('');
        ui.div(` |  ${(car.speed as number * 100).toFixed(2)} m/h`, `${car.health.toFixed(2)}`);
        ui.div(` |  Model: ${(MODEL[car.modelIndex])}`);
        ui.div(` |  Siren: ${(car.siren ? '🗸' : '')}`);
        ui.div(` |  Horn: ${(car.horn ? '🗸' : '')}`);
        ui.div(` |  Accelerator Pedal: ${car.acceleratorPedal}`);
        ui.div(` |  Radio: ${RadioStation[car.radioStation]}`);
        ui.div(` |  Type: ${VehicleType[car.type]}`);
        ui.div(` |  Mass: ${car.mass}`);
        ui.div(` |  ============================================== `);
        ui.div(` |  Colors: ${car.colors.primary} | ${car.colors.secondary}`);

        if (Key.tab) {
            car.health = 1000;
            car.wheelStates.leftFront = WheelState.NORMAL;
            car.wheelStates.leftRear = WheelState.NORMAL;
            car.wheelStates.rightFront = WheelState.NORMAL;
            car.wheelStates.rightRear = WheelState.NORMAL;
        }
    }

    ui.div('');
    // ui.div(`Sandbox: ${player.nearestPeds.map(p => p.isCrouching)}`);
    ui.div(`Sandbox: ${player.flags1.isCrouching}`);

    console.log(ui.toString());

    if (Key.N2) {
        game.weather = Weather.ExtraSunny;
        game.clock.time = '12:00';
    }

    if (Key.N3) {
        player.wanted.chaosLevel = 5000;
    }

    if (Key.tab) {
        console.log('Processing...');
        console.log('Complete!');
    }


    setTimeout(fn, INTERVAL);
};

setTimeout(fn, INTERVAL);

// Process.instance.close();
