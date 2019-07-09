import {MemoryEntity, Prop} from '../decorators';
import {Byte, Float, Int32} from "../decorators/memory/native-types";
import {Injector} from "../injector";
import {kernel} from "../libs";
import {Process} from "../process";
import {Clock} from "./clock";
import {FunctionAddress} from "./functions";
import {GameBase} from "./game-base";
import {Player} from "./player";
import {Vehicle} from "./vehicle";

@MemoryEntity()
export class Game extends GameBase {
    public static singleton: Game;

    @Prop.pointer(0x94AD28, Player)
    public player: Player;

    @Prop.array(0x0094AD2C, Vehicle)
    public vehicles: Vehicle[];

    @Prop(0x000094ADC8) public money: Int32;
    @Prop(0x0000686FC8) public carDensity: Float;
    @Prop(0x000068F5F0) public gravity: Float;
    @Prop(0x000097F264) public timeScale: Float;
    @Prop(0x000068723B) public trafficAccidents: Byte;
    @Prop(0x0000A10AB5) public freeRespray: boolean;
    @Prop(0x0000489D79) public goodCitizenBonus: Byte;

    @Prop(0x000A10B00) public clock: Clock;

    protected constructor(protected baseAddress: number = 0x0) {
        super(baseAddress);
    }

    public static get instance() {
        if (!this.singleton) {
            this.singleton = new Game();
        }

        return this.singleton;
    }

    public spawnVehicle(modelIndex: number) {
        let inj = new Injector();
        let resultAlloc = inj.alloc(4);
        let alloc = inj.alloc(100)
            .pushInt32(modelIndex)
            .relativeCall(FunctionAddress.SPAWN_VEHICLE)
            .movResult(resultAlloc.address)
            .popECX()
            .ret();

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);
        let res = Process.instance.read(resultAlloc.address, Int32);
        let res2 = Process.instance.read(res as number, Int32);

        if (typeof res !== 'number') {
            throw new Error();
        }

        return new Vehicle(res as number);
    }

    public blowUpVehicle(addr: number) {
        let inj = new Injector();

        let alloc = inj.alloc(100)
            .uInt8(0xB9).int32(addr)
            .uInt8(0x8B).uInt8(0x39)
            .pushUInt8(0x00)
            .relativeCall(FunctionAddress.BLOWUP_VEHICLE)
            .ret()
        ;
        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);
    }

    public helpMessage(text: string) {
        let inj = new Injector();
        let stringAlloc = inj.alloc(10);
        let resultAlloc = inj.alloc(4);

        let buf = Buffer.from(text, 'utf-8');
        kernel.WriteProcessMemory(Process.instance.handle, stringAlloc.address,
            buf, buf.length, 0);

        let alloc = inj.alloc(100)
            // .movEAXOffset(stringAlloc.address)
                .pushUInt8(0)
                .pushUInt8(0)
                .pushUInt8(0)
                // .pushEAX()
                .relativeCall(FunctionAddress.SET_HELP_MESSAGE)
                .ret()
        ;

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);
        let res = Process.instance.read(resultAlloc.address, Int32);
        let res2 = Process.instance.read(res as number, Int32);

        if (typeof res !== 'number') {
            throw new Error();
        }
        return new Vehicle(res as number);
    }
}
