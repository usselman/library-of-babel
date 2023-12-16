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

const HODLMarketplaceCard = ({ listing, locations, purchaseOrdinal }) => {
    //console.log("passed hodl", listing);

    let lrcName;
    let verificationMessage = null;
    let verificationStyle = {};
    let valid;
    const amount = parseFloat(listing?.origin?.data?.insc?.json?.amt);

    if (listing) {
        lrcName = '$hodl';

        lrcName = '$hodl';

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
            verificationMessage = 'Invalid mint X';
            verificationStyle = { color: 'red' };
            valid = false;
        }
    } else {
        lrcName = 'unknown LRC-20';
    }

    const handleBuyClick = () => {
        // Assuming 'outpoint', 'marketplaceRate', and 'marketplaceAddress' are the needed parameters
        // You might need to adjust these according to your application's logic
        const outpoint = listing.outpoint;
        const marketplaceRate = 0.05; // Example rate, adjust as needed
        const marketplaceAddress = "1NHeCkh457C114iNUXZnuMowHddq4GkoAg"; // Replace with actual address

        purchaseOrdinal(outpoint, marketplaceRate, marketplaceAddress);
    };

    return (
        <div>
            <div className={`rounded-lg overflow-hidden m-4 p-4 bg-white border-4 border-black shadow-xl hover:bg-gray-300`}>
                <div className="px-6 py-4">
                    <div className="font-bold text-lg mb-2">{lrcName}</div>
                    {verificationMessage && <div style={verificationStyle}>{verificationMessage}</div>}
                    <div className="font-bold text-lg mb-2">Amount: {amount}</div>
                    <div className="border-2 border-black text-md rounded-xl p-4 bg-white">
                        <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/tx/${listing.txid}`}>{listing.origin.data.insc.json.op} tx</a></div>
                        <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/block-height/${listing.height}`}>blk: {listing.height}</a></div>
                        <div className="font-bold mb-2 underline"><a href={`https://1satlistings.com/inscription/${listing.origin.num}`}>#{listing.origin.num}</a></div>
                    </div>
                </div>
            </div>
            <div>
                <div className="text-sm p-2">
                    Owned by: {listing?.owner}
                </div>
                <button
                    onClick={handleBuyClick}
                    className="buy-btn border-0 text-md bg-blue-500 hover:bg-green-700 hover:text-white border-black rounded-xl p-4">
                    {(listing?.data?.list?.price / 100000000).toFixed(4)} BSV
                </button>
            </div>

        </div>
    );

};

export default HODLMarketplaceCard;