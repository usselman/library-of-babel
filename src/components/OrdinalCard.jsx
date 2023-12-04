const OrdinalCard = ({ ordinal }) => {

  const getRarity = (name) => {
    const parts = name.split(' ');
    const hasPrefix = parts.length > 1 && parts[0] !== 'of';
    const hasSuffix = parts.includes('of');

    if (hasPrefix && hasSuffix) return 'Rare';
    if (hasPrefix || hasSuffix) return 'Uncommon';
    return 'Common';
  };

  const rarity = getRarity(ordinal.data.insc.text);

  const rarityStyles = {
    Common: 'border-black text-black shadow-common',
    Uncommon: 'border-blue-500 text-blue-500 shadow-uncommon',
    Rare: 'border-yellow-500 text-yellow-500 shadow-rare',
  };

  return (
    <div className={`rounded overflow-hidden m-4 p-4 bg-white border-2 ${rarityStyles[rarity]} hover:bg-gray-200  hover:extrabold`}>
      <div className="px-6 py-4">
        <div className="font-bold text-lg mb-2">{ordinal.data.insc.text}</div>
        <p className="text-gray-700 text-base">{rarity}</p>
        {/* <p className="text-gray-600 text-sm">
          Description: {ordinal.description || "N/A"}
        </p> */}
      </div>
    </div>
  );
};

export default OrdinalCard;
