import React, { useEffect } from "react";
import { Buffer } from "buffer"; // Import the Buffer module from the 'buffer' library

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

const LRCCard = ({ ordinal, setHodlSum, locations }) => {
  let lrcName;
  let verificationMessage = null;
  let verificationStyle = {};
  let valid;
  const amount = parseFloat(ordinal.data.insc.json.amt);

  if (ordinal.data.insc.json.id === 'bfd3bfe2d65a131e9792ee04a2da9594d9dc8741a7ab362c11945bfc368d2063_1') {
    lrcName = '$hodl';

    const txFormat = bsOrderToTxFormat(ordinal.outpoint);

    if (locations.includes(txFormat)) {
      verificationMessage = 'Valid mint';
      verificationStyle = { color: 'green' };
      valid = true;
    } else {
      verificationMessage = 'Invalid mint';
      verificationStyle = { color: 'red' };
      valid = false;
    }
  } else {
    lrcName = 'unknown LRC-20';
  }


  useEffect(() => {
    if (valid) {
      setHodlSum(prev => prev + amount);
    }
  }, []);


  return (
    <div className={`rounded-lg overflow-hidden m-4 p-4 bg-white border-4 border-black shadow-xl hover:bg-gray-300`}>
      <div className="px-6 py-4">
        <div className="font-bold text-lg mb-2">{lrcName}</div>
        {verificationMessage && <div style={verificationStyle}>{verificationMessage}</div>}
        <div className="font-bold text-lg mb-2">Amount: {ordinal.data.insc.json.amt}</div>
        <div className="border-2 border-black text-md rounded-xl p-4 bg-white">
          <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/tx/${ordinal.txid}`}>{ordinal.data.insc.json.op} tx</a></div>
          <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/block-height/${ordinal.height}`}>blk: {ordinal.height}</a></div>
          <div className="font-bold mb-2 underline"><a href={`https://1satordinals.com/inscription/${ordinal.origin.num}`}>#{ordinal.origin.num}</a></div>
        </div>
      </div>
    </div>
  );
};

export default LRCCard;
