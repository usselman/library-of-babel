import React, { useState } from 'react';
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


const MarketplaceCard = ({ listing, purchaseOrdinal, exchangeRate }) => {
    //console.log("passed listing", listing);
    const [isHovered, setIsHovered] = React.useState(false);

    const MARKET_FEE_RATE = 0.015;
    let price = ((listing?.data?.list?.price / 100000000) + (listing?.data?.list?.price / 100000000 * MARKET_FEE_RATE)).toFixed(4);
    let USDprice = (price * exchangeRate).toFixed(2);

    const getRarity = (name) => {
        const parts = name.split(" ");
        const hasPrefix = parts.length > 1 && parts[0] !== "of";
        const hasSuffix = parts.includes("of");

        if (hasPrefix && hasSuffix) return "Rare";
        if (hasPrefix || hasSuffix) return "Uncommon";
        return "Common";
    };

    const stats = calculateStats(listing?.origin?.data?.insc?.text);
    const rarity = getRarity(listing?.origin?.data?.insc?.text);
    const itemType = listing?.origin?.data?.insc?.text.split(" ")[listing?.origin?.data?.insc?.text.split(" ").length - 1];
    const weaponType = weaponTypes[itemType];
    const isAttackStat = stats && stats.attack !== undefined;

    const rarityStyles = {
        Common: "border-black text-black shadow-common hover:bg-gray-300",
        Uncommon: "border-blue-500 text-blue-500 shadow-uncommon hover:bg-blue-300",
        Rare: "border-yellow-500 shadow-rare rainbow-text",
    };

    const renderRarityBadge = (rarity) => {
        switch (rarity) {
            case "Rare":
                return <span className="text-yellow-500 font-bold">Rare</span>;
            case "Uncommon":
                return <span className="text-blue-500 font-bold">Uncommon</span>;
            case "Common":
            default:
                return <span className="text-black font-bold">Common</span>;
        }
    };

    const tooltipId = `tooltip-${listing.origin.num}`;

    const handleBuyClick = () => {
        const outpoint = listing.outpoint;
        const marketplaceRate = MARKET_FEE_RATE;
        const marketplaceAddress = "1PSmNxwoBVcsAB3bRRccDqbFkjtBemS5qh";

        purchaseOrdinal(outpoint, marketplaceRate, marketplaceAddress);
    };

    return (
        <div
            className="border-0 border-black"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            <div className={`relative rounded-lg overflow-hidden m-4 p-4 h-5/6 bg-white border-2 ${rarityStyles[rarity]}`}>
                <div className="px-6 py-4 mb-64">
                    <div className={`border-0 rounded-lg p-4 bg-white ${rarityStyles[rarity]} hover:bg-white hover:border-0`}>
                        <div className="font-bold text-lg mb-2 tracking-wider">{listing?.origin?.data?.insc?.text}</div>
                        <span className="text-sm">{renderRarityBadge(rarity)}</span>
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
                                            data-tooltip-id={tooltipId}
                                            data-tooltip-content={`Base: ${stats.baseStatValue} + 
                  Modifiers: ${stats.prefixModifier.toFixed(1)} / ${stats.suffixModifier.toFixed(1)}`}
                                            data-tooltip-place="bottom"
                                        >
                                            {isAttackStat ? `Attack: ${stats.attack}` : `Defense: ${stats.defense}`}
                                        </a>
                                        <Tooltip id={tooltipId} />
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
                    <div className={`absolute bottom-0 left-0 right-0 border-0 border-black shadow-none text-sm rounded-xl p-4 m-4 bg-white hover:bg-white ${rarityStyles[rarity]} hover:border-0`}>
                        <div className="font-bold mb-2 underline hover:text-blue-500"><a href={`https://whatsonchain.com/${listing.txid}`}>tx</a></div>
                        <div className="font-bold mb-2 underline hover:text-blue-500"><a href={`https://whatsonchain.com/block-height/${listing.height}`}>blk: {listing.height}</a></div>
                        <div className="font-bold mb-2 underline hover:text-blue-500"><a href={`https://1satlistings.com/inscription/${listing.origin.num}`}>#{listing.origin.num}</a></div>
                        <div className="text-center text-black">
                            Owned by: <span className="font-light flex place-content-center">
                                {listing?.owner ? `${listing.owner.slice(0, 4)}...${listing.owner.slice(-4)}` : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
            <div>
                <button
                    onClick={handleBuyClick}
                    className={`buy-btn text-black border-0 text-md bg-blue-400 hover:bg-green-500 hover:text-white border-black rounded-xl p-4 transition ease-in-out duration-300 ${isHovered ? 'bg-green-500 text-white' : ''}`}>
                    {price} BSV (${USDprice})
                </button>
            </div>

        </div>
    );
};

export default MarketplaceCard;
