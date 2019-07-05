import 'reflect-metadata';
import MemoryEntity from '../decorators/memory/memory-entity';

import Prop from '../decorators/memory/prop';
import {RemoteFunction} from '../decorators/memory/remote-function';
import {Entity} from './entity';
import {Vector3d} from './vector-3d';
import {Vehicle} from './vehicle';
import {Wanted} from "./wanted";

@MemoryEntity()
export class Ped extends Entity {
    @Prop(0x00000000034, Vector3d) public position: Vector3d;
    @Prop.float(0x000000000000354) public health: number;
    @Prop.float(0x000000000000358) public armor: number;
    @Prop.byte(0x000000000000005C) public modelIndex: number;
    @Prop.array(0x000000056C, Ped) public nearestPeds: Ped[];
    @Prop.short(0x000000000000594) public nearestPedsCount: number;
    @Prop(0x0000000003A8, Vehicle) public lastControlledVehicle: Vehicle;
    @Prop.int(0x00000000000000596) public money: number;
    @Prop.bool(0x0000000000000140) public infiniteRun: boolean;
    @Prop.int(0x00000000000000170) public targetEntity: number;
    @Prop.pointer(0x005F4, Wanted) public wanted: Wanted;
    @Prop.float(0x000000000000378) public rotation: number;
    @Prop.bool(0x00000000000003AC) public isInVehicle: boolean;
    @Prop.bool(0x0000000000000638) public drunkenness: boolean;
    @Prop.pointer(0x00000508, Ped) public targetedPed: Ped;
    @Prop(0x00000000070, Vector3d) public movementSpeed: Vector3d;

    @RemoteFunction() public duck: () => void;

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }
}