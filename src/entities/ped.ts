import 'reflect-metadata';
import {MemoryEntity, Prop, RemoteFunction} from '../decorators';
import {Byte, Float, Int32, Short} from "../decorators/memory/native-types";
import {Injector} from "../injector";
import {kernel, WFSO} from "../libs";
import {Process} from "../process";
import {Clock} from "./clock";
import {Drunkenness} from "./drunkenness";
import {Entity} from "./entity";
import {FunctionAddress} from "./functions";
import {GameBase} from "./game-base";
import {PedStatus} from "./ped-status";
import {RadioStation} from "./radio-station";
import {Vector3d} from "./vector-3d";
import {Physical} from "./physical";
// import {Vehicle} from "./";
import {Wanted} from "./wanted";
import {Weather} from "./weather";
import {WheelStates} from './wheels';

export enum DamageType {
    Unarmed = 0,
    NightStick = 4,
    COLT45 = 17,
    SNIPERRIFLE = 28,
    FLAMETHROWER = 31,
    RAMMEDBYCAR = 39,
    RUNOVERBYCAR = 40,
    EXPLOSION = 41,
    UZI_DRIVEBY = 42,
    DROWNING = 43,
    FALL = 44,
    ANYMELEE = 46,
    ANYWEAPON = 47,
}

export enum VehicleType {
    general,
    boat,
    train,
    NPCpoliceHelicopter,
    NPCplane,
    bike,
}

@MemoryEntity()
export class Weapon extends Entity {
    @Prop.int(0x00)
    public type: Int32;

    @Prop.int(0x04)
    public status: Int32;

    @Prop.int(0x08)
    public clip: number;

    @Prop.int(0x0C)
    public ammo: number;

    constructor(public baseAddress: number) {
        super(baseAddress);
    }

}

@MemoryEntity()
export class Vehicle extends Physical {

    public static spawn(modelIndex: number) {
        let inj = new Injector(Process.instance);
        let resultAlloc = inj.alloc(4);
        let alloc = inj.alloc(20)
            .pushInt32(modelIndex)
            .relativeCall(FunctionAddress.SPAWN_VEHICLE)
            .movResult(resultAlloc.address)
            .popECX()
            .ret();

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);

        kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        let res = Process.instance.readInt(resultAlloc.address);

        if (typeof res !== 'number') {
            throw new Error();
        }

        alloc.zeroRemote();

        return new Vehicle(res);
    }

    @Prop(0x100, Float)
    public speed: number;

    @Prop(0x160)
    public readonly cruiseSpeed: Float;

    @Prop(0x1A0)
    public primaryColor: Byte;

    @Prop(0x1A1)
    public secondaryColor: Byte;

    @Prop(0x245, Boolean)
    public siren: boolean;

    @Prop(0x240, Boolean)
    public horn: boolean;

    @Prop.byte(0x2B0)
    public lightStatus: number;

    @Prop.byte(0x5C5)
    public wheelsOnGround: number;

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

    @Prop.float(0x1E8)
    public steerAngle1: number;

    @Prop.float(0x1EC)
    public steerAngle2: number;

    @Prop(0x1F0, Float)
    public acceleratorPedal: Float;

    @Prop(0x1F4, Float)
    public brakePedal: Float;

    @Prop(0x230)
    public lockStatus: Int32;

    @Prop.int(0x23C)
    public radioStation: RadioStation;

    @Prop(0x204)
    public health: Float;

    @Prop(0x2A4, WheelStates)
    public wheelStates: WheelStates;

    @Prop.byte(0x29C)
    public type: VehicleType;

    @Prop.byte(0x501)
    public specialProps: number;

    @Prop.byte(0x5CC)
    public carBurnout: number;

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

    public blowUp(): void {
        let inj = new Injector(Process.instance);

        let alloc = inj.alloc(16)
            .uInt8(0xB9).int32(this.baseAddress)
            .uInt8(0x8B).uInt8(0x39)
            .pushUInt8(0x00)
            .relativeCall(FunctionAddress.BLOWUP_VEHICLE)
            .ret()
        ;
        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        alloc.zeroRemote();

    }
}

@MemoryEntity()
export class Ped extends Physical {
    @Prop(0x34, Vector3d)
    public position: Vector3d;

    @Prop(0x170) public readonly targetEntity: Int32;

    @Prop.int(0x244) public readonly status: PedStatus;

    @Prop(0x140) public infiniteRun: boolean;
    @Prop(0x141, Boolean) public fastShoot: boolean;
    @Prop.float(0x354) public health: number;
    @Prop(0x358) public armor: Float;
    @Prop(0x378) public rotation: Float;
    @Prop(0x3AC) public isInVehicle: boolean;
    @Prop(0x504) public activeWeaponSlot: Byte;
    @Prop(0x506) public weaponAccuracy: Byte;
    @Prop(0x596) public money: Int32;
    @Prop.byte(0x598) public lastDamageType: DamageType;
    @Prop(0x52C, Float) public torsoRotation: number;
    @Prop.pointer(0x59C, Ped) public lastDamagedBy: Ped;
    @Prop(0x63D, Boolean) public canBeDamaged: boolean;

    @Prop.pointer(0x3A8, Vehicle)
    public lastControlledVehicle: Vehicle;

    @Prop.pointer(0x508, Ped)
    public readonly targetedPed: Ped;

    @Prop.array(0x56C, Ped)
    public readonly nearestPeds: Ped[];

    @Prop.memArray(0x408, Weapon, 10, 0x018)
    public readonly weapons: Weapon[];

    @Prop.short(0x594)
    public readonly nearestPedsCount: number;

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

@MemoryEntity()
export class Game extends GameBase {
    public static singleton: Game;

    @Prop.pointer(0x94AD28, Player)
    public player: Player;

    @Prop.array(0x0094AD2C, Vehicle)
    public vehicles: Vehicle[];

    @Prop(0x000094ADC8, Int32) public money: number;
    @Prop(0x0000686FC8) public carDensity: Float;
    @Prop(0x000068F5F0) public gravity: Float;
    @Prop(0x000097F264) public timeScale: Float;
    @Prop(0x000068723B) public trafficAccidents: Byte;
    @Prop(0x0000A10AB5) public freeRespray: boolean;
    @Prop(0x0000489D79) public goodCitizenBonus: Byte;

    @Prop.ubyte(0x000A10A42) public weather: Weather;
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

    public helpMessage(text: string) {
        let inj = new Injector(Process.instance);
        let stringAlloc = inj.alloc(10);
        let resultAlloc = inj.alloc(4);

        let buf = Buffer.from(text, 'utf-8');
        kernel.WriteProcessMemory(Process.instance.handle, stringAlloc.address,
            buf, buf.length, 0);

        debugger;

        let alloc = inj.alloc(100)
            .movECXOffset(0x0094B220)
            .movDSOffset__Sandbox(0x00A10942, 0x20)
            .pushUInt8(0)
            .pushUInt8(1)
            .pushOffset(stringAlloc.address)
            .relativeCall(FunctionAddress.PREPARE_HELP_MESSAGE)
            .pushEAX()
            .relativeCall(FunctionAddress.SET_HELP_MESSAGE)
            .ret()
        ;

        Process.instance.writeAlloc(alloc);

        debugger;

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

    public updateWeather(weather: Weather) {
        debugger;
        this.weather = weather;

        let inj = new Injector();
        let alloc = inj.alloc(100)
            .relativeCall(FunctionAddress.UPDATE_WEATHER)
            .ret();

        Process.instance.writeAlloc(alloc);

        let aa = Buffer.alloc(5);
        kernel.CreateRemoteThread(Process.instance.handle, null, 0, alloc.address, alloc.address, 0, aa);
    }
}
