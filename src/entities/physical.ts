import 'reflect-metadata';
import {MemoryEntity, Prop} from '../decorators';
import {Entity} from './entity';
import {Vector3d} from "./vector-3d";

@MemoryEntity()
export class Physical extends Entity {
    @Prop(0x70, Vector3d)
    public movementSpeed: Vector3d;
}
