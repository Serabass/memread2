import 'reflect-metadata';
import {MemoryEntity, Prop} from '../decorators';
import {Entity} from './entity';
import {MODEL} from "./model";
import {Vector3d} from './vector-3d';

@MemoryEntity()
export class Physical extends Entity {
    @Prop(0x70, Vector3d)
    public readonly movementSpeed: Vector3d;

    @Prop.ubyte(0x5C)
    public readonly modelIndex: MODEL;
}
