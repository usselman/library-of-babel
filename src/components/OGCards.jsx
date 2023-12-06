

const OGCards = ({ ordinal }) => {
    console.log("passed LRC-20", ordinal);

    return (
      <div className={`rounded-lg overflow-hidden m-4 p-4 bg-white border-4 border-black shadow-xl hover:bg-gray-300`}>
        <div className="px-6 py-4">
        {/* <div className="font-bold mb-2 text-xs overflow-wrap"><a href={`https://whatsonchain.com/${ordinal.txid}`}>{ordinal.txid}</a></div> */}
        <div className="font-bold text-lg mb-2">{ordinal.data.insc.text}</div>
        <div className="border-2 border-black text-md rounded-xl p-4 bg-white">
          <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/tx/${ordinal.txid}`}>tx</a></div>
          <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/block-height/${ordinal.height}`}>blk: {ordinal.height}</a></div>
          <div className="font-bold mb-2 underline"><a href={`https://1satordinals.com/inscription/${ordinal.origin.num}`}>#{ordinal.origin.num}</a></div>
        </div>
        </div>
      </div>
    );
  };
  
  export default OGCards;
  