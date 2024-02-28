import React from 'react';

interface GayFrogMarketplaceCardProps {
    listing: any;
    purchaseOrdinal: (outpoint: string, rate: number, address: string) => void;
    exchangeRate: number;
}

const GayFrogMarketplaceCard: React.FC<GayFrogMarketplaceCardProps> = ({ listing, purchaseOrdinal, exchangeRate }) => {
    //console.log("listing: ", listing);
    const MARKET_FEE_RATE = 0.015;
    let price: any = ((listing?.data?.list?.price / 100000000) + (listing?.data?.list?.price / 100000000 * MARKET_FEE_RATE)).toFixed(4);
    let USDpricePerToken = (price * exchangeRate).toFixed(2);
    let USDPrice = (price * exchangeRate).toFixed(2);

    const {
        origin: {
            data: {
                insc: { file },
                map: { name, gayness, subTypeData },
            },
            outpoint,
        },
        owner,
    } = listing;

    const imageURL = `https://ordinals.gorillapool.io/content/${outpoint}`;
    const frogNumber = listing.origin.data.map.name;
    const frogName = listing.origin.data.map.gayness;
    const firstLetter = frogName.charAt(0).toUpperCase();
    const restOfWord = frogName.slice(1);
    const formattedFrogName = firstLetter + restOfWord;

    // Function to get color class based on frogName
    const colorMapping: { [key: string]: string } = {
        'Happy': 'text-green-500', // Common
        'Flaming': 'text-blue-500', // More rare
        'Saved': 'text-yellow-500' // Rarest
    };

    const getColorClassForFrogName = (formattedFrogName: string) => {
        return colorMapping[formattedFrogName] || 'text-black'; // Default color if not matched
    };

    const handleBuyClick = () => {
        const outpoint = listing.outpoint;
        const marketplaceRate = MARKET_FEE_RATE;
        const marketplaceAddress = "1PSmNxwoBVcsAB3bRRccDqbFkjtBemS5qh";

        purchaseOrdinal(outpoint, marketplaceRate, marketplaceAddress);
    };

    return (
        <div className="ordinal-card">
            <img
                src={imageURL}
                alt={`Gay Frog #${frogNumber}`}
                className="rounded-lg border-spacing-3 border-2 drop-shadow-xl border-black"
            />
            <div className="ordinal-details">
                <h3 className={`p-2 text-2xl ${getColorClassForFrogName(formattedFrogName)}`}>{formattedFrogName} <span className="">Frog</span></h3>
                Owned by: <span className="font-light flex place-content-center">
                    {listing?.owner ? `${listing.owner.slice(0, 4)}...${listing.owner.slice(-4)}` : 'N/A'}
                </span>
            </div>
            <button
                onClick={handleBuyClick}
                className="buy-btn border-0 text-md bg-blue-400 hover:bg-green-700 hover:text-white border-black rounded-xl p-4">
                {price} BSV (${USDPrice})
            </button>
        </div>
    );
};

export default GayFrogMarketplaceCard;
