import {MemoryEntity, Prop} from '../decorators';
import {Injector} from "../injector";
import {kernel, WFSO} from "../libs";
import {Process} from "../process";
import {FunctionAddress} from "./functions";
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

    public fix() {
        let inj = new Injector();
        let resultAlloc = inj.alloc(4);
        let alloc = inj.alloc(100)
            .movDWORDPTRToEcx(this.baseAddress)
            .relativeCall(FunctionAddress.VEHICLE_FIX)
            .ret();

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        let thread = kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        let res = Process.instance.read(resultAlloc.address, 'int');
        let res2 = Process.instance.read(res as number, 'int');

        if (typeof res !== 'number') {
            throw new Error();
        }

        return res;
    }
}
