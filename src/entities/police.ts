import {MemoryEntity, Prop} from '../decorators';
import {MODEL} from "./model";

@MemoryEntity()
export class Police {
    @Prop.int(0x426A21) public static firstCar: MODEL;
    @Prop.int(0x426987) public static secondCar: MODEL;
    @Prop.int(0x42697E) public static enforcer: MODEL;
    @Prop.int(0x4268B8) public static chee1: MODEL;
    @Prop.int(0x4268D3) public static chee2: MODEL;
    @Prop.int(0x4268EE) public static chee3: MODEL;
    @Prop.int(0x426909) public static chee4: MODEL;
    @Prop.int(0x4269BA) public static fbiCar: MODEL;
    @Prop.int(0x426A0A) public static barracks: MODEL;
    @Prop.int(0x426A14) public static rhino: MODEL;

    @Prop.int(0x4ED762) public static policeman: MODEL;
    @Prop.int(0x4ED76B) public static policeman2: MODEL;
    @Prop.int(0x4ED7C3) public static swat: MODEL;
    @Prop.int(0x4ED812) public static fbiPed: MODEL;
    @Prop.int(0x4ED834) public static army: MODEL;

    protected constructor(protected baseAddress: number = 0x0) {
    }
}
