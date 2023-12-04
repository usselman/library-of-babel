import rarityData from "../rarity.json";
import atkIcon from '../assets/atk.png';
import defIcon from '../assets/def.png';


//Categorize items
const clothingItems = [
  "Trousers",
  "Bronze Boots",
  "Amulet",
  "Ninja Mask",
  "Dark Knight Greaves",
  "Hood",
  "Dragoon Boots",
  "Dragoon Helmet",
  "Steel Shield",
  "Kevlar",
  "Leather Gloves",
  "Bronze Gloves",
  "Bandana",
  "Bronze Shield",
  "Wizard Hat",
  "Mythril Helmet",
  "Mask",
  "Tunic",
  "Ring",
  "Leather Armor",
  "Gloves",
  "Boots",
  "Greaves",
  "Leather Boots",
  "Sorceress Circlet",
  "Shield",
  "Headband",
  "Leggings",
  "Skullcap",
  "Silk Leggings",
  "Shoes",
  "Mythril Shield",
  "Wristbands",
  "Leather Shield",
  "Steel Gloves",
  "Feather Cap",
  "Gauntlets",
  "Mythril Armor",
  "Mythril Gloves",
  "Cap",
  "Bracers",
  "Dragoon Gauntlets",
  "Sorceress Slippers",
  "Tiara",
  "Wizard Slippers",
  "Feather Boots",
  "Circlet",
  "Leather Helmet",
  "Mythril Boots",
  "Scales",
  "Dark Knight Gauntlets",
  "Tuxedo",
  "Parrying Shield",
  "Heels",
  "Helmet",
  "Assassin Garb",
  "Dark Knight Helmet",
  "Buckler",
  "Slippers",
  "Horned Helment",
  "Necklace",
  "Wooden Shield",
  "Husk",
  "Charm",
  "Full Plate Armor",
  "Longboots",
  "Mail",
  "Earrings",
  "Top Hat",
  "Dragoon Shield",
  "Vest",
  "Cloak",
  "Sash",
  "Belt",
  "Dress Shoes",
  "Dragoon Armor",
  "Sorceress Robe",
  "Gi",
  "Steel Boots",
  "Silk Robe",
  "Cotton Robe",
  "Robe",
  "Chain Mail",
  "Dark Knight Shield",
  "Wizard Robe",
  "Dark Knight Armor",
  "Bronze Helmet",
  "Gown",
  "Sage Robe",
  "Suit",
  "Bronze Armor",
  "Steel Helmet",
  "Armor",
  "Garb",
  "Ninja Garb",
];

const weaponItems = [
  "Water Scroll",
  "Fire Scroll",
  "Thunder Tome",
  "Wind Tome",
  "Dark Scroll",
  "Earth Scroll",
  "Light Wand",
  "Thunder Wand",
  "Ice Wand",
  "Light Scroll",
  "Dark Tome",
  "Fire Staff",
  "Light Staff",
  "Wind Staff",
  "Wind Wand",
  "Dark Staff",
  "Water Tome",
  "Earth Tome",
  "Earth Wand",
  "Ice Staff",
  "Thunder Staff",
  "Earth Staff",
  "Light Tome",
  "Fire Tome",
  "Ice Tome",
  "Wind Scroll",
  "Ice Scroll",
  "Club",
  "Fire Wand",
  "Scroll",
  "Longsword",
  "Tome",
  "Water Wand",
  "Sickle",
  "Thunder Scroll",
  "Sniperbow",
  "Demonica",
  "Kunai",
  "Grenade Launcher",
  "Katana",
  "Lance",
  "Wand",
  "Spear",
  "Knife",
  "Lightsaber",
  "Catclaws",
  "Greatsword",
  "Assault Rifle",
  "Rapier",
  "Sabre",
  "Knuckles",
  "Derringer",
  "Bow",
  "Estoc",
  "Falchion",
  "Naginata",
  "Axe",
  "Scalers",
  "Revolving Pistol",
  "Sniper Rifle",
  "Fists",
  "Dark Wand",
  "Claws",
  "Shortsword",
  "Claymore",
  "Dagger",
  "Needle",
  "Tomahawk",
  "Whip",
  "Gatling Gun",
  "Shotgun",
  "Machete",
  "Scythe",
  "Mace",
  "Blade",
  "Hatchet",
  "Longbow",
  "Hammer",
  "Scimitar",
  "Parrying Dagger",
  "Crossbow",
  "Blunderbuss",
  "Water Staff",
  "Staff",
];

const baseDefenseStats = {
  "Trousers": 2,
  "Bronze Boots": 3,
  "Amulet": 1,
  "Ninja Mask": 2,
  "Dark Knight Greaves": 5,
  "Hood": 1,
  "Dragoon Boots": 4,
  "Dragoon Helmet": 4,
  "Steel Shield": 6,
  "Kevlar": 7,
  "Leather Gloves": 2,
  "Bronze Gloves": 3,
  "Bandana": 1,
  "Bronze Shield": 5,
  "Wizard Hat": 1,
  "Mythril Helmet": 5,
  "Mask": 2,
  "Tunic": 2,
  "Ring": 1,
  "Leather Armor": 4,
  "Gloves": 2,
  "Boots": 3,
  "Greaves": 4,
  "Leather Boots": 3,
  "Sorceress Circlet": 2,
  "Shield": 5,
  "Headband": 1,
  "Leggings": 2,
  "Skullcap": 2,
  "Silk Leggings": 2,
  "Shoes": 1,
  "Mythril Shield": 6,
  "Wristbands": 1,
  "Leather Shield": 4,
  "Steel Gloves": 4,
  "Feather Cap": 1,
  "Gauntlets": 4,
  "Mythril Armor": 7,
  "Mythril Gloves": 5,
  "Cap": 1,
  "Bracers": 3,
  "Dragoon Gauntlets": 5,
  "Sorceress Slippers": 2,
  "Tiara": 1,
  "Wizard Slippers": 2,
  "Feather Boots": 2,
  "Circlet": 1,
  "Leather Helmet": 3,
  "Mythril Boots": 5,
  "Scales": 3,
  "Dark Knight Gauntlets": 5,
  "Tuxedo": 1,
  "Parrying Shield": 6,
  "Heels": 1,
  "Helmet": 4,
  "Assassin Garb": 3,
  "Dark Knight Helmet": 5,
  "Buckler": 3,
  "Slippers": 1,
  "Horned Helment": 4,
  "Necklace": 1,
  "Wooden Shield": 3,
  "Husk": 2,
  "Charm": 1,
  "Full Plate Armor": 8,
  "Longboots": 3,
  "Mail": 5,
  "Earrings": 1,
  "Top Hat": 1,
  "Dragoon Shield": 6,
  "Vest": 2,
  "Cloak": 2,
  "Sash": 1,
  "Belt": 1,
  "Dress Shoes": 1,
  "Dragoon Armor": 7,
  "Sorceress Robe": 2,
  "Gi": 2,
  "Steel Boots": 4,
  "Silk Robe": 2,
  "Cotton Robe": 2,
  "Robe": 2,
  "Chain Mail": 6,
  "Dark Knight Shield": 6,
  "Wizard Robe": 2,
  "Dark Knight Armor": 7,
  "Bronze Helmet": 4,
  "Gown": 1,
  "Sage Robe": 2,
  "Suit": 1,
  "Bronze Armor": 5,
  "Steel Helmet": 5,
  "Armor": 6,
  "Garb": 2,
  "Ninja Garb": 3,
};

const baseAttackStats = {
  // Magical Weapons
  "Water Scroll": 8,
  "Fire Scroll": 10,
  "Thunder Tome": 12,
  "Wind Tome": 9,
  "Dark Scroll": 11,
  "Earth Scroll": 7,
  "Light Wand": 6,
  "Thunder Wand": 10,
  "Ice Wand": 8,
  "Light Scroll": 5,
  "Dark Tome": 11,
  "Fire Staff": 10,
  "Light Staff": 6,
  "Wind Staff": 9,
  "Wind Wand": 9,
  "Dark Staff": 12,
  "Water Tome": 8,
  "Earth Tome": 7,
  "Earth Wand": 7,
  "Ice Staff": 8,
  "Thunder Staff": 11,
  "Earth Staff": 7,
  "Light Tome": 6,
  "Fire Tome": 10,
  "Ice Tome": 8,
  "Wind Scroll": 9,
  "Ice Scroll": 8,

  // Melee Weapons
  "Club": 15,
  "Fire Wand": 6,
  "Scroll": 4,
  "Longsword": 18,
  "Tome": 5,
  "Water Wand": 6,
  "Sickle": 16,
  "Thunder Scroll": 10,
  "Sniperbow": 20,
  "Demonica": 22,
  "Kunai": 7,
  "Grenade Launcher": 25,
  "Katana": 19,
  "Lance": 17,
  "Wand": 5,
  "Spear": 16,
  "Knife": 10,
  "Lightsaber": 23,
  "Catclaws": 13,
  "Greatsword": 21,
  "Assault Rifle": 24,
  "Rapier": 14,
  "Sabre": 15,
  "Knuckles": 13,
  "Derringer": 9,
  "Bow": 14,
  "Estoc": 17,
  "Falchion": 16,
  "Naginata": 18,
  "Axe": 17,
  "Scalers": 12,
  "Revolving Pistol": 11,
  "Sniper Rifle": 20,
  "Fists": 8,
  "Dark Wand": 7,
  "Claws": 12,
  "Shortsword": 14,
  "Claymore": 19,
  "Dagger": 11,
  "Needle": 7,
  "Tomahawk": 12,
  "Whip": 10,
  "Gatling Gun": 26,
  "Shotgun": 22,
  "Machete": 15,
  "Scythe": 18,
  "Mace": 17,
  "Blade": 14,
  "Hatchet": 15,
  "Longbow": 14,
  "Hammer": 18,
  "Scimitar": 16,
  "Parrying Dagger": 10,
  "Crossbow": 15,
  "Blunderbuss": 21,
  "Water Staff": 6,
  "Staff": 5,
};



const prefixes = [
  ["Gold", 215],
  ["Adamantium", 243],
  ["Black", 195],
  ["Wailing", 196],
  ["Sun", 217],
  ["Holy", 225],
  ["Everbearing", 219],
  ["Bone", 207],
  ["Silver", 201],
  ["Divine", 223],
  ["Demon", 191],
  ["Zephyr", 205],
  ["Fabled", 212],
  ["Angelic", 210],
  ["Crescent Moon", 189],
  ["Profane", 194],
  ["Arcane", 217],
  ["Drake", 236],
  ["Spectral", 190],
  ["Shadow", 222],
  ["Unyielding", 208],
  ["Bright", 203],
  ["Elven", 226],
  ["Undead", 225],
  ["Moon", 212],
  ["Cursed", 211],
  ["Faithful", 194],
  ["Star", 195],
];

const suffixes = [
  ["of Spirit", 152],
  ["of Dexterity", 152],
  ["of Salvation", 139],
  ["of Illumination", 139],
  ["of Strength", 137],
  ["of Tears", 153],
  ["of Ruin", 143],
  ["of Terror", 132],
  ["of Agility", 157],
  ["of Protection", 156],
  ["of Intellect", 145],
  ["of Vigor", 131],
  ["of the Duck", 121],
  ["of Spite", 140],
  ["of Luck", 128],
  ["of Nightmares", 147],
  ["of Vigilance", 133],
  ["of Rapture", 147],
  ["of Fortune", 134],
  ["of the Night", 151],
  ["of the Kraken", 160],
  ["of Destruction", 130],
  ["of Despair", 130],
  ["of the Panda", 138],
  ["of Sorrow", 153],
  ["of Soul", 124],
  ["of the Frog", 126],
  ["of the Ape", 143],
  ["of Dreams", 133],
  ["of Mercy", 160],
  ["of Peace", 141],
  ["of Vitality", 152],
  ["of Tolerance", 130],
  ["of Virtue", 140],
  ["of Sin", 148],
  ["of Titans", 149],
  ["of the Fox", 152],
  ["of the Peacock", 139],
  ["of the Stag", 126],
  ["of Fate", 120],
];

// Convert rarityData numbers to modifiers
const convertToModifier = (number) => number / 100;

const modifiers = {
  prefixes: Object.fromEntries(
    prefixes.map(([prefix, number]) => [prefix, 1 + convertToModifier(number)])
  ),
  suffixes: Object.fromEntries(
    suffixes.map(([suffix, number]) => [suffix, 1 + convertToModifier(number)])
  ),
};

const calculateStats = (itemName) => {
  // Split the item name
  const parts = itemName.split(" ");
  let prefix = "";
  let suffix = "";
  let baseItemName = "";

  if (parts.includes("of")) {
    // Find the index where 'of' is located
    const ofIndex = parts.indexOf("of");
    prefix = parts.slice(0, ofIndex).join(" ");
    suffix = parts.slice(ofIndex).join(" ");
    baseItemName = parts[ofIndex - 1];
  } else {
    baseItemName = parts[parts.length - 1];
    prefix = parts.slice(0, parts.length - 1).join(" ");
  }

  let baseStatValue;
  let statType;
  if (weaponItems.includes(baseItemName)) {
    baseStatValue = baseAttackStats[baseItemName] || 0;
    statType = 'attack';
  } else if (clothingItems.includes(baseItemName)) {
    baseStatValue = baseDefenseStats[baseItemName] || 0;
    statType = 'defense';
  } else {
    return null;
  }

  // Apply modifiers
  const prefixModifier = modifiers.prefixes[prefix] ? (modifiers.prefixes[prefix] - 1) * baseStatValue : 0;
  const suffixModifier = modifiers.suffixes[suffix] ? (modifiers.suffixes[suffix] - 1) * baseStatValue : 0;

  const totalStat = baseStatValue + prefixModifier + suffixModifier;

  // Limiting to two decimal places
  const finalStatValue = parseFloat(Math.ceil(totalStat));

  return { [statType]: finalStatValue };
};

const OrdinalCard = ({ ordinal }) => {
  const getRarity = (name) => {
    const parts = name.split(" ");
    const hasPrefix = parts.length > 1 && parts[0] !== "of";
    const hasSuffix = parts.includes("of");

    if (hasPrefix && hasSuffix) return "Rare";
    if (hasPrefix || hasSuffix) return "Uncommon";
    return "Common";
  };

  const stats = calculateStats(ordinal.data.insc.text);
  const rarity = getRarity(ordinal.data.insc.text);

  const rarityStyles = {
    Common: "border-black text-black shadow-common",
    Uncommon: "border-blue-500 text-blue-500 shadow-uncommon",
    Rare: "border-yellow-500 text-yellow-500 shadow-rare",
  };

  const isAttackStat = stats && stats.attack !== undefined;

  return (
    <div className={`rounded-lg overflow-hidden m-4 p-4 bg-white border-2 ${rarityStyles[rarity]} hover:bg-gray-200`}>
      <div className="px-6 py-4">
        <div className="font-bold text-lg mb-2 outline-black">{ordinal.data.insc.text}</div>
        <p className="text-gray-700 text-base">{rarity}</p>
        <div className="h-4" />
        {stats && (
          <div className="flex place-items-center text-center">
            <img 
              src={isAttackStat ? atkIcon : defIcon} 
              alt={isAttackStat ? "Attack Icon" : "Defense Icon"}
              className="h-4 w-4 mr-2" 
            />
            <p className={`${isAttackStat ? "text-red-500" : "text-blue-500"} text-sm font-bold`}>
              {isAttackStat ? `Attack: ${stats.attack}` : `Defense: ${stats.defense}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdinalCard;
