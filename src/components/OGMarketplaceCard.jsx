import React, { useState, useEffect } from 'react';

const OGMarketplaceCard = ({ listing, purchaseOrdinal }) => {
    const [verificationStatus, setVerificationStatus] = useState('Pending');
    const [verificationStyle, setVerificationStyle] = useState({});

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
        const marketplaceRate = 0.01; // Example rate, adjust as needed
        const marketplaceAddress = "1PSmNxwoBVcsAB3bRRccDqbFkjtBemS5qh"; // Replace with actual address

        purchaseOrdinal(outpoint, marketplaceRate, marketplaceAddress);
    };

    const checkOnOrdinalsGorillaPool = async (txid) => {
        try {
            const ordinalsResponse = await fetch(`https://ordinals.gorillapool.io/api/locks/txid/${txid}`);
            const ordinalsData = await ordinalsResponse.json();
            console.log("ordinal locks: ", ordinalsData);

            let isVerified = false;
            for (const item of ordinalsData) {
                if (item.satoshis >= 1000000 && item.data && item.data.lock && item.data.lock.until === 1050000) {
                    isVerified = true;
                    break;
                }
            }

            if (isVerified) {
                setVerificationStatus("Verified (✓)");
                setVerificationStyle({ color: 'green' });
            } else {
                setVerificationStatus("Not Verified (✗)");
                setVerificationStyle({ color: 'red' });
            }
        } catch (error) {
            console.error('Error checking on Ordinals GorillaPool:', error);
            setVerificationStatus("Verification Error");
        }
    };


    const verifyRecord = async () => {
        if (isDigit(listing)) {
            try {
                const searchResponse = await fetch('https://ordinals.gorillapool.io/api/inscriptions/search?dir=ASC&limit=1&offset=0', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ insc: { file: { hash: listing?.origin?.data?.insc?.file?.hash } } })
                });
                const searchData = await searchResponse.json();
                console.log("searchData: ", searchData);

                if (searchData[0] && searchData[0].spend === listing.txid) {
                    checkOnOrdinalsGorillaPool(listing?.origin?.outpoint);
                } else {
                    setVerificationStatus("Not the first inscription (✗)");
                    setVerificationStyle({ color: 'red' });
                }
            } catch (error) {
                console.error('Error verifying record:', error);
                setVerificationStatus("Verification Error");
                setVerificationStyle({ color: 'red' });
            }
        } else {
            setVerificationStatus("Not A Number (✗)");
        }
    };

    // useEffect(() => {
    //     switch (verificationStatus) {
    //         case 'Verified (✓)':
    //             setVerificationStyle({ color: 'green' });
    //             break;
    //         case 'Not Verified (✗)':
    //         case 'Verification Error':
    //         case 'Not A Number (✗)':
    //         case 'Not the first inscription (✗)':
    //             setVerificationStyle({ color: 'red' });
    //             break;
    //         default:
    //             setVerificationStyle({});
    //     }
    // }, [verificationStatus]);

    return (
        <div className="marketplace-container">
            <div className="listing-card rounded-lg overflow-hidden m-4 p-4 bg-white border-4 border-black shadow-xl hover:bg-gray-300">
                <div className="px-6 py-4">
                    <div className="font-bold text-lg mb-2">{listing.origin.data.insc.text}</div>
                    <div style={verificationStyle}>{verificationStatus}</div>
                    <div className="border-0 border-black text-md rounded-xl p-4 bg-white">
                        <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/tx/${listing.txid}`}>tx</a></div>
                        <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/block-height/${listing.height}`}>blk: {listing.height}</a></div>
                        <div className="font-bold mb-2 underline"><a href={`https://1satordinals.com/inscription/${listing.origin.num}`}>#{listing.origin.num}</a></div>
                    </div>
                </div>
                <button
                    onClick={handleBuyClick}
                    className="buy-btn border-0 text-md bg-blue-500 hover:bg-green-700 hover:text-white border-black rounded-xl p-4">
                    {listing.data.list.price / 100000000} BSV
                </button>
            </div>
        </div>
    );
};

export default OGMarketplaceCard;
