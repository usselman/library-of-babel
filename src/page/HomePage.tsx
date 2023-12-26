import React, { useEffect, useState } from 'react';
import getGlobalOrderBook from './api/orderbook';
import getHodlBook from './api/hodlbook';
import getOGBook from './api/ogbook';
import { PandaConnectButton } from "../components/PandaConnectButton";
import OrdinalCard from "../components/OrdinalCard";
import LRCCard from "../components/LRCCard";
import SonataCard from "../components/SonataCard";
import OGCards from "../components/OGCards";
import MarketplaceCard from "../components/MarketplaceCard";
import HODLMarketplaceCard from "../components/HODLMarketplaceCard";
import OGMarketplaceCard from "../components/OGMarketplaceCard";
import PriceHistoryChart from "../components/PriceHistoryChart";
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import {
  Addresses,
  SignedMessage,
  usePandaWallet,
} from "panda-wallet-provider";

const initProvider = () => {
  if ("panda" in window) {
    const provider = window.panda;

    if (provider?.isReady) {
      return provider;
    }
  }

  window.open(
    "https://chromewebstore.google.com/detail/panda-wallet/mlbnicldlpdimbjdcncnklfempedeipj",
    "_blank"
  );
};

export const HomePage = () => {
  const wallet = usePandaWallet();
  const [pubKey, setPubKey] = useState<string | undefined>();
  const [addresses, setAddresses] = useState<Addresses | undefined>();
  const [ordinals, setOrdinals] = useState<any[]>([]);
  const [ordAddress, setOrdAddress] = useState<string | undefined>();
  const [bsvAddress, setBsvAddress] = useState<string | undefined>();
  const [identityAddress, setIdentityAddress] = useState<string | undefined>();
  const [hodlSum, setHodlSum] = useState<number>(0);
  const [selectedType, setSelectedType] = useState('HODL Marketplace');
  const [orderBook, setOrderBook] = useState<any[]>([]);
  const [hodlBook, setHodlBook] = useState<any[]>([]);
  const [ogBook, setOGBook] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState('collection');
  const [locations, setLocations] = useState<any[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number>(0);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const data = await getGlobalOrderBook();
        setOrderBook(data);
        console.log('order book: ', data);
      } catch (error) {
        console.error("Failed to fetch order book", error);
      }
    };

    fetchOrderBook();
  }, []);

  useEffect(() => {
    const fetchHodlBook = async () => {
      try {
        const data = await getHodlBook();
        setHodlBook(data);
        //console.log('hodl book: ', data);
      } catch (error) {
        console.error("Failed to fetch hodl book", error);
      }
    };

    fetchHodlBook();
  }, []);

  useEffect(() => {
    const fetchOGBook = async () => {
      try {
        const data = await getOGBook();
        setOGBook(data);
        console.log('og book: ', data);
      } catch (error) {
        console.error("Failed to fetch og book", error);
      }
    };

    fetchOGBook();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (wallet && wallet.isConnected) {
        const isConnected = await wallet.isConnected();
        if (isConnected) {
          const addrs = await wallet.getAddresses();
          if (addrs) {
            setAddresses(addrs);
            setOrdAddress(addrs.ordAddress);
            setBsvAddress(addrs.bsvAddress);
            setIdentityAddress(addrs.identityAddress);
          }
          console.log("addresses: ", addrs);
          const ords = await wallet.getOrdinals();
          if (ords) setOrdinals(ords);
          console.log("ords: ", ords);
        }
      }
    };

    if (wallet) {
      fetchData();
    }
  }, [wallet]);

  useEffect(() => {
    // Define the pullHODLs function here
    const pullHODLs = async () => {
      const query = `
          {locations}
      `;

      try {
        const response = await axios.post('https://api.hodlock.com/graphql', { query });
        if (response.data && response.data.data && response.data.data.locations) {
          setLocations(response.data.data.locations);
          console.log("GraphQL: ", response.data);
        } else {
          console.error('GraphQL response does not contain expected data.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call pullHODLs when the component mounts
    pullHODLs();
  }, []);

  useEffect(() => {
    console.log("Locations: ", locations);
  }, [locations]);

  useEffect(() => {
    async function getExchangeRate() {
      const url = 'https://api.whatsonchain.com/v1/bsv/main/exchangerate';
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        setExchangeRate(parseFloat(data.rate));
        console.log("Exchange rate fetched: ", exchangeRate);
      } catch (error) {
        console.error("Fetching exchange rate failed: ", error);
      }
    }

    getExchangeRate();
  }, []);

  useEffect(() => {
    async function getCurrentBlockHeight() {
      const url = 'https://api.whatsonchain.com/v1/bsv/main/chain/info';
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        setCurrentBlockHeight(parseInt(data.blocks, 10));
        console.log("Current block height fetched: ", currentBlockHeight);
      } catch (error) {
        console.error("Fetching block height failed: ", error);
      }
    }
    getCurrentBlockHeight();
  }, []);

  const handleConnect = async () => {
    if (!wallet.connect) {
      window.open(
        "https://github.com/Panda-Wallet/panda-wallet#getting-started-alpha",
        "_blank"
      );
      return;
    }
    const key = await wallet.connect();
    if (key) setPubKey(key);
  };

  const handleChange = (event: any) => {
    setSelectedType(event.target.value);
  };

  const listOrdinal = async () => {
    alert('Coming soon!');
  }

  const purchaseOrdinal = async (outpoint: any, marketplaceRate: any, marketplaceAddress: string) => {
    const purchaseParams = {
      outpoint,
      marketplaceRate,
      marketplaceAddress
    };

    try {
      const txid = await wallet.purchaseOrdinal(purchaseParams);
      console.log(`Purchase successful! Transaction ID: ${txid}`);
      // Update the UI or state as needed
    } catch (err: any) {
      console.error(`Purchase failed: ${err.message}`);
      // Handle errors and update UI accordingly
    }
  };

  const renderContent = () => {
    switch (selectedType) {
      case 'OGs':
        return renderOGCards();
      case 'Sonatas':
        return renderSonatas();
      case 'LRC-20s':
        return renderLRC20Cards();
      case 'Tale of Shua Gears':
        return renderOrdinalCards();
      default:
      case 'Global Marketplace':
        return renderGlobalMarketplace();
      case 'HODL Marketplace':
        return renderGlobalHodlMarketplace();
      case 'OG Marketplace':
        return renderGlobalOGMarketplace();
        return null;
    }
  };

  const renderGlobalMarketplace = () => {
    const filteredListings = orderBook.filter(
      (listing: any) => {
        return (
          listing?.origin?.data?.map?.app === "taleofshua"
        )
      }
    ).sort((a, b) => {
      // Assuming the price is stored in `listing.data.list.price` and is a number
      const numA = extractNumber(a?.data?.list?.price?.toString());
      const numB = extractNumber(b?.data?.list?.price?.toString());
      return (numA ?? 0) - (numB ?? 0);
    });

    return (
      <>
        {/* <div className="text-center text-2xl mt-4 mb-4">
          Tale of Shua Gear Marketplace
        </div> */}
        <div className="text-center text-2xl mt-4 mb-4">
          <span className="underline hover:text-blue-500 rounded-xl"><a href="https://taleofshua.com">Gear</a></span> is a lock-to-mint collection by Joshua Henslee.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredListings.map((listing, index) => (
            <MarketplaceCard key={index} listing={listing} purchaseOrdinal={purchaseOrdinal} />
          ))}
        </div>
      </>
    )
  }

  const renderGlobalHodlMarketplace = () => {
    const filteredListings = hodlBook?.filter(
      (listing: any) => {
        return (
          listing?.origin?.data?.insc?.json?.id === "bfd3bfe2d65a131e9792ee04a2da9594d9dc8741a7ab362c11945bfc368d2063_1"
        )
      }
    ).sort((a, b) => {
      // Assuming the price is stored in `listing.data.list.price` and is a number
      const numA = extractNumber(a?.data?.list?.price?.toString());
      const numB = extractNumber(b?.data?.list?.price?.toString());
      return (numA ?? 0) - (numB ?? 0);
    });

    return (
      <>
        <div className="text-center text-2xl mt-4 mb-4">
          <span className="underline hover:text-blue-500 rounded-xl"><a href="https://ordinals.gorillapool.io/content/1f2d8349d15ef5287c5cada779f7e6875e123fe0ab788b478a17514b5746db90_0">$hodl</a></span> is the first of its kind LRC-20 token.
        </div>
        <PriceHistoryChart data={filteredListings} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredListings.map((listing, index) => (
            <HODLMarketplaceCard key={index} listing={listing} locations={locations} purchaseOrdinal={purchaseOrdinal} exchangeRate={exchangeRate} />

          ))}
        </div>


      </>
    )
  }

  const renderGlobalOGMarketplace = () => {
    const filteredListings = ogBook.filter(
      (listing: any) => {
        return (
          listing?.origin?.data?.insc?.words[1] === "og"
        )
      }
    ).sort((a, b) => {
      // Assuming the price is stored in `listing.data.list.price` and is a number
      const numA = extractNumber(a?.data?.list?.price?.toString());
      const numB = extractNumber(b?.data?.list?.price?.toString());
      return (numA ?? 0) - (numB ?? 0);
    });

    return (
      <>
        <div className="text-center text-2xl mt-4 mb-4">
          <span className="underline hover:text-blue-500 rounded-xl"><a href="https://www.hodlocker.com/zackwins/post/d2167c682c0ce72574fe2d21a81987571d42dc51b38c94c0cbe16ac40ad770c0">.OG</a></span> is the first of its kind lock-to-mint numbered namespace.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredListings.map((listing, index) => (
            <OGMarketplaceCard listing={listing} purchaseOrdinal={purchaseOrdinal} />

          ))}
        </div>
      </>
    )
  }

  const renderSonatas = () => {

    const filteredSonatas = ordinals.filter(
      (ordinal) =>
        ordinal?.data?.insc?.json?.p ===
        "sonata"
    );
    return (
      <>
        <div className="text-center text-2xl mt-4 mb-4">
          Sonata is an experimental format to inscribe music metadata on-chain.
        </div>
        <div className="text-center text-2xl m-8">
          <a className="hover:text-blue-900 hover:bg-blue-200 bg-gray-100 text-gray-900 border-0 border-black rounded-xl p-4 m-4" href="https://usselman.github.io/distromint/">Inscribe here</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSonatas.map((ordinal, index) => (
            <SonataCard key={index} ordinal={ordinal} transferOrdinal={transferOrdinal} />
          ))}
        </div>
      </>
    );

  }

  const renderLRC20Cards = () => {
    const filteredLRC20s = ordinals.filter(
      (ordinal) =>
        ordinal?.data?.insc?.json?.p ===
        "lrc-20"
    );
    console.log("LRC20s: ", filteredLRC20s);
    return (
      <>
        <div className="text-center text-2xl mt-4 mb-4">
          <span className="underline hover:text-blue-500 rounded-xl"><a href="https://ordinals.gorillapool.io/content/1f2d8349d15ef5287c5cada779f7e6875e123fe0ab788b478a17514b5746db90_0">$hodl</a></span> is the first of its kind LRC-20 token.
        </div>
        <div>
          <h4 className="text-2xl font-semibold text-black text-center">
            Total $hodl: {hodlSum}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

          {filteredLRC20s.map((ordinal, index) => (
            <LRCCard key={index} ordinal={ordinal} setHodlSum={setHodlSum} locations={locations} />
          ))}
        </div>
      </>
    );
  }

  const extractNumber = (text: string): number | null => {
    const parts = text.split(" ");
    if (parts.length > 0 && !isNaN(parseInt(parts[0], 10))) {
      return parseInt(parts[0], 10);
    }
    return null;
  };

  const renderOGCards = () => {

    const filteredOGs = ordinals
      .filter((ordinal) => {
        return (
          ordinal?.origin?.data?.insc?.words &&
          ordinal.origin.data.insc.words.length > 1 &&
          ordinal.origin.data.insc.words[1] === "og"
        );
      })
    // .sort((a, b) => {
    //   const numA = extractNumber(a?.data?.insc?.text);
    //   const numB = extractNumber(b?.data?.insc?.text);
    //   return (numA ?? 0) - (numB ?? 0);
    // });

    return (
      <>
        <div className="text-center text-2xl mt-4 mb-4">
          <span className="underline hover:text-blue-500 rounded-xl"><a href="https://www.hodlocker.com/zackwins/post/d2167c682c0ce72574fe2d21a81987571d42dc51b38c94c0cbe16ac40ad770c0">.OG</a></span> is the first of its kind lock-to-mint numbered namespace.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredOGs.map((ordinal, index) => (
            <OGCards key={index} ordinal={ordinal} address={ordAddress} transferOrdinal={transferOrdinal} />
          ))}
        </div>
      </>
    );
  }

  const getRarityValue = (name: string) => {
    const parts = name.split(" ");
    const hasPrefix = parts.length > 1 && parts[0] !== "of";
    const hasSuffix = parts.includes("of");

    if (hasPrefix && hasSuffix) return 3; // Rare
    if (hasPrefix || hasSuffix) return 2; // Uncommon
    return 1; // Common
  };

  const renderOrdinalCards = () => {
    const dataToShow = viewMode === 'collection' ? ordinals : orderBook;

    const filteredOrdinals = ordinals.filter(
      (ordinal) =>
        ordinal?.data?.map?.subTypeData?.collectionId ===
        "b68a700c91c6ece44aa6c2148c84c25a9a22da739769110e1ba01dbb0ff2df4a_1"
    )
      .map(ordinal => ({
        ...ordinal,
        rarityValue: getRarityValue(ordinal.data.insc.text)
      }))
      .sort((a, b) => b.rarityValue - a.rarityValue) // Sort by descending rarity value
      .map((ordinal, index) => (
        <OrdinalCard key={index} ordinal={ordinal} transferOrdinal={transferOrdinal} listOrdinal={listOrdinal} />
      ));

    return (
      <>
        <div className="text-center text-2xl mt-4 mb-4">
          <span className="underline hover:text-blue-500 rounded-xl"><a href="https://taleofshua.com">Tale of Shua Gear</a></span> is a lock-to-mint collection by Joshua Henslee.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredOrdinals}
        </div>
      </>
    );
  };

  const transferOrdinal = async (address: string, origin: string, outpoint: string) => {
    try {
      const txid = await wallet.transferOrdinal({ address, origin, outpoint });
      console.log(txid);
      alert(`Transfer successful! Transaction ID: ${txid}`);
    } catch (err: any) {
      console.error(err);
      alert(`Transfer failed: ${err.message}`);
    }
  };

  const tooltipId = `tooltip-disclaimer`;

  return (
    <div className="App">
      <div className="bg-gray m-4 p-4">
        {/* <img
          src={pandaIcon}
          alt="Panda Wallet Icon"
          className="mx-auto h-20 w-20"
        /> */}
        {/* {ordinals.length == 0 &&

          <>
            <div className="h-8" />
            <h1 className="text-2xl font-bold text-center text-black">Connect your <span className="underline hover:text-blue-500"><a href="https://github.com/Panda-Wallet/panda-wallet#getting-started-alpha">Panda Wallet</a></span> to view inscriptions:</h1>
            <div className="place-content-center flex">
              <PandaConnectButton
                className="m-4 p-4 bg-blue-900 text-white rounded hover:bg-blue-600"
                onClick={handleConnect}
              />
            </div>
            <h2 className="text-lg font-bold text-center italic text-black mt-2">Refresh after logging in if nothing shows.</h2>
            <h2 className="text-lg font-bold text-center italic text-black mt-2">If nothing shows after that, open extension and refresh.</h2>

            <div className="h-8" />
          </>

        } */}

        {/* {pubKey && (
          <p className="mt-2 text-sm text-gray-700">Public Key: {pubKey}</p>
        )}
        {addresses && (
          <p className="mt-2 text-sm text-gray-700">
            Addresses: {JSON.stringify(addresses)}
          </p>
        )} */}
        {/* {wallet && ordinals.length > 0 && ( */}
        <div className="mt-12">
          <div className="parchment-container">
            <h4 className="text-4xl font-semibold text-black text-center title">
              <span className="hover:text-blue-500"><a href="https://github.com/usselman/library-of-babel">Library of Babel</a></span>
            </h4>

            <p className="text-sm font-semibold text-black text-center hover:text-blue-500 rounded-xl author">
              <a href="https://twitter.com/worldbuilder_us">@worldbuilder.us</a>
            </p>
          </div>

          <h2 className="md:mt-2 sm:mt-0"><span className="text-green-600">${exchangeRate.toFixed(2)}</span> #{currentBlockHeight}</h2>
          <div className="h-16" />
          <PandaConnectButton
            className="m-4 p-4 rounded-md bg-blue-900 text-white hover:bg-blue-600 md:absolute top-4 right-4 sm:hidden md:scale-100 sm:scale-50 place-content-center sm:justify-center md:flex"
            onClick={handleConnect}
          />
          <h4 className="text-4xl font-semibold text-black text-center">
            Inscriptions
          </h4>
          <p className="text-md text-black text-center mt-4">
            Keep in mind the amounts may not be accurate! <span className="underline hover:text-blue-500"><a href="https://github.com/Panda-Wallet/panda-wallet#getting-started-alpha">Panda Wallet</a></span> shows latest 1000 inscriptions as of v2.6.2.
          </p>
          <p className="text-md text-black text-center mt-2">
            Make sure you are running latest version of Panda (2.9.0).
          </p>
          <div className="text-xl font-bold text-red-500 p-4 text-center">
            <a
              data-tooltip-id={tooltipId}
              data-tooltip-content={`
                This is an EXPERIMENTAL MARKETPLACE. Research before purchase!
                TRADE AT YOUR OWN RISK.
              `}
              data-tooltip-place="bottom"
            >
              <p>DISCLAIMER</p>
            </a>
            <Tooltip id={tooltipId} />
          </div>

          <div className="h-2" />
          <select value={selectedType} onChange={handleChange} className="mb-4 rounded-xl border-2 p-4 border-black bg-white">
            <option value="OGs">.OGs</option>
            <option value="Sonatas">Sonatas</option>
            <option value="LRC-20s">LRC-20s</option>
            <option value="Tale of Shua Gears">Tale of Shua Gears</option>
            <option value="Global Marketplace">Gear Marketplace</option>
            <option value="HODL Marketplace">HODL Marketplace</option>
            <option value="OG Marketplace">OG Marketplace</option>
          </select>

          {renderContent()}
        </div>
        {/* )} */}
      </div>
    </div>
  );
};