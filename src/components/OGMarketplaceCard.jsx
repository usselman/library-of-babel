import React, { useState, useEffect } from 'react';

const OGMarketplaceCard = ({ listing, purchaseOrdinal, exchangeRate }) => {
    const [verificationStatus, setVerificationStatus] = useState('Pending');
    const [verificationStyle, setVerificationStyle] = useState({});
    const lockQueryUrl = 'https://ordinals.gorillapool.io/api/locks/txid/';

    const MARKET_FEE_RATE = 0.015;
    let price = ((listing.data.list.price / 100000000) + (listing.data.list.price / 100000000 * MARKET_FEE_RATE)).toFixed(4);
    let USDprice = (price * exchangeRate).toFixed(2);

    useEffect(() => {
        verifyRecord();
    }, [listing]);

    if (!listing || listing.length === 0) {
        return <div>No listing available</div>;
    }

    const isDigit = (item) => {
        const selectedIndex = item.origin?.data?.insc?.words[0] === 'og' ? 1 : 0;
        const parsed = parseInt(item.origin?.data?.insc?.words[selectedIndex], 10);
        return !isNaN(parsed);
    };

    const handleBuyClick = () => {
        const outpoint = listing.outpoint;
        purchaseOrdinal(outpoint, MARKET_FEE_RATE, "1PSmNxwoBVcsAB3bRRccDqbFkjtBemS5qh");
    };

    // Refactored checkLock function
    const checkLock = async (txid) => {
        const url = lockQueryUrl + txid;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (!data || data.length === 0) {
                return false;
            }
            for (const item of data) {
                if (item.data && item.data.lock && item.satoshis >= 1000000 && item.data.lock.until >= 1050000) {
                    return true; // Valid lock found
                }
            }
            return false; // No valid lock found
        } catch (error) {
            console.error('Error fetching lock data:', error);
            return false;
        }
    };

    const verifyRecord = async () => {
        if (!isDigit(listing)) {
            setVerificationStatus("Not A Number (✗)");
            return;
        }

        try {
            // Assuming the first check is to ensure the '.og' is the first of its kind
            const hasLock = await checkLock(listing.origin.outpoint);
            if (hasLock) {
                setVerificationStatus("Verified (✓)");
                setVerificationStyle({ color: 'green' });
            } else {
                setVerificationStatus("Not Verified or Lock Invalid (✗)");
                setVerificationStyle({ color: 'red' });
            }
        } catch (error) {
            console.error('Error verifying record:', error);
            setVerificationStatus("Verification Error");
            setVerificationStyle({ color: 'red' });
        }
    };

    return (
        <div className="marketplace-container">
            <div className="listing-card rounded-lg overflow-hidden m-2 p-4 bg-white border-2 border-black shadow-xl ">
                <div className="px-6 py-4">
                    <div className="font-bold text-2xl mb-2 tracking-widest">{listing.origin.data.insc.text}</div>
                    <div style={verificationStyle}>{verificationStatus}</div>
                    <div className="border-0 border-black text-md rounded-xl p-2">
                        <div className="font-bold mb-2 underline hover:text-blue-500"><a href={`https://whatsonchain.com/tx/${listing.txid}`}>tx</a></div>
                        <div className="font-bold mb-2 underline hover:text-blue-500"><a href={`https://whatsonchain.com/block-height/${listing.height}`}>blk: {listing.height}</a></div>
                        <div className="font-bold mb-2 underline hover:text-blue-500"><a href={`https://1satordinals.com/inscription/${listing.origin.num}`}>#{listing.origin.num}</a></div>
                        Owned by: <span className="font-light flex place-content-center">
                            {listing?.owner ? `${listing.owner.slice(0, 4)}...${listing.owner.slice(-4)}` : 'N/A'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleBuyClick}
                    className="buy-btn border-0 text-md bg-blue-400 hover:bg-green-700 hover:text-white border-black rounded-xl p-4">
                    {price} BSV (${USDprice})
                </button>
            </div>
        </div>
    );
};

export default OGMarketplaceCard;
