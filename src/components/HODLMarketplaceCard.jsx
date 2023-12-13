import React from 'react';

const HODLMarketplaceCard = ({ listing, purchaseOrdinal }) => {
    console.log("passed hodl", listing);

    let lrcName;
    let verificationMessage = null;
    let verificationStyle = {};
    let valid;
    const amount = parseFloat(listing?.origin?.data?.insc?.json?.amt);

    if (listing) {
        lrcName = '$hodl';


        //Check block height for $hodl
        // if (listing.idx < 21000 || !listing.height) {
        //     verificationMessage = 'Invalid mint';
        //     verificationStyle = { color: 'red' };
        //     valid = false;
        // } else {
        //     verificationMessage = 'Valid mint';
        //     verificationStyle = { color: 'green' };
        //     valid = true;
        // }
    } else {
        lrcName = 'unknown LRC-20';
    }

    const handleBuyClick = () => {
        // Assuming 'outpoint', 'marketplaceRate', and 'marketplaceAddress' are the needed parameters
        // You might need to adjust these according to your application's logic
        const outpoint = listing.outpoint;
        const marketplaceRate = 0.025; // Example rate, adjust as needed
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