import 'reflect-metadata';
import MemoryEntity from '../decorators/memory/memory-entity';
import Prop from '../decorators/memory/prop';
import {Entity} from './entity';

type x = number;

@MemoryEntity()
export class Physical extends Entity {
    @Prop.sandbox
    public sandbox: x;
}
