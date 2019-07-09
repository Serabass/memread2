import {MemoryEntity, Prop} from '../decorators';
import {Byte, Float, Int32} from "../decorators/memory/native-types";
import {Injector} from "../injector";
import {kernel, WFSO} from "../libs";
import {Process} from "../process";
import {FunctionAddress} from "./functions";
import {Game} from './game';
import {Physical} from './physical';
import {RadioStation} from './radio-station';

@MemoryEntity()
export class Vehicle extends Physical {
    @Prop(0x100)
    public readonly speed: Float;

    @Prop(0x160)
    public readonly cruiseSpeed: Float;

    @Prop(0x1A0)
    public primaryColor: Byte;

    @Prop(0x1A1)
    public secondaryColor: Byte;

    @Prop(0x1A4)
    public alarmDuration: Int32;

    // @Prop.pedPointer(0x1A8)
    // public readonly driver: Ped;

    // @Prop.array(0x1AC, Ped)
    // public readonly passengers: Ped[];

    @Prop(0x1CC)
    public readonly numPassengers: Byte;

    @Prop(0x1D0)
    public maxPassengers: Byte;

    @Prop(0x230)
    public lockStatus: Int32;

    @Prop.int(0x23C)
    public radioStation: RadioStation;

    @Prop(0x204)
    public health: Float;

    constructor(public baseAddress: number) {
        super(baseAddress);
    }

    public static get pool() {
        return Game.instance.vehicles;
    }

    public fix() {
        let inj = new Injector();
        let alloc = inj.alloc(100)
            .buf((b) => {
                // NEED:
                // mov eax, ds: baseAddress
                // mov ecx, eax
                b.writeUint8(0xA1); // mov eax, ds: baseAddress
                b.writeUint32(this.baseAddress); // mov eax, ds: baseAddress

                b.writeUint8(0x89); // mov ecx, eax
                b.writeUint8(0xC1); // mov ecx, eax
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
