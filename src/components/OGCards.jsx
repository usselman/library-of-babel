import { useState, useEffect } from 'react';

const OGCards = ({ ordinal, address, transferOrdinal }) => {
    const [verificationStatus, setVerificationStatus] = useState('Pending');

    const isDigit = (item) => {
        const selectedIndex = item.data?.insc?.words[0] === 'og' ? 1 : 0;
        const parsed = parseInt(item.data?.insc?.words[selectedIndex], 10);
        return !isNaN(parsed);
    };

    const checkOnOrdinalsGorillaPool = async (txid) => {
        try {
            const ordinalsResponse = await fetch(`https://ordinals.gorillapool.io/api/locks/txid/${txid}`);
            const ordinalsData = await ordinalsResponse.json();

            // Iterate over the returned items and check for verification
            let isVerified = false;
            for (const item of ordinalsData) {
                if (item.satoshis >= 1000000 && item.data && item.data.lock && item.data.lock.until === 1050000) {
                    isVerified = true;
                    break; // Found a verified item, no need to check further
                }
            }

            if (isVerified) {
                setVerificationStatus("Verified (✓)");
            } else {
                setVerificationStatus("Not Verified (✗)");
            }
        } catch (error) {
            console.error('Error checking on Ordinals GorillaPool:', error);
            setVerificationStatus("Verification Error");
        }
    };


    const verifyRecord = async () => {
        if (isDigit(ordinal)) {
            try {
                const searchResponse = await fetch('https://ordinals.gorillapool.io/api/inscriptions/search?dir=ASC&limit=1&offset=0', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ insc: { file: { hash: ordinal.data.insc.file.hash } } })
                });
                const searchData = await searchResponse.json();

                if (searchData[0] && searchData[0].txid === ordinal.txid) {
                    checkOnOrdinalsGorillaPool(ordinal.txid);
                } else {
                    setVerificationStatus("Not the first inscription (✗)");
                }
            } catch (error) {
                console.error('Error verifying record:', error);
                setVerificationStatus("Verification Error");
            }
        } else {
            setVerificationStatus("Not A Number (✗)");
        }
    };

    useEffect(() => {
        verifyRecord();
    }, []);

    const handleTransfer = () => {
        // Prompt for the receiver's address
        const receiverAddress = prompt("Enter the receiver's address:");
        if (!receiverAddress) return;

        // Extract origin and outpoint from the ordinal
        const { origin, outpoint } = ordinal;

        // Call transferOrdinal function passed as a prop
        transferOrdinal(receiverAddress, origin, outpoint);
    };

    return (
        <div className={`rounded-lg overflow-hidden m-4 p-4 bg-white border-4 border-black shadow-xl`}>
            <div className="px-6 py-4">
                <div className="font-bold text-lg mb-2">{ordinal.data.insc.text}</div>
                {/* <button onClick={verifyRecord} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Verify
                </button> */}
                <div
                    className="m-4"
                    style={{ color: verificationStatus.includes("✓") ? 'green' : 'red' }}>
                    {verificationStatus}
                </div>
                <div className="text-center mt-4">
                    <button
                        onClick={handleTransfer}
                        className="transfer-btn border-0 text-md bg-blue-500 hover:bg-black hover:text-white border-black rounded-xl p-4 place-content-center">
                        Transfer
                    </button>
                </div>
                <div className="border-0 border-black text-md rounded-xl p-4 bg-white mt-4">
                    <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/tx/${ordinal.txid}`}>tx</a></div>
                    <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/block-height/${ordinal.height}`}>blk: {ordinal.height}</a></div>
                    <div className="font-bold mb-2 underline"><a href={`https://1satordinals.com/inscription/${ordinal.origin.num}`}>#{ordinal.origin.num}</a></div>
                </div>

            </div>
        </div>
    );
};

export default OGCards;
