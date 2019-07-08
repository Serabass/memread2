import {Key} from "ts-keycode-enum";
import {user32} from "../libs";

export class Keyboard {
    public static keyPressed(keyCode: Key) {
        return user32.GetKeyState(keyCode) < 0;
    }
}
