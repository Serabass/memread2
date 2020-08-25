import {Game, Weather} from "../src/entities";
import {WheelState} from "../src/entities/wheels";
import {Process} from "../src/process";

Process.instance.open();

let game = Game.instance;
let clock = game.clock;
let player = game.player;

setInterval(() => {
    clock.time = '12:00';
    player.canBeDamaged = false;
}, 10000);

setInterval(() => {
    player.health = 800;
    player.activeWeapon.clip = 100;

    if (player.isInVehicle) {
        let lastControlledVehicle = player.lastControlledVehicle;
        lastControlledVehicle.health = 1000;
        lastControlledVehicle.wheelStates.rightRear = WheelState.NORMAL;
        lastControlledVehicle.wheelStates.rightFront = WheelState.NORMAL;
        lastControlledVehicle.wheelStates.leftRear = WheelState.NORMAL;
        lastControlledVehicle.wheelStates.leftFront = WheelState.NORMAL;
    }
}, 1000);

let callback = function() {
    game.weather = Weather.ExtraSunny;
};
callback();

setInterval(callback, 5000);
