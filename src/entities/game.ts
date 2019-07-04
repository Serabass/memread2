import MemoryEntity from '../decorators/memory/memory-entity';
import Prop from '../decorators/memory/prop';
import {getProcessId} from "../libs/kernel";
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

    @Prop.pointer(0x94AD28, Player) public player: Player;
    @Prop.array(0x0094AD2C, Vehicle) public vehicles: Vehicle[];
    @Prop.int(0x000094ADC8) public money: number;
    @Prop.byte(0x000A10B6B) public hour: number;
    @Prop.byte(0x000A10B92) public minute: number;
    @Prop.float(0x00686FC8) public carDensity: number;

    protected constructor(protected baseAddress: number = 0x0) {
        super(baseAddress);
    }
}
