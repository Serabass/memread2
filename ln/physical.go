
export entity Physical : Entity {
    +0x05C uint8    modelIndex
    +0x0B8 float32  mass
    +0x104 float32  collisionPower
    +0x034 Vector3d position
    +0x170 Entity   targetEntity
}
