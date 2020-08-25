
export entity Vehicle : Physical {
    +0x100 float32              speed
    +0x1A4 int32                alarmDuration

    +0x1CC byte                 numPassengers
    +0x1D0 byte                 maxPassengers

    +0x1F0 float32              acceleratorPedal
    +0x1F4 float32              brakePedal

    +0x204 float32              health
    +0x2B0 byte                 lightStatus
    +0x23C RadioStation         radioStation

    +0x5C5 byte                 wheelsOnGround
    +0x29C VehicleType          type
    +0x501 VehicleSpecialProps  specialProps
    +0x5CC byte                 carBurnout
}
