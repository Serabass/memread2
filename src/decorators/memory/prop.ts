import 'reflect-metadata';
import {DATATYPE} from '../../datatype';
import {Ped, Vehicle} from "../../entities";
import {MemoryArray, MemoryArrayPointer, MemoryPointer} from '../../pointer';
import {Byte, Float, Int32, Short, UByte, Bit} from "./native-types";

export function Prop(offset: number, type: DATATYPE = null, meta: any = {}): PropertyDecorator {
    return (target: any, propKey: string | symbol): any => {
        let props = Reflect.getMetadata('mem:props', target);

        if (!type) {
            let designType = Reflect.getMetadata('design:type', target, propKey);
            if (designType) {
                type = designType;
            }
        }

        if (!props) {
            props = {};
        }

        props[propKey] = {offset, type, meta};
        Reflect.defineMetadata('mem:props', props, target);
    };
}

Prop.int = (offset: number) => Prop(offset, Int32);
Prop.float = (offset: number) => Prop(offset, Float);
Prop.ubyte = (offset: number) => Prop(offset, UByte);
Prop.bit = (offset: number, bitIndex: number) => Prop(offset, Bit, {bitIndex});
Prop.byte = (offset: number) => Prop(offset, Byte);
Prop.short = (offset: number) => Prop(offset, Short);
Prop.bool = (offset: number) => Prop(offset, Boolean);
Prop.array = (offset: number, Type: any) => Prop(offset, MemoryArrayPointer.of(Type));
Prop.memArray = (offset: number, Type: any, count: number, size: number) => Prop(offset, MemoryArray.of(Type, count, size));
Prop.pointer = (offset: number, Type: any) => Prop(offset, MemoryPointer.from(Type));
Prop.pedPointer = (offset: number) => Prop(offset, MemoryPointer.from(Ped));
Prop.vehiclePointer = (offset: number) => Prop(offset, MemoryPointer.from(Vehicle));

Prop.define = (type: any = null) => (target: any, propKey: string): any => {
    debugger;
};
