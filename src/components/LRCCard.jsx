

const LRCCard = ({ ordinal }) => {
    console.log("passed LRC-20", ordinal);

    let lrcName;
    if (ordinal.data.insc.json.id === 'bfd3bfe2d65a131e9792ee04a2da9594d9dc8741a7ab362c11945bfc368d2063_1') {
        lrcName = '$hodl';
    } else {
        lrcName = 'unknown LRC-20';
    }
  
    return (
      <div className={`rounded-lg overflow-hidden m-4 p-4 bg-white border-4 border-black shadow-xl hover:bg-gray-300`}>
        <div className="px-6 py-4">
        {/* <div className="font-bold mb-2 text-xs overflow-wrap"><a href={`https://whatsonchain.com/${ordinal.txid}`}>{ordinal.txid}</a></div> */}
        <div className="font-bold text-lg mb-2">Ticker: {lrcName}</div>
        <div className="font-bold text-lg mb-2">Amount: {ordinal.data.insc.json.amt}</div>
        <div className="font-bold text-lg mb-2 underline"><a href={`https://whatsonchain.com/${ordinal.txid}`}>{ordinal.data.insc.json.op} tx</a></div>
        <div className="font-bold text-lg mb-2 underline"><a href={`https://whatsonchain.com/block-height/${ordinal.height}`}>blk: {ordinal.height}</a></div>
        <div className="font-bold text-lg mb-2 underline"><a href={`https://1satordinals.com/inscription/${ordinal.origin.num}`}>#{ordinal.origin.num}</a></div>
        </div>
      </div>
    );
  };
  
  export default LRCCard;
  