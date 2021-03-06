import {MemoryEntity, Prop} from "../decorators/memory";
import {Byte} from "../decorators/memory/native-types";
import {Entity} from "./entity";

@MemoryEntity()
export class Clock extends Entity {
    @Prop(0x6B) public hour: Byte;
    @Prop(0x92) public minute: Byte;

    public static singleton: Clock;

    public static get instance() {
        if (!this.singleton) {
            this.singleton = new Clock();
        }

        return this.singleton;
    }

    public get time(): string {
        let h = this.hour;
        let m = this.minute;
        let hh;
        let mm;

        hh = h < 10 ? `0${h}` : `${h}`;
        mm = m < 10 ? `0${m}` : `${m}`;

        return `${hh}:${mm}`;
    }

    public set time(time: string) {
        let regExp = /(\d\d):(\d\d)/;
        let match = time.match(regExp);
        if (match) {
            let [, h, m] = match;
            this.hour = +h;
            this.minute = +m;
        }
    }

    protected constructor(public baseAddress: number = 0x0) {
        super(baseAddress);
    }

}
