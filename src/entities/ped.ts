import 'reflect-metadata';
import {MemoryEntity, Prop} from '../decorators';
import {Byte, Float, Int32, Short} from "../decorators/memory/native-types";
import {Injector} from "../injector";
import {kernel, WFSO} from "../libs";
import {Process} from "../process";
import {Drunkenness} from "./drunkenness";
import {FunctionAddress} from "./functions";
import {PedStatus} from "./ped-status";
import {Vector3d} from "./vector-3d";
import {Physical} from "./physical";
import {Vehicle} from "./vehicle";
import {Wanted} from "./wanted";

@MemoryEntity()
export class Ped extends Physical {
    @Prop(0x34, Vector3d)
    public position: Vector3d;

    @Prop(0x170) public readonly targetEntity: Int32;

    @Prop.int(0x244) public readonly status: PedStatus;

    @Prop(0x140) public infiniteRun: boolean;
    @Prop(0x354) public health: Float;
    @Prop(0x358) public armor: Float;
    @Prop(0x378) public rotation: Float;
    @Prop(0x3AC) public isInVehicle: boolean;
    @Prop(0x504) public activeWeaponSlot: Byte;
    @Prop(0x506) public weaponAccuracy: Byte;
    @Prop(0x594) public readonly nearestPedsCount: Short;
    @Prop(0x596) public money: Int32;

    @Prop.vehiclePointer(0x3A8)
    public lastControlledVehicle: Vehicle;

    @Prop.pointer(0x508, Ped)
    public readonly targetedPed: Ped;

    @Prop.array(0x56C, Ped)
    public readonly nearestPeds: Ped[];

    @Prop.pointer(0x5F4, Wanted)
    public wanted: Wanted;

    @Prop(0x638, Drunkenness)
    public drunkenness: Drunkenness;

    public duck() {
        let inj = new Injector();
        let resultAlloc = inj.alloc(4);
        let alloc = inj.alloc(100)
            .movDSToEcx(this.baseAddress)
            .relativeCall(FunctionAddress.PED_DUCK)
            .ret();

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        let thread = kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        let res = Process.instance.read(resultAlloc.address, Int32);
        let res2 = Process.instance.read(res as number, Int32);

        if (typeof res !== 'number') {
            throw new Error();
        }

        return res;
    }

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }

    public kill() {
        this.health = 0;
    }
}
