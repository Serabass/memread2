import {Key} from 'ts-keycode-enum';
import {Game} from "./entities";
import {Keyboard} from "./entities/keyboard";

setInterval(() => {
    if (Keyboard.keyPressed(Key.Tab)) {
        Game.instance.spawnVehicle(206);
    }
}, 500);
