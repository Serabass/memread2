import 'reflect-metadata';
import {MemoryEntity, Prop, RemoteFunction} from '../decorators';
import {PedStatus, Physical, Vector3d, Vehicle, Wanted} from "./";

@MemoryEntity()
export class Ped extends Physical {
    @Prop(0x34, Vector3d)
    public position: Vector3d;

    @Prop.bool(0x140)
    public infiniteRun: boolean;

    @Prop.int(0x170)
    public targetEntity: number;

    @Prop.int(0x244)
    public status: PedStatus;

    @Prop.float(0x354)
    public health: number;

    @Prop.float(0x358)
    public armor: number;

    @Prop.float(0x378)
    public rotation: number;

    @Prop.pointer(0x3A8, Vehicle)
    public lastControlledVehicle: Vehicle;

    @Prop.bool(0x3AC)
    public isInVehicle: boolean;

    @Prop.byte(0x504)
    public activeWeaponSlot: number;

    @Prop.byte(0x506)
    public weaponAccuracy: number;

    @Prop.pointer(0x508, Ped)
    public targetedPed: Ped;

    @Prop.array(0x56C, Ped)
    public nearestPeds: Ped[];

    @Prop.short(0x594)
    public nearestPedsCount: number;

    @Prop.int(0x596)
    public money: number;

    @Prop.pointer(0x5F4, Wanted)
    public wanted: Wanted;

    @Prop.bool(0x638)
    public drunkenness: boolean;

    @Prop.bool(0x639)
    public drunkennessCountdownToggle: number;

    @RemoteFunction()
    public duck: () => void;

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }

    public kill() {
        this.health = 0;
    }
}
