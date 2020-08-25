import { MODEL } from "./model"
import { PedStatus } from "./pedstatus"
import { Weather } from "./weather"
import { RadioStation } from "./radiostation"
import { DamageType } from "./damagetype"
import { Vector3d } from "./vector3d"
import { Weapon } from "./weapon"
import { Physical } from "./physical"
import { Wanted } from "./wanted"
import { Vehicle } from "./vehicle"
import { Mouse } from "./mouse"
import { Drunkenness } from "./drunkenness"
import { Clock } from "./clock"
import { Game } from "./game"
import { Police } from "./police"
import { VehicleSpecialProps } from "./vehiclespecialprops"

declare type fstring<S>

entity Ped : Physical {
    +0x140 bool         infiniteRun
    +0x141 bool         fastShoot
    +0x142 bool         fireProof
    +0x14D bit+5        runWalkStyle
    +0x598 DamageType   lastDamageType
    +0x598 bool         canBeDamaged
    +0x3A8 Vehicle      lastControlledVehicle
    +0x3A8 Ped          targetedPed
    +0x408 Weapon[10]   weapons
    +0x5F4 &Wanted      wanted
    +0x354 float32      health
    +0x358 float32      armor
    +0x378 float32      rotation
    +0x3AC bool         isInVehicle
    +0x638 Drunkenness  drunkenness
    +0x508 Ped[?]     nearestPeds
}
