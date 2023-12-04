import { useState, useEffect } from "react";
import { PandaConnectButton } from "../components/PandaConnectButton";
import OrdinalCard from "../components/OrdinalCard";
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

  useEffect(() => {
    const fetchData = async () => {
      if (wallet && wallet.isConnected) {
        const isConnected = await wallet.isConnected();
        if (isConnected) {
          const addrs = await wallet.getAddresses();
          if (addrs) setAddresses(addrs);
          console.log(addrs);
          const ords = await wallet.getOrdinals();
          if (ords) setOrdinals(ords);
          console.log(ords);
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

  const renderOrdinalCards = () => {
    const filteredOrdinals = ordinals.filter(
      (ordinal) =>
        ordinal.data.map.subTypeData.collectionId ===
        "b68a700c91c6ece44aa6c2148c84c25a9a22da739769110e1ba01dbb0ff2df4a_1"
    );
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ordinals.map((ordinal, index) => (
          <OrdinalCard key={index} ordinal={ordinal} />
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <div className="bg-gray m-4 p-4">
        {/* <img
          src={pandaIcon}
          alt="Panda Wallet Icon"
          className="mx-auto h-20 w-20"
        /> */}
        { ordinals.length == 0 && 
        
        <>
        <div className="h-8" />
        <h1 className="text-2xl font-bold text-center rainbow-text">Connect your Panda Wallet to view gear:</h1>
        <div className="place-content-center flex">
          <PandaConnectButton
            className="mt-4 p-2 bg-blue-900 text-white rounded hover:bg-blue-600"
            onClick={handleConnect}
          />
        </div> 
        <h2 className="text-lg font-bold text-center italic rainbow-text mt-8">(Refresh after logging in if nothing shows)</h2>

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
          <div className="mt-4">
            <h4 className="text-3xl font-semibold text-black text-center rainbow-text">
              Tale of Shua Gear:
            </h4>
            <p className="text-md text-black text-center italic">
            (Latest 100)
            </p>
            {renderOrdinalCards()}
          </div>
        )}
      </div>
    </div>
  );
};
