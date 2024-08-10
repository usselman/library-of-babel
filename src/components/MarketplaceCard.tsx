import React, { useState } from 'react';
import atkIcon from '../assets/atk.png';
import defIcon from '../assets/def.png';
import { Tooltip } from 'react-tooltip';
import { clothingItems, weaponItems, baseDefenseStats, baseAttackStats, weaponTypes, armorTypes, prefixes, suffixes } from './statsData';

/**
 * Converts a number to a modifier by dividing it by 100.
 * @param number - The number to convert.
 * @returns The modifier as a decimal.
 */
const convertToModifier = (number: number): number => number / 100;

const modifiers = {
    prefixes: Object.fromEntries(
        prefixes.map(([prefix, number]) => [prefix, 1 + convertToModifier(Number(number))])
    ),
    suffixes: Object.fromEntries(
        suffixes.map(([suffix, number]) => [suffix, 1 + convertToModifier(Number(number))])
    ),
};

/**
 * Calculates stats for an item based on its name.
 * @param itemName - The name of the item.
 * @returns An object containing the calculated stats.
 */
const calculateStats = (itemName: string | undefined) => {
    if (!itemName) return null;

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

    let baseStatValue: number;
    let statType: 'attack' | 'defense';
    let armorType: string | null = null;

    if (weaponItems.includes(baseItemName)) {
        baseStatValue = baseAttackStats[baseItemName as keyof typeof baseAttackStats] || 0;
        statType = 'attack';
    } else if (clothingItems.includes(baseItemName)) {
        baseStatValue = baseDefenseStats[baseItemName as keyof typeof baseDefenseStats] || 0;
        statType = 'defense';
        armorType = armorTypes[baseItemName as keyof typeof armorTypes] || null;
    } else {
        return null;
    }

    // Apply modifiers
    const prefixModifier = modifiers.prefixes[prefix] ? (modifiers.prefixes[prefix] - 1) * baseStatValue : 0;
    const suffixModifier = modifiers.suffixes[suffix] ? (modifiers.suffixes[suffix] - 1) * baseStatValue : 0;

    const totalStat = baseStatValue + prefixModifier + suffixModifier;

    // Limiting to two decimal places
    const finalStatValue = parseFloat(Math.ceil(totalStat).toFixed(2));

    return { [statType]: finalStatValue, baseStatValue, prefixModifier, suffixModifier, armorType };
};

// Type definitions for the component props
interface MarketplaceCardProps {
    listing: {
        data: {
            list: {
                price: number;
            };
        };
        origin: {
            data: {
                insc: {
                    text: string;
                };
            };
            num: number;
        };
        txid: string;
        height: number;
        owner?: string;
        outpoint: string;
    };
    purchaseOrdinal: (outpoint: string, rate: number, address: string) => void;
    exchangeRate: number;
}

/**
 * A component representing a card in the marketplace.
 * @param listing - The listing data for the item.
 * @param purchaseOrdinal - The function to handle purchasing the item.
 * @param exchangeRate - The current exchange rate for BSV to USD.
 * @returns A JSX element representing the marketplace card.
 */
const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ listing, purchaseOrdinal, exchangeRate }) => {
    const [isHovered, setIsHovered] = useState(false);

    const MARKET_FEE_RATE = 0.015;
    const price: any = ((listing.data.list.price / 100000000) + (listing.data.list.price / 100000000 * MARKET_FEE_RATE)).toFixed(4);
    const USDprice = (price * exchangeRate).toFixed(2);

    /**
     * Determines the rarity of the item based on its name.
     * @param name - The name of the item.
     * @returns The rarity of the item.
     */
    const getRarity = (name: string): 'Rare' | 'Uncommon' | 'Common' => {
        const parts = name.split(" ");
        const hasPrefix = parts.length > 1 && parts[0] !== "of";
        const hasSuffix = parts.includes("of");

        if (hasPrefix && hasSuffix) return "Rare";
        if (hasPrefix || hasSuffix) return "Uncommon";
        return "Common";
    };

    const stats = calculateStats(listing.origin.data.insc.text);
    const rarity = getRarity(listing.origin.data.insc.text);
    const itemType = listing.origin.data.insc.text.split(" ").pop() || '';
    const weaponType = weaponTypes[itemType as keyof typeof weaponTypes];
    const isAttackStat = stats && stats.attack !== undefined;

    const rarityStyles = {
        Common: "border-black text-black shadow-common hover:bg-gray-300",
        Uncommon: "border-blue-500 text-blue-500 shadow-uncommon hover:bg-blue-300",
        Rare: "border-yellow-500 shadow-rare rainbow-text",
    };

    /**
     * Renders the rarity badge based on the rarity level.
     * @param rarity - The rarity level.
     * @returns A JSX element for the rarity badge.
     */
    const renderRarityBadge = (rarity: 'Rare' | 'Uncommon' | 'Common'): JSX.Element => {
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

    /**
     * Handles the click event for buying the item.
     */
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
                        <div className="font-bold text-lg mb-2 tracking-wider">{listing.origin.data.insc.text}</div>
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
                                {listing.owner ? `${listing.owner.slice(0, 4)}...${listing.owner.slice(-4)}` : 'N/A'}
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
