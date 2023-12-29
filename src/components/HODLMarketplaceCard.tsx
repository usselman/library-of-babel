import React, { useEffect } from 'react';
import { Buffer } from "buffer";

type BSVOrder = string;

export const bsOrderToTxFormat = (bsvOrder: BSVOrder): string => {
    const txidHex = bsvOrder.substring(0, 64);
    const outputIndexHex = bsvOrder.substring(65);

    const txidBytes = Buffer.from(txidHex, 'hex').reverse();

    const outputIndex = Buffer.alloc(4);
    outputIndex.writeUInt32LE(parseInt(outputIndexHex, 16));

    const txFormatBuffer = Buffer.concat([txidBytes, outputIndex]);

    return txFormatBuffer.toString('hex');
};

interface HODLMarketplaceCardProps {
    listing: any;
    locations: string[];
    purchaseOrdinal: (outpoint: string, rate: number, address: string) => void;
    exchangeRate: number;
}

const HODLMarketplaceCard: React.FC<HODLMarketplaceCardProps> = ({ listing, locations, purchaseOrdinal, exchangeRate }) => {
    const [validListings, setValidListings] = React.useState<any[]>([]);

    console.log("listing: ", validListings);
    let lrcName: string;
    let verificationMessage: string | null = null;
    let verificationStyle: React.CSSProperties = {};
    let valid: boolean = false;


    const inscData = listing?.origin?.data?.insc?.json;
    const MARKET_FEE_RATE = 0.015;
    let amount = parseFloat(inscData?.amt);
    if (listing?.data?.insc?.json?.amt) {
        amount = parseFloat(listing?.data?.insc?.json?.amt);
    }
    let op = inscData?.op;
    let price: any = ((listing?.data?.list?.price / 100000000) + (listing?.data?.list?.price / 100000000 * MARKET_FEE_RATE)).toFixed(4);
    let pricePerToken: any = (price / amount).toFixed(4);
    let USDpricePerToken = (pricePerToken * exchangeRate).toFixed(2);
    let USDPrice = (price * exchangeRate).toFixed(2);

    if (listing) {
        lrcName = 'hodl';

        const txFormat = bsOrderToTxFormat(listing.outpoint);

        if (locations.includes(txFormat)) {
            verificationMessage = 'Valid mint √';
            verificationStyle = { color: 'green' };
            validListings.push(listing);
            valid = true;
        } else if (listing.height === null) {
            verificationMessage = 'Pending miner confirmation';
            verificationStyle = { color: 'red' };
            valid = false;
        }
        else {
            verificationMessage = 'Invalid mint (or sold)!';
            verificationStyle = { color: 'red' };
            valid = false;
        }
    } else {
        lrcName = 'unknown LRC-20';
    }

    if (isNaN(amount) || !op) {
        const originData = listing?.origin?.data;
        amount = parseFloat(originData?.insc?.json?.amt);
        op = originData?.insc?.json?.op;
    }

    const handleBuyClick = () => {
        const outpoint = listing.outpoint;
        const marketplaceRate = MARKET_FEE_RATE;
        const marketplaceAddress = "1PSmNxwoBVcsAB3bRRccDqbFkjtBemS5qh";

        purchaseOrdinal(outpoint, marketplaceRate, marketplaceAddress);
    };

    return valid ? (
        <div>
            <div className={`rounded-lg overflow-hidden m-2 p-4 bg-white border-4 border-black shadow-xl hover:bg-blue-100`}>
                <div className="px-6 py-4">
                    <div className="text-2xl mb-2 flex-grow tracking-wider"><span className="font-bold">{amount}</span> {lrcName}</div>
                    {verificationMessage && <div style={verificationStyle}>{verificationMessage}</div>}
                    {/* <div className="font-bold text-lg mb-2">Amount: {amount}</div> */}
                    <div className="font-light text-md mb-2 mt-2">{pricePerToken}/hodl</div>
                    <div className="font-light text-md">(${USDpricePerToken}/hodl)</div>
                    <div className="border-0 border-black text-md rounded-xl p-4 ">
                        <div className="font-bold mb-2 underline hover:text-blue-500"><a href={`https://whatsonchain.com/tx/${listing.txid}`}>{op} tx</a></div>
                        <div className="font-bold mb-2 underline hover:text-blue-500"><a href={`https://whatsonchain.com/block-height/${listing.height}`}>blk: {listing.height}</a></div>
                        <div className="font-bold mb-2 underline hover:text-blue-500"><a href={`https://1satordinals.com/inscription/${listing.origin.num}`}>#{listing.origin.num}</a></div>
                    </div>
                </div>
            </div>
            <div>
                <div className="text-sm p-2 relative place-content-center">
                    Owned by: <span className="font-light flex place-content-center">{listing?.owner}</span>
                </div>
                <button
                    onClick={handleBuyClick}
                    className="buy-btn text-black border-0 text-md bg-blue-400 hover:bg-green-700 hover:text-white border-black rounded-xl p-4">
                    {price} BSV (${USDPrice})
                </button>
            </div>
        </div>
    ) : null;
};

export default HODLMarketplaceCard;