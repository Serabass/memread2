import 'reflect-metadata';
import MemoryEntity from '../decorators/memory/memory-entity';

import Prop from '../decorators/memory/prop';
import {RemoteFunction} from '../decorators/memory/remote-function';
import {Physical} from "./physical";
import {Vector3d} from './vector-3d';
import {Vehicle} from './vehicle';
import {Wanted} from "./wanted";

@MemoryEntity()
export class Ped extends Physical {
    @Prop(0x34, Vector3d)
    public position: Vector3d;

    @Prop.float(0x354)
    public health: number;

    @Prop.float(0x358)
    public armor: number;

    @Prop.byte(0x5C)
    public modelIndex: number;

    @Prop.array(0x56C, Ped)
    public nearestPeds: Ped[];

    @Prop.short(0x594)
    public nearestPedsCount: number;

    @Prop.pointer(0x3A8, Vehicle)
    public lastControlledVehicle: Vehicle;

    @Prop.int(0x596)
    public money: number;

    @Prop.bool(0x140)
    public infiniteRun: boolean;

    @Prop.int(0x170)
    public targetEntity: number;

    @Prop.pointer(0x5F4, Wanted)
    public wanted: Wanted;

    @Prop.float(0x378)
    public rotation: number;

    @Prop.bool(0x3AC)
    public isInVehicle: boolean;

    @Prop.bool(0x638)
    public drunkenness: boolean;

    @Prop.bool(0x639)
    public drunkennessCountdownToggle: number;

    @Prop.byte(0x504)
    public activeWeaponSlot: number;

    @Prop.byte(0x506)
    public weaponAccuracy: number;

    @Prop.pointer(0x508, Ped)
    public targetedPed: Ped;

    @Prop(0x70, Vector3d)
    public movementSpeed: Vector3d;

    @RemoteFunction()
    public duck: () => void;

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }

    public kill() {
        this.health = 0;
    }
}
