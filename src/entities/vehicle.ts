import {MemoryEntity, Prop} from '../decorators';
import {Game} from './game';
import {Ped} from './ped';
import {RadioStation} from './radio-station';
import {Physical} from './physical';

@MemoryEntity()
export class Vehicle extends Physical {
    @Prop.float(0x100)
    public speed: number;

    @Prop.float(0x160)
    public cruiseSpeed: number;

    @Prop.byte(0x1A0)
    public primaryColor: number;

    @Prop.byte(0x1A1)
    public secondaryColor: number;

    @Prop.int(0x1A4)
    public alarmDuration: number;

    @Prop.pointer(0x1A8, Ped)
    public driver: Ped;

    @Prop.array(0x1AC, Ped)
    public passengers: Ped[];

    @Prop.byte(0x1CC)
    public numPassengers: number;

    @Prop.byte(0x1D0)
    public maxPassengers: number;

    @Prop.int(0x230)
    public lockStatus: number;

    @Prop.int(0x23C)
    public radioStation: RadioStation;

    @Prop.float(0x354)
    public health: number;

    constructor(public baseAddress: number) {
        super(baseAddress);
    }

    public static get pool() {
        return Game.instance.vehicles;
    }
}
