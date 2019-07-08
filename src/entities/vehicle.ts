import {MemoryEntity, Prop} from '../decorators';
import {Injector} from "../injector";
import {kernel, WFSO} from "../libs";
import {Process} from "../process";
import {FunctionAddress} from "./functions";
import {Game} from './game';
import {Ped} from './';
import {RadioStation} from './radio-station';
import {Physical} from './physical';

@MemoryEntity()
export class Vehicle extends Physical {
    @Prop.float(0x100)
    public readonly speed: number;

    @Prop.float(0x160)
    public readonly cruiseSpeed: number;

    @Prop.byte(0x1A0)
    public primaryColor: number;

    @Prop.byte(0x1A1)
    public secondaryColor: number;

    @Prop.int(0x1A4)
    public alarmDuration: number;

    @Prop.pointer(0x1A8, Ped)
    public readonly driver: Ped;

    @Prop.array(0x1AC, Ped)
    public readonly passengers: Ped[];

    @Prop.byte(0x1CC)
    public readonly numPassengers: number;

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
        let alloc = inj.alloc(100)
            .buf((b, inc) => {
                // NEED:
                // mov eax, ds: baseAddress
                // mov ecx, eax
                b.writeUInt8(0xA1, inc()); // mov eax, ds: baseAddress
                b.writeUInt32LE(this.baseAddress, inc(4)); // mov eax, ds: baseAddress

                b.writeUInt8(0x89, inc()); // mov ecx, eax
                b.writeUInt8(0xC1, inc()); // mov ecx, eax
            })
            .relativeCall(FunctionAddress.VEHICLE_FIX)
            .ret();

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        let thread = kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        return;
    }
}
