

const SonataCard = ({ ordinal }) => {
    console.log("passed Sonata", ordinal);
  
    return (
      <div className={`rounded-lg overflow-hidden m-4 p-4 bg-blue-200 border-4 border-black shadow-xl hover:bg-gray-300`}>
        <div className="px-6 py-4 text-left">
        {/* <div className="font-bold mb-2 text-xs overflow-wrap"><a href={`https://whatsonchain.com/${ordinal.txid}`}>{ordinal.txid}</a></div> */}
        <div className="font-bold text-lg mb-2">Artist: {ordinal?.data?.insc?.json?.metadata?.artist}</div>
        <div className="font-bold text-lg mb-2">Title: {ordinal?.data?.insc?.json?.metadata?.songName}</div>
        <div className="font-bold text-lg mb-2">Format: {ordinal?.data?.insc?.json?.metadata?.format}</div>
        <div className="font-bold text-lg mb-2">Genre: {ordinal?.data?.insc?.json?.metadata?.genre}</div>
        <div className="font-bold text-lg mb-2">Label: {ordinal?.data?.insc?.json?.metadata?.label}</div>
        <div className="font-bold text-lg mb-2">Released: {ordinal?.data?.insc?.json?.metadata?.releaseDate}</div>
        <div className="h-4" />
        <div className="border-2 border-black text-md rounded-xl p-4 bg-white text-center">
          <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/tx/${ordinal.txid}`}>{ordinal.data.insc.json.op} tx</a></div>
          <div className="font-bold mb-2 underline"><a href={`https://whatsonchain.com/block-height/${ordinal.height}`}>blk: {ordinal.height}</a></div>
          <div className="font-bold mb-2 underline"><a href={`https://1satordinals.com/inscription/${ordinal.origin.num}`}>#{ordinal.origin.num}</a></div>
        </div>
        </div>
      </div>
    );
  };
  
  export default SonataCard;
  