import {MemoryEntity, Prop} from "../decorators/memory";
import {Entity} from "./entity";

@MemoryEntity()
export class Clock extends Entity {
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

    @Prop.byte(0x000A10B6B) public hour: number;
    @Prop.byte(0x000A10B92) public minute: number;
    protected constructor(protected baseAddress: number = 0x0) {
        super(baseAddress);
    }

}
