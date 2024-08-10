import { useState, useEffect } from 'react';

interface OrdinalData {
    insc: {
        text: string;
        words: string[];
    };
}

interface Ordinal {
    txid: string;
    origin: {
        num: string;
    };
    outpoint: string;
    height: number;
    data: OrdinalData;
}

interface OGCardsProps {
    ordinal: Ordinal;
    address: string | null;  // Updated to accept string or null
    transferOrdinal: (receiverAddress: string, origin: Ordinal['origin'], outpoint: string) => void;  // Updated type for origin
}

/**
 * A component representing an OG Card.
 * @param ordinal - The ordinal data.
 * @param address - The address associated with the card.
 * @param transferOrdinal - Function to transfer the ordinal to another address.
 * @returns A JSX element representing the OG card.
 */
const OGCards: React.FC<OGCardsProps> = ({ ordinal, address, transferOrdinal }) => {
    const [verificationStatus, setVerificationStatus] = useState<string>('Pending');
    const lockQueryUrl = 'https://ordinals.gorillapool.io/api/locks/txid/';

    useEffect(() => {
        verifyRecord();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Checks if the word in the inscription data is a digit.
     * @param item - The ordinal data item.
     * @returns True if the word is a digit, otherwise false.
     */
    const isDigit = (item: Ordinal): boolean => {
        const selectedIndex = item.data?.insc?.words[0] === 'og' ? 1 : 0;
        const parsed = parseInt(item.data?.insc?.words[selectedIndex], 10);
        return !isNaN(parsed);
    };

    /**
     * Checks if the lock condition is met for the given transaction ID.
     * @param txid - The transaction ID to check.
     * @returns True if the lock conditions are met, otherwise false.
     */
    const checkLock = async (txid: string): Promise<boolean> => {
        const url = `${lockQueryUrl}${txid}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.some((item: any) => item.satoshis >= 1000000 && item.data?.lock?.until >= 1050000);
        } catch (error) {
            console.error('Error fetching lock data:', error);
            return false;
        }
    };

    /**
     * Verifies the record associated with the ordinal.
     */
    const verifyRecord = async () => {
        if (!isDigit(ordinal)) {
            setVerificationStatus("Not A Number (✗)");
            return;
        }

        const hasLock = await checkLock(ordinal.txid);
        setVerificationStatus(hasLock ? "Verified (✓)" : "Not Verified (✗)");
    };

    /**
     * Handles the transfer action for the ordinal.
     */
    const handleTransfer = () => {
        const receiverAddress = prompt("Enter the receiver's address:");
        if (!receiverAddress) return;
        transferOrdinal(receiverAddress, ordinal.origin, ordinal.outpoint);
    };

    return (
        <div className={`rounded-lg overflow-hidden m-4 p-4 bg-white border-2 border-black shadow-xl`}>
            <div className="px-6 py-4">
                <div className="font-bold text-2xl mb-2 tracking-widest">{ordinal?.data?.insc?.text}</div>
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
