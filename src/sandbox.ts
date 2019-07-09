import {Key} from "ts-keycode-enum";
import {Game} from "./entities";
import {user32} from "./libs";

setInterval(() => {
    if (Game.instance.player.targetedPed) {
        Game.instance.player.targetedPed.kill();
    }
}, 1000);
