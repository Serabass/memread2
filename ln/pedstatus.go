
export enum PedStatus {
    normal_on_foot = 0x01
    walking = 0x07
    first_person_aiming = 0x0C
    running_punching_attack_with_any_weapons = 0x10
    standing_punching_standing_getting_punched = 0x11
    lifting_phone = 0x13
    autoaim = 0x16
    running_to_enter_vehicle = 0x18
    weak_dodge = 0x1F
    answering_mobile = 0x24
    jumping = 0x29
    lying_onto_ground_being_knocked_to_lying_on_ground = 0x2A
    getting_back_up_from_lying_on_ground = 0x2B
    dodge_car = 0x2D
    sitting_in_vehicle = 0x32
    death_before_wasted_screen = 0x36
    wasted_screen = 0x37
    jacking_car_by_pulling_someone_out_hitting_someone_out = 0x38
    getting_jacked_by_being_pulled_out = 0x39
    entering_vehicle = 0x3A
    exiting_vehicle = 0x3C
    busted = 0x3E
}
