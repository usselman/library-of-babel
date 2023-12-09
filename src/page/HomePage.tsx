import { useState, useEffect } from "react";
import { PandaConnectButton } from "../components/PandaConnectButton";
import OrdinalCard from "../components/OrdinalCard";
import LRCCard from "../components/LRCCard";
import SonataCard from "../components/SonataCard";
import OGCards from "../components/OGCards";
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
  const [hodlSum, setHodlSum] = useState<number>(0);
  const [selectedType, setSelectedType] = useState('OGs');

  useEffect(() => {
    const fetchData = async () => {
      if (wallet && wallet.isConnected) {
        const isConnected = await wallet.isConnected();
        if (isConnected) {
          const addrs = await wallet.getAddresses();
          if (addrs) {
            setAddresses(addrs);
            setOrdAddress(addrs.ordAddress);
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
        return null;
    }
  };


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
    return (
      <>
        <div>
          <h4 className="text-2xl font-semibold text-black text-center">
            Total $hodl: {hodlSum}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

          {filteredLRC20s.map((ordinal, index) => (
            <LRCCard key={index} ordinal={ordinal} setHodlSum={setHodlSum} />
          ))}
        </div>
      </>
    );
  }

  //   const handleHodlUpdate = (amount: number) => {
  //     setHodlSum(prevTotal => prevTotal + amount);
  // };

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
      .sort((a, b) => {
        const numA = extractNumber(a?.data?.insc.text);
        const numB = extractNumber(b?.data?.insc.text);
        return (numA ?? 0) - (numB ?? 0);
      });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredOGs.map((ordinal, index) => (
          <OGCards key={index} ordinal={ordinal} address={ordAddress} transferOrdinal={transferOrdinal} />
        ))}
      </div>
    );
  }

  const renderOrdinalCards = () => {
    const filteredOrdinals = ordinals.filter(
      (ordinal) =>
        ordinal?.data?.map?.subTypeData?.collectionId ===
        "b68a700c91c6ece44aa6c2148c84c25a9a22da739769110e1ba01dbb0ff2df4a_1"
    );
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredOrdinals.map((ordinal, index) => (
          <OrdinalCard key={index} ordinal={ordinal} transferOrdinal={transferOrdinal} />
        ))}
      </div>
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

  return (
    <div className="App">
      <div className="bg-gray m-4 p-4">
        {/* <img
          src={pandaIcon}
          alt="Panda Wallet Icon"
          className="mx-auto h-20 w-20"
        /> */}
        {ordinals.length == 0 &&

          <>
            <div className="h-8" />
            <h1 className="text-2xl font-bold text-center text-black">Connect your Panda Wallet to view inscriptions:</h1>
            <div className="place-content-center flex">
              <PandaConnectButton
                className="mt-4 p-2 bg-blue-900 text-white rounded hover:bg-blue-600"
                onClick={handleConnect}
              />
            </div>
            <h2 className="text-lg font-bold text-center italic text-black mt-8">(Refresh after logging in if nothing shows)</h2>

            <div className="h-8" />
          </>

        }

        {/* {pubKey && (
          <p className="mt-2 text-sm text-gray-700">Public Key: {pubKey}</p>
        )}
        {addresses && (
          <p className="mt-2 text-sm text-gray-700">
            Addresses: {JSON.stringify(addresses)}
          </p>
        )} */}
        {wallet && ordinals.length > 0 && (
          <div className="mt-12">
            <div className="parchment-container">
              <h4 className="text-4xl font-semibold text-black text-center title">
                Library of Babel
              </h4>
              <p className="text-sm font-semibold text-black text-center hover:text-blue-500 rounded-xl author">
                <a href="https://twitter.com/worldbuilder_us">@worldbuilder.us</a>
              </p>
              {/* Rest of your content */}
            </div>
            <div className="h-20" />
            <h4 className="text-4xl font-semibold text-black text-center">
              Your Inscriptions
            </h4>
            <p className="text-md text-black text-center mt-4">
              Keep in mind the amounts may not be accurate! Panda Wallet (v2.6.2) shows latest 1000 inscriptions.
            </p>
            <div className="h-8" />
            <select value={selectedType} onChange={handleChange} className="mb-4 rounded-xl border-2 p-4 border-black">
              <option value="OGs">.OGs</option>
              <option value="Sonatas">Sonatas</option>
              <option value="LRC-20s">LRC-20s</option>
              <option value="Tale of Shua Gears">Tale of Shua Gears</option>
            </select>

            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
};