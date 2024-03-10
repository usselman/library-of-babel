import React, { useState, useEffect } from 'react';
import { requestQueueService } from '../page/api/requestQueueService';

interface BSVMapMarketplaceCardProps {
  listing: any;
  purchaseOrdinal: (outpoint: string, marketFeeRate: number, address: string) => void;
  exchangeRate: number;
}

interface BlockTransactionsDisplayProps {
  txCount: number;
}

/**
 * A component to visually display the number of transactions in a block
 * as small squares within a larger square.
 * @param props Contains the number of transactions to display.
 */
const BlockTransactionsDisplay: React.FC<BlockTransactionsDisplayProps> = ({ txCount }) => {
  // Define a base size for the grid to maintain a consistent visual size
  const baseGridSize = 200; // Example base size in pixels

  // Calculate the ideal number of squares per row to achieve a roughly square shape
  const idealSquaresPerRow = Math.ceil(Math.sqrt(txCount));

  // Determine the size of each square based on the number of transactions
  // The size of each square is inversely proportional to the sqrt of txCount, 
  // adjusted to keep the overall grid within the baseGridSize.
  // Use Math.max to ensure squares have a minimum size, avoiding too small squares for very large txCounts.
  const squareSize = Math.max(5, baseGridSize / idealSquaresPerRow);

  // Adjust overall grid size based on the actual square size and the ideal squares per row
  const gridSize = squareSize * idealSquaresPerRow;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: `${gridSize}px`, height: `${gridSize}px`, margin: '10px auto', justifyContent: 'center', maxHeight: '250px' }}>
      {Array.from({ length: txCount }).map((_, index) => (
        <div key={index} style={{ width: `${squareSize - 2}px`, height: `${squareSize - 2}px`, margin: '1px', backgroundColor: 'orange' }}></div>
      ))}
    </div>
  );
};


/**
 * The main component for displaying a marketplace card, which includes
 * information about a BSV listing and a visual representation of the
 * number of transactions in the corresponding block.
 * @param props The properties for configuring the component, including the listing, purchaseOrdinal function, and exchange rate.
 */
const BSVMapMarketplaceCard: React.FC<BSVMapMarketplaceCardProps> = ({ listing, purchaseOrdinal, exchangeRate }) => {
  const MARKET_FEE_RATE = 0.015;
  const [txCount, setTxCount] = useState<number>(0);
  const [blockSize, setBlockSize] = useState<number>(0);

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const price: any = ((listing.data.list.price / 100000000) + (listing.data.list.price / 100000000 * MARKET_FEE_RATE)).toFixed(4);
  const USDprice = (price * exchangeRate).toFixed(2);

  const handleBuyClick = () => {
    const outpoint = listing.outpoint;
    purchaseOrdinal(outpoint, MARKET_FEE_RATE, "1PSmNxwoBVcsAB3bRRccDqbFkjtBemS5qh");
  };

  useEffect(() => {
    let isMounted = true; // Ensure we're still mounted when setting state

    const fetchTask = async () => {
      const network = 'main'; // or dynamic based on your needs
      const height = listing.origin.data.insc.words[0];
      const response = await fetch(`https://api.whatsonchain.com/v1/bsv/${network}/block/height/${height}`);
      const data = await response.json();

      if (isMounted) {
        setTxCount(data.txcount);
        setBlockSize((data.size / 1000));
      }
    };

    requestQueueService.addToQueue(fetchTask);

    return () => { isMounted = false; }; // Clean up
  }, [listing]);

  return (
    <div
      className="marketplace-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="listing-card rounded-lg overflow-hidden m-2 p-4 bg-white border-2 border-black shadow-xl hover:border-green-500 transition ease-in-out duration-300">
        <div className="px-6 py-0">
          <div className="font-bold text-2xl mb-2 tracking-widest">{listing.origin.data.insc.text}</div>

        </div>
        <div className="place-content-center">
          {(blockSize / 1000).toFixed(4)} mb
          <BlockTransactionsDisplay txCount={txCount} />
          Owned by: <span className="font-light flex place-content-center">
            {listing?.owner ? `${listing.owner.slice(0, 4)}...${listing.owner.slice(-4)}` : 'N/A'}
          </span>
        </div>

      </div>
      <button
        onClick={handleBuyClick}
        className={`buy-btn text-black border-0 mt-4 text-md bg-blue-400 hover:bg-green-500 hover:text-white border-black rounded-xl p-4 transition ease-in-out duration-300 ${isHovered ? 'bg-green-500 text-white' : ''}`}>
        {price} BSV (${USDprice})
      </button>
      <div className="border-0 border-black text-md rounded-xl p-2">
        <div className="font-bold mb-2 underline hover:text-blue-500"><a href={`https://whatsonchain.com/tx/${listing.txid}`}>tx</a></div>
        <div className="font-bold mb-2 underline hover:text-blue-500"><a href={`https://whatsonchain.com/block-height/${listing.height}`}>blk: {listing.height}</a></div>
        <div className="font-bold mb-2 underline hover:text-blue-500"><a href={`https://1satordinals.com/inscription/${listing.origin.num}`}>#{listing.origin.num}</a></div>

      </div>
    </div>
  );
};

export default BSVMapMarketplaceCard;