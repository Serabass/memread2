import MemoryEntity from '../decorators/memory/memory-entity';
import Prop from '../decorators/memory/prop';
import {Kernel} from "../libs/kernel";
import {GameBase} from './game-base';
import {Player} from './player';
import {Process} from "./Process";
import {Vehicle} from './vehicle';

@MemoryEntity()
export default class Game extends GameBase {
    public static get instance() {
        if (!this.singleton) {
            let instance = new Kernel();
            const processId = instance.getProcessId(this.EXE);

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

    @Prop.pointer(0x94AD28, Player)
    public player: Player;

    @Prop.array(0x94AD2C, Vehicle)
    public vehicles: Vehicle[];

    @Prop(0x94ADC8, 'int')
    public money: number;

    @Prop(0xA10B6B, 'int')
    public hour: number;

    @Prop(0xA10B92, 'int')
    public minute: number;

    @Prop(0x686FC8, 'float')
    public carDensity: number;

    protected constructor(protected baseAddress: number = 0x0) {
        super(baseAddress);
    }
}
