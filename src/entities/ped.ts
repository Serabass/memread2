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
    @Prop.float(0x00354) public health: number;
    @Prop.float(0x00358) public armor: number;
    @Prop.byte(0x00005C) public modelIndex: number;
    @Prop.array(0x0056C, Ped) public nearestPeds: Ped[];
    @Prop.short(0x00594) public nearestPedsCount: number;
    @Prop(0x000000003A8, Vehicle) public lastControlledVehicle: Vehicle;
    @Prop.int(0x0000596) public money: number;
    @Prop.bool(0x000140) public infiniteRun: boolean;
    @Prop.int(0x0000170) public targetEntity: number;
    @Prop.pointer(0x5F4, Wanted) public wanted: Wanted;
    @Prop.float(0x00378) public rotation: number;
    @Prop.bool(0x003AC) public isInVehicle: boolean;
    @RemoteFunction() public duck: () => void;

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }
}
