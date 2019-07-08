import {Key} from 'ts-keycode-enum';
import {Keyboard} from "./entities/keyboard";
import {user32} from "./libs";

setInterval(() => {
    if (Keyboard.keyPressed(Key.Tab)) {
        user32.MessageBox(0, "", "", 0);
    }
}, 500);
