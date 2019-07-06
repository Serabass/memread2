import 'reflect-metadata';
import {MemoryEntity, Prop} from '../decorators';
import {Entity, Vector3d} from './';

@MemoryEntity()
export class Physical extends Entity {
    @Prop(0x70, Vector3d)
    public movementSpeed: Vector3d;
}
