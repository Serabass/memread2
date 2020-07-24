import 'reflect-metadata';
import {MemoryEntity, Prop, RemoteFunction} from '../decorators';
import {Byte, Float, Int32, Short} from "../decorators/memory/native-types";
import {Injector} from "../injector";
import {kernel, WFSO} from "../libs";
import {Process} from "../process";
import {Drunkenness} from "./drunkenness";
import {FunctionAddress} from "./functions";
import {Game} from "./game";
import {PedStatus} from "./ped-status";
import {RadioStation} from "./radio-station";
import {Vector3d} from "./vector-3d";
import {Physical} from "./physical";
// import {Vehicle} from "./";
import {Wanted} from "./wanted";

@MemoryEntity()
export class Ped extends Physical {
    @Prop(0x34, Vector3d)
    public position: Vector3d;

    @Prop(0x170) public readonly targetEntity: Int32;

    @Prop.int(0x244) public readonly status: PedStatus;

    @Prop(0x140) public infiniteRun: boolean;
    @Prop(0x354) public health: Float;
    @Prop(0x358) public armor: Float;
    @Prop(0x378) public rotation: Float;
    @Prop(0x3AC) public isInVehicle: boolean;
    @Prop(0x504) public activeWeaponSlot: Byte;
    @Prop(0x506) public weaponAccuracy: Byte;
    @Prop(0x596) public money: Int32;

    // @Prop.pointer(0x3A8, Vehicle)
    // public lastControlledVehicle: Vehicle;

    @Prop.pointer(0x508, Ped)
    public readonly targetedPed: Ped;

    @Prop.array(0x56C, Ped)
    public readonly nearestPeds: Ped[];

    @Prop(0x594)
    public readonly nearestPedsCount: Short;

    @Prop.pointer(0x5F4, Wanted)
    public wanted: Wanted;

    @Prop(0x638, Drunkenness)
    public drunkenness: Drunkenness;

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }

    public duck() {
        let inj = new Injector();
        let resultAlloc = inj.alloc(4);
        let alloc = inj.alloc(100)
            .movDSToEcx(this.baseAddress)
            .relativeCall(FunctionAddress.PED_DUCK)
            .ret();

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        let thread = kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        let res = Process.instance.read(resultAlloc.address, Int32);
        let res2 = Process.instance.read(res as number, Int32);

        if (typeof res !== 'number') {
            throw new Error();
        }

        return res;
    }

    public kill() {
        this.health = 0;
    }
}

@MemoryEntity()
export class Vehicle extends Physical {
    @Prop(0x100)
    public readonly speed: Float;

    @Prop(0x160)
    public readonly cruiseSpeed: Float;

    @Prop(0x1A0)
    public primaryColor: Byte;

    @Prop(0x1A1)
    public secondaryColor: Byte;

    @Prop(0x1A4)
    public alarmDuration: Int32;

    // @Prop.pedPointer(0x1A8)
    // public readonly driver: Ped;

    // @Prop.array(0x1AC, Ped)
    // public readonly passengers: Ped[];

    @Prop(0x1CC)
    public readonly numPassengers: Byte;

    @Prop(0x1D0)
    public maxPassengers: Byte;

    @Prop(0x230)
    public lockStatus: Int32;

    @Prop.int(0x23C)
    public radioStation: RadioStation;

    @Prop(0x204)
    public health: Float;

    constructor(public baseAddress: number) {
        super(baseAddress);
    }

    public static get pool() {
        return Game.instance.vehicles;
    }

    public fix() {
        let inj = new Injector();
        let alloc = inj.alloc(100)
            .buf((b) => {
                // NEED:
                // mov eax, ds: baseAddress
                // mov ecx, eax
                b.writeUint8(0xA1); // mov eax, ds: baseAddress
                b.writeUint32(this.baseAddress); // mov eax, ds: baseAddress

                b.writeUint8(0x89); // mov ecx, eax
                b.writeUint8(0xC1); // mov ecx, eax
            })
            .relativeCall(FunctionAddress.VEHICLE_FIX)
            .ret();

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        let thread = kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        return;
    }
}

@MemoryEntity()
export class Player extends Ped {

    public static get instance() {
        return Game.instance.player;
    }

    @RemoteFunction((i) => {
        let resultAlloc = i.alloc(4);
        return i
            .alloc(100)
            .relativeCall(FunctionAddress.PLAYER_GET_CAR)
            .movEcxEax()
            .movResult(resultAlloc.address)
            .relativeCall(FunctionAddress.VEHICLE_FIX)
            .ret();
    })
    private _fixCar: () => void;

    constructor(protected baseAddress: number) {
        super(baseAddress);
    }

    public fixCar() {
        this._fixCar();
        // this.lastControlledVehicle.health =  1000;
    }

    public getCar() {
        let inj = new Injector();
        let resultAlloc = inj.alloc(4);
        let alloc = inj.alloc(100)
            .relativeCall(FunctionAddress.PLAYER_GET_CAR)
            .movEcxEax() // mov ecx, eax
            .movResult(resultAlloc.address)
            .ret();

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        let thread = kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        let res = Process.instance.read(resultAlloc.address, Int32);
        let res2 = Process.instance.read(res as number, Int32);

        if (typeof res !== 'number') {
            throw new Error();
        }

        return new Vehicle(res as number);
    }
}
