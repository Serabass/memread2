import 'reflect-metadata';

import Prop from '../decorators/memory/prop';
import {Entity} from './entity';
import {Vehicle} from './vehicle';
import {Vector3d} from './vector-3d';
import {RemoteFunction} from '../decorators/memory/remote-function';
import MemoryEntity from '../decorators/memory/memory-entity';

@MemoryEntity()
export class Ped extends Entity {

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

    @Prop(0x3A8, Vehicle)
    public lastControlledVehicle: Vehicle;

    @Prop.int(0x596)
    public money: number;

    @Prop.bool(0x140)
    public infiniteRun: boolean;

    @Prop.int(0x170)
    public targetEntity: number;

    @RemoteFunction()
    public duck: () => void;

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }
}
