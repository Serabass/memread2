import MemoryEntity from '../decorators/memory/memory-entity';
import Prop from '../decorators/memory/prop';
import {Entity} from './entity';
import Game from './game';
import {Ped} from "./ped";
import {RadioStation} from "./radio-station";

@MemoryEntity()
export class Vehicle extends Entity {
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

    @Prop.pointer(0x1A8)
    public driver: number;

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

    public static get pool() {
        return Game.instance.vehicles;
    }

    constructor(public baseAddress: number) {
        super(baseAddress);
    }
}
