import 'reflect-metadata';
import {MemoryEntity, Prop, RemoteFunction} from '../decorators';
import {Byte, Float, Int32} from "../decorators/memory/native-types";
import {Injector} from "../injector";
import {kernel, WFSO} from "../libs";
import {Process} from "../process";
import {Clock} from "./clock";
import {Drunkenness} from "./drunkenness";
import {Entity} from "./entity";
import {FunctionAddress} from "./functions";
import {GameBase} from "./game-base";
import {PedStatus} from "./ped-status";
import {Physical} from "./physical";
import {RadioStation} from "./radio-station";
import {Vector3d} from "./vector-3d";
import {VehicleColors} from "./vehicle-colors";
import {Wanted} from "./wanted";
import {Weather} from "./weather";
import {WheelStates} from './wheels';

function hex(...args: any[]) {
    console.log(...args.map(a => a.toString(16)));
}

export interface Jsonable {
    toJSON(): any;
}

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
export class Mouse extends Entity implements Jsonable {
    @Prop.bool(0x00) public lmb: boolean;
    @Prop.bool(0x01) public rmb: boolean;
    @Prop.bool(0x02) public mmb: boolean;
    @Prop.bool(0x03) public wheelDown: boolean;
    @Prop.bool(0x04) public wheelUp: boolean;
    @Prop.float(0x08) public x: number;
    @Prop.float(0x0C) public y: number;

    public static at(baseAddress: number) {
        return new Mouse(baseAddress);
    }

    protected constructor(public baseAddress: number) {
        super(baseAddress);
    }

    toJSON(): any {
        return {
            lmb: this.lmb,
            rmb: this.rmb,
            mmb: this.mmb,
            wheelDown: this.wheelDown,
            wheelUp: this.wheelUp,
            x: this.x,
            y: this.y,
        };
    }
}

@MemoryEntity()
export class Weapon extends Entity {
    @Prop.int(0x00) public type: number;
    @Prop.int(0x04) public status: number;
    @Prop.int(0x08) public clip: number;
    @Prop.int(0x0C) public ammo: number;

    public static at(baseAddress: number) {
        return new Weapon(baseAddress);
    }

    protected constructor(public baseAddress: number) {
        super(baseAddress);
    }

}

@MemoryEntity()
export class VehicleSpecialProps extends Entity {
    @Prop.byte(0x0) public byteValue: number;
    @Prop.bit(0x0, 0) public taxiLight: boolean;
    @Prop.bit(0x0, 1) public notSprayable: boolean;
    @Prop.bit(0x0, 3) public watertight: boolean;
    @Prop.bit(0x0, 4) public upsideDownNotDamaged: boolean;
    @Prop.bit(0x0, 5) public bitMoreResistantToPhysicalDamage: boolean;
    @Prop.bit(0x0, 6) public tankDetonateCars: boolean;

    public static at(baseAddress: number) {
        return new VehicleSpecialProps(baseAddress);
    }

    protected constructor(public baseAddress: number) {
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

        return Vehicle.at(res);
    }

    @Prop.float(0x100)
    public speed: number;

    @Prop(0x160)
    public readonly cruiseSpeed: Float;

    @Prop.mem(0x1A0, VehicleColors)
    public colors: VehicleColors;

    @Prop(0x1A1)
    public secondaryColor: Byte;

    @Prop.bool(0x245)
    public siren: boolean;

    @Prop.bool(0x240)
    public horn: boolean;

    @Prop.byte(0x2B0)
    public lightStatus: number;

    @Prop.byte(0x5C5)
    public wheelsOnGround: number;

    @Prop.int(0x1A4)
    public alarmDuration: number;

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

    @Prop.float(0x204)
    public health: number;

    @Prop.mem(0x2A5, WheelStates)
    public wheelStates: WheelStates;

    @Prop.byte(0x2A5)
    public wheelState1: number;

    @Prop.byte(0x29C)
    public type: VehicleType;

    @Prop(0x501, VehicleSpecialProps)
    public specialProps: VehicleSpecialProps;

    @Prop.byte(0x5CC)
    public carBurnout: number;

    public static at(baseAddress: number) {
        return new Vehicle(baseAddress);
    }

    protected constructor(public baseAddress: number) {
        super(baseAddress);
    }

    public static get pool() {
        return Game.instance.vehicles;
    }

    public fix() {
        let inj = new Injector(Process.instance);
        let alloc = inj.alloc(15)
            .movDSToEcx(this.baseAddress)
            // .movEcxEax() // mov ecx, eax
            .relativeCall(FunctionAddress.VEHICLE_FIX)
            .ret();

        Process.instance.writeAlloc(alloc);

        debugger;

        let aa = Buffer.alloc(5);
        let thread = kernel.CreateRemoteThread(Process.instance.handle, null,
            0, alloc.address, alloc.address, 0, aa);

        kernel.WaitForSingleObject(Process.instance.handle, WFSO.WAIT_TIMEOUT);

        alloc.zeroRemote();

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
export class PedFlags1 extends Entity {
    @Prop.bit(0x0, 4) public isCrouching: boolean;

    public static at(baseAddress: number) {
        return new PedFlags1(baseAddress);
    }

    protected constructor(public baseAddress: number) {
        super(baseAddress);
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
    @Prop(0x142, Boolean) public fireProof: boolean;

    @Prop(0x150, PedFlags1) public flags1: PedFlags1; // Move to separate class with 0x0 bit offsets

    @Prop.bit(0x14D, 5) public runWalkStyle: boolean;
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
    @Prop.int(0x59C) public lastDamagedBy111: number;
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

    public static byIndex(index: number) {

    }

    public static at(baseAddress: number) {
        return new Ped(baseAddress);
    }

    protected constructor(public baseAddress: number) {
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

    public static findCoords(): any {
        let i = new Injector(Process.instance);
        let resultAlloc = i.alloc(4);
        let bytes = i
            .alloc(100)
            .relativeCall(FunctionAddress.PLAYER_GET_CAR)
            .movEcxEax()
            .movResult(resultAlloc.address)
            .relativeCall(FunctionAddress.VEHICLE_FIX)
            .ret();

        debugger;
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

    constructor(public baseAddress: number) {
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

        return Vehicle.at(res as number);
    }
}

export interface IVector3D {
    x: number;
    y: number;
    z: number;
}

export interface IVector3DA extends IVector3D {
    a: number;
}

@MemoryEntity()
export class Game extends GameBase {
    public static singleton: Game;

    @Prop.pointer(0x94AD28, Player)
    public player: Player;

    @Prop.fstringReversed(0xA10942, 32)
    public cheat: string;

    @Prop.array(0x0094AD2C, Vehicle)
    public vehicles: Vehicle[];

    @Prop.int(0x000094ADC8) public money: number;
    @Prop.float(0x0000686FC8) public carDensity: number;
    @Prop.float(0x000068F5F0) public gravity: number;
    @Prop.float(0x000097F264) public timeScale: number;
    @Prop.byte(0x000068723B) public trafficAccidents: number;
    @Prop(0x0000A10AB5) public freeRespray: boolean;
    @Prop.int(0x0000489D78) public goodCitizenBonus: number;

    @Prop.ubyte(0x000A10A42) public weather: Weather;
    @Prop(0x000A10B00) public clock: Clock;

    @Prop(0x936908, Mouse) public mouse: Mouse;

    protected constructor(public baseAddress: number = 0x0) {
        super(baseAddress);
    }

    public static get instance() {
        if (!this.singleton) {
            this.singleton = new Game();
        }

        return this.singleton;
    }

    public helpMessage(text: string) {

        // TODO Напомню, что здесь нужно заранее прописывать массив GXT-строк с ключами в память.
        // TODO Так было сделано в SCMMod

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
        return Vehicle.at(res as number);
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
