import React, { useEffect } from "react";
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

interface LRCCardProps {
  ordinal: any;
  setHodlSum: (updateFn: (prevSum: number) => number) => void;
  locations: string[];
}

const LRCCard: React.FC<LRCCardProps> = ({ ordinal, setHodlSum, locations }) => {
  let lrcName: string;
  let verificationMessage: string | null = null;
  let verificationStyle: React.CSSProperties = {};
  let valid: boolean = false;
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
  }, [valid, amount, setHodlSum]);

  return (
    <div className={`rounded-lg overflow-hidden m-4 p-4 bg-white border-4 border-black shadow-xl hover:bg-blue-100`}>
      <div className="px-6 py-4">
        <div className="font-bold text-2xl mb-2 tracking-wider">{ordinal.data.insc.json.amt} {lrcName}</div>
        {verificationMessage && <div style={verificationStyle}>{verificationMessage}</div>}
        <div className="border-0 border-black text-md rounded-xl p-4 ">
          <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/tx/${ordinal.txid}`}>{ordinal.data.insc.json.op} tx</a></div>
          <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/block-height/${ordinal.height}`}>blk: {ordinal.height}</a></div>
          <div className="font-bold mb-2 underline"><a href={`https://1satordinals.com/inscription/${ordinal.origin.num}`}>#{ordinal.origin.num}</a></div>
        </div>
      </div>
    </div>
  );
};

export default LRCCard;
