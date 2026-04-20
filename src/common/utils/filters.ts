import { ModalCardPickerFilter } from "../components/ModalCardPicker";
import { ArmorItem } from "../types/Armor";
import { BackpackItem } from "../types/BackpackItem";
import { WeaponItem } from "../types/Weapon";
import { mapArmorWeight } from "./funks";

export const TIERS = [
    { label: "T1", value: "1" },
    { label: "T2", value: "2" },
    { label: "T3", value: "3" },
    { label: "T4", value: "4" },
];

export const BURDENS = [
    { label: "One Handed", value: "one-handed" },
    { label: "Two Handed", value: "two-handed" },
];

export const RANGES = [
    { label: "Melee", value: "melee" },
    { label: "Very close", value: "very_close" },
    { label: "Close", value: "close" },
    { label: "Far", value: "far" },
    { label: "Very far", value: "very_far" }
];

export const SLOTS = [
    { label: "Primary", value: "primary" },
    { label: "Secondary", value: "secondary" },
];

export const WEIGHTS = [
    { label: "Light", value: "light" },
    { label: "Medium", value: "medium" },
    { label: "Heavy", value: "heavy" },
]

export const ITEM_TYPES = [
    { label: "Loot", value: "loot" },
    { label: "Consumables", value: "consumables" },
];

export const WEAPON_TRAITS = [
    {label: "Agility", value: "agility"},
    {label: "Finesse", value: "finesse"},
    {label: "Instinct", value: "instinct"},
    {label: "Presence", value: "presence"},
    {label: "Strength", value: "strength"},
    {label: "Knowledge", value: "knowledge"},
    {label: "Spellcast", value: "spellcast"},
];


export const ITEM_PICKER_FILTERS: Array<ModalCardPickerFilter<BackpackItem>> =
    [
      {
        id: "name",
        label: "Name",
        type: "text",
        placeholder: "Search by name",
        match: "includes",
        getValue: (item) => item.name,
      },
      {
        id: "roll",
        label: "Roll",
        type: "text",
        placeholder: "Filter by roll",
        match: "exact",
        getValue: (item) => item.roll,
      },
      {
        id: "type",
        label: "Type",
        type: "select",
        options: ITEM_TYPES,
        getValue: (item) => item.type || "loot",
      },
    ];


export const WEAPON_PICKER_FILTERS: Array<ModalCardPickerFilter<WeaponItem>> =
[
    {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Search by name",
    match: "includes",
    getValue: (weapon) => weapon.name,
    },
    {
    id: "tier",
    label: "Tier",
    type: "select",
    options: TIERS,
    getValue: (weapon) => weapon.tier,
    },
    {
    id: "burden",
    label: "Burden",
    type: "select",
    options: BURDENS,
    getValue: (weapon) => weapon.burden,
    },
    {
    id: "trait",
    label: "Trait",
    type: "select",
    options: WEAPON_TRAITS,
    getValue: (weapon) => weapon.attribute
    },
    {
    id: "range",
    label: "Range",
    type: "select",
    options: RANGES,
    getValue: (weapon) => weapon.range,
    },
    {
    id: "slot",
    label: "Slot",
    type: "select",
    options: SLOTS,
    getValue: (weapon) => weapon.slot,
    },
];

export const ARMOR_PICKER_FILTERS: Array<ModalCardPickerFilter<ArmorItem>> = 
[
    {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Search by name",
    match: "includes",
    getValue: (armor) => armor.name,
    },
    {
    id: "tier",
    label: "Tier",
    type: "select",
    options: TIERS,
    getValue: (armor) => armor.tier,
    },
    {
    id: "weight",
    label: "Weight",
    type: "select",
    options: WEIGHTS,
    getValue: (armor) => mapArmorWeight(armor.baseScore),
    },
];


