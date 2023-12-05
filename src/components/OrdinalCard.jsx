import rarityData from "../rarity.json";
import atkIcon from '../assets/atk.png';
import defIcon from '../assets/def.png';
import { Tooltip } from 'react-tooltip'
import { clothingItems, weaponItems, baseDefenseStats, baseAttackStats, weaponTypes, armorTypes, prefixes, suffixes } from './statsData';

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
  const parts = itemName?.split(" ");
  let prefix = "";
  let suffix = "";
  let baseItemName = "";

  if (parts?.includes("of")) {
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
  let armorType = null;

  if (weaponItems?.includes(baseItemName)) {
    baseStatValue = baseAttackStats[baseItemName] || 0;
    statType = 'attack';
  } else if (clothingItems?.includes(baseItemName)) {
    baseStatValue = baseDefenseStats[baseItemName] || 0;
    statType = 'defense';
    armorType = armorTypes[baseItemName];
  } else {
    return null;
  }

  // Apply modifiers
const prefixModifier = modifiers.prefixes[prefix] ? (modifiers.prefixes[prefix] - 1) * baseStatValue : 0;
const suffixModifier = modifiers.suffixes[suffix] ? (modifiers.suffixes[suffix] - 1) * baseStatValue : 0;

const totalStat = baseStatValue + prefixModifier + suffixModifier;

// Limiting to two decimal places
const finalStatValue = parseFloat(Math.ceil(totalStat));

// if (!isAttackStat && armorTypes[baseItemName]) {
  
// }

return { [statType]: finalStatValue, baseStatValue, prefixModifier, suffixModifier, armorType };
};

const OrdinalCard = ({ ordinal }) => {
  console.log("passed ordinal", ordinal);
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
  const itemType = ordinal?.data?.insc?.text?.split(" ")[ordinal?.data?.insc?.text?.split(" ").length - 1];
  const weaponType = weaponTypes[itemType];
  const isAttackStat = stats && stats.attack !== undefined;

  const rarityStyles = {
    Common: "border-black text-black shadow-common hover:bg-gray-300",
    Uncommon: "border-blue-500 text-blue-500 shadow-uncommon hover:bg-blue-300",
    Rare: "border-yellow-500 shadow-rare rainbow-text hover:border-2 hover:animate-pulse",
  };

  return (
    <div className={`rounded-lg overflow-hidden m-4 p-4 bg-white border-2 ${rarityStyles[rarity]} `}>
      <div className="px-6 py-4">
        <div className="font-bold text-lg mb-2">{ordinal.data.insc.text}</div>
        <p className="text-gray-700 text-base">{rarity}</p>
        {stats && (
          <div className="mt-4">
            <div className="flex items-center">
              <img 
                src={isAttackStat ? atkIcon : defIcon} 
                alt={isAttackStat ? "Attack Icon" : "Defense Icon"}
                className="h-4 w-4 mr-2" 
              />
              <p className={`${isAttackStat ? "text-red-500" : "text-blue-500"} text-sm font-bold`}>
                <a
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content={`Base: ${stats.baseStatValue} + 
                  Modifiers: ${stats.prefixModifier.toFixed(1)} / ${stats.suffixModifier.toFixed(1)}`}
                  data-tooltip-place="bottom"
                >
                  {isAttackStat ? `Attack: ${stats.attack}` : `Defense: ${stats.defense}`}
                </a>
                <Tooltip id="my-tooltip" />
              </p>
            </div>
            {weaponType && (
              <p className="text-sm italic text-black mt-2 text-left font-bold">
                {weaponType}
              </p>
            )}
            {stats.armorType && (
              <p className="text-sm italic text-black mt-2 text-left font-bold">
                {stats.armorType}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdinalCard;
