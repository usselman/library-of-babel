import React, { useEffect } from "react";

const LRCCard = ({ ordinal, setHodlSum }) => {
  console.log("passed LRC-20", ordinal);

  let lrcName;
  let verificationMessage = null;
  let verificationStyle = {};
  let valid;
  const amount = parseFloat(ordinal.data.insc.json.amt);

  if (ordinal.data.insc.json.id === 'bfd3bfe2d65a131e9792ee04a2da9594d9dc8741a7ab362c11945bfc368d2063_1') {
      lrcName = '$hodl';
      

      // Check block height for $hodl
      if (ordinal.height > 821205) {
          verificationMessage = 'Invalid mint (after blk #21205)';
          verificationStyle = { color: 'red' };
          valid = false;
      } else {
          verificationMessage = 'Valid mint';
          verificationStyle = { color: 'green' };
          valid = true;
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
