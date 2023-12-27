import React from 'react';
import { Buffer } from "buffer";

export const bsOrderToTxFormat = (bsvOrder) => {
    // Parse the input BSV ordinal outpoint into its components
    const txidHex = bsvOrder.substring(0, 64); // Extract the first 64 characters as txid
    const outputIndexHex = bsvOrder.substring(65); // Extract the remainder as outputIndex in hexadecimal

    // Convert txid to little-endian format
    const txidBytes = Buffer.from(txidHex, 'hex').reverse();

    // Convert output index to uint32LE (4 bytes)
    const outputIndex = Buffer.alloc(4);
    outputIndex.writeUInt32LE(parseInt(outputIndexHex, 16));

    // Concatenate txid and output index to get the final buffer
    const txFormatBuffer = Buffer.concat([txidBytes, outputIndex]);

    // Convert the buffer to a hexadecimal string
    const txFormatHex = txFormatBuffer.toString('hex');
    //console.log("converted txformat: ", txFormatHex);
    return txFormatHex;
};

const HODLMarketplaceCard = ({ listing, locations, purchaseOrdinal, exchangeRate }) => {
    console.log("passed hodl", listing);

    let lrcName;
    let verificationMessage = null;
    let verificationStyle = {};
    let valid;

    // Check if 'listing.data.insc.json' exists and has 'amt' and 'op' fields
    const inscData = listing?.origin?.data?.insc?.json;
    let amount = parseFloat(inscData?.amt);
    let op = inscData?.op;
    let price = (listing?.data?.list?.price / 100000000).toFixed(4);
    console.log("price: ", price, "amount: ", amount);
    let pricePerToken = (price / amount).toFixed(4);
    let USDpricePerToken = (pricePerToken * exchangeRate).toFixed(2);
    let USDPrice = (price * exchangeRate).toFixed(2);

    if (listing) {
        lrcName = 'hodl';

        const txFormat = bsOrderToTxFormat(listing.outpoint);

        if (locations.includes(txFormat)) {
            verificationMessage = 'Valid mint √';
            verificationStyle = { color: 'green' };
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

    // Check if 'amount' and 'op' are defined; if not, fall back to 'listing.origin'
    if (isNaN(amount) || !op) {
        const originData = listing?.origin?.data;
        amount = parseFloat(originData?.insc?.json?.amt);
        op = originData?.insc?.json?.op;
    }

    const handleBuyClick = () => {
        const outpoint = listing.outpoint;
        const marketplaceRate = 0.015; // Example rate, adjust as needed
        const marketplaceAddress = "1PSmNxwoBVcsAB3bRRccDqbFkjtBemS5qh"; // Replace with actual address

        purchaseOrdinal(outpoint, marketplaceRate, marketplaceAddress);
    };

    return valid ? (
        <div>
            <div className={`rounded-lg overflow-hidden m-4 p-4 bg-white border-4 border-black shadow-xl hover:bg-blue-100`}>
                <div className="px-6 py-4">
                    <div className="text-2xl mb-2 flex-grow"><span className="font-bold">{amount}</span> {lrcName}</div>
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
                <div className="text-sm p-2">
                    Owned by: <span className="font-light">{listing?.owner}</span>
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