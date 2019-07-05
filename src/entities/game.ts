import MemoryEntity from '../decorators/memory/memory-entity';
import Prop from '../decorators/memory/prop';
import {Injector} from "../injector";
import {getProcessId, kernel} from "../libs/kernel";
import Cheat from "./cheat";
import {FunctionAddress} from "./functions";
import {GameBase} from './game-base';
import {Player} from './player';
import {Process} from "./Process";
import {Vehicle} from './vehicle';

@MemoryEntity()
export default class Game extends GameBase {
    public static get instance() {
        if (!this.singleton) {
            const processId = getProcessId(this.EXE);

            if (!processId) {
                throw new Error('Process not found');
            }

            this.singleton = new Game();
            this.singleton.process = new Process(processId);
            this.singleton.process.open();
        }

        return this.singleton;
    }

    public static singleton: Game;
    private static EXE: string = 'gta-vc.exe';

    public cheat: Cheat = Cheat.instance;

    @Prop.pointer(0x94AD28, Player) public player: Player;
    @Prop.array(0x0094AD2C, Vehicle) public vehicles: Vehicle[];
    @Prop.int(0x000094ADC8) public money: number;
    @Prop.byte(0x000A10B6B) public hour: number;
    @Prop.byte(0x000A10B92) public minute: number;
    @Prop.float(0x00686FC8) public carDensity: number;
    @Prop.float(0x0068F5F0) public gravity: number;
    @Prop.float(0x0097F264) public timeScale: number;

    protected constructor(protected baseAddress: number = 0x0) {
        super(baseAddress);
    }

    public spawnVehicle(modelIndex: number) {
        let inj = new Injector(this.process);
        let resultAlloc = inj.alloc(4);

        let alloc = inj.alloc(100)
            .pushInt32(modelIndex)
            .relativeCall(FunctionAddress.SPAWN_VEHICLE)
            .movResult(resultAlloc.address)
            .popECX()
            .ret();

        // buf.writeUInt8(0x68, 0); // +1 push
        // buf.writeInt32LE(modelIndex, 1); // +4 modelIndex
        // buf.writeUInt8(0xE8, 5); // relative call
        // let offset = alloc.calculateOffset(5, spawnVehicleFn);
        // buf.writeInt32LE(offset, 6); // fnAddr
        // buf.writeUInt8(0x89, 10);
        // buf.writeUInt8(0x0D, 11); // mov DWORD PTR ds:result
        // buf.writeInt32LE(resultAlloc.address, 12);
        // buf.writeUInt8(0x59, 16); // pop ecx
        // buf.writeUInt8(0xC3, 17); // ret

        this.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        kernel.CreateRemoteThread(this.process.handle, null, 0, alloc.address, alloc.address, 0, aa);
        let res = this.read(resultAlloc.address, 'int');
        let res2 = this.read(res as number, 'int');

        if (typeof res !== 'number') {
            debugger;
            throw new Error();
        }
        return new Vehicle(res as number);
    }
}
