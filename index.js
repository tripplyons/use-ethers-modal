import React from 'react';
const { createContext, useContext, useEffect, useState } = React;
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

const EthersModalContext = createContext();

// settings are for web3modal
// https://github.com/Web3Modal/web3modal#provider-options
export function EthersModalProvider({ children, settings }) {
  const [provider, setProvider] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const web3Modal = new Web3Modal(settings);
    setWeb3Modal(web3Modal);
  }, []);

  // check if the user changes wallets
  useEffect(() => {
    const interval = setInterval(async () => {
      if(account !== null && provider !== null) {
        let signer = provider.getSigner();
        let _account = await signer.getAddress();
        if(_account !== account) {
          setAccount(_account);
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  // check if the user's balance changes, only when they change wallets
  useEffect(() => { 
    if(account !== null && provider !== null && balance !== null) {
      (async () => {
        let _balance = await provider.getBalance(account);
        if(!_balance.eq(balance)) {
          setBalance(_balance);
        }
      })();
    }
  }, [account]);
  
  // check if the user's balance changes over time
  useEffect(() => {
    const interval = setInterval(async () => {
      if(account !== null && provider !== null && balance !== null) {
        let _balance = await provider.getBalance(account);
        if(!_balance.eq(balance)) {
          setBalance(_balance);
        }
      }
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    (async() => {
      if(provider !== null) {
        await provider.ready;

        let network = await provider.getNetwork();
        setChainId(network.chainId);

        let signer = provider.getSigner();
        let _account = await signer.getAddress();
        setAccount(_account);

        let _balance = await provider.getBalance(_account);
        setBalance(_balance);
  
        // recommended refresh for ethers.js
        // https://docs.ethers.io/v5/concepts/best-practices/
        provider.on("network", (newNetwork, oldNetwork) => {
          if (oldNetwork) {
            window.location.reload();
          }
        });
      }
    })();
  }, [provider]);

  const ready = (
    provider !== null &&
    account !== null &&
    balance !== null &&
    chainId !== null
  );

  return (
    <EthersModalContext.Provider value={{
      provider,
      ready,
      chainId,
      account,
      balance,
      connect: async () => {
        try {
          let provider = await web3Modal.connect();
          setProvider(new ethers.providers.Web3Provider(provider, "any"));
        } catch(e) {
          if(!e.toString().match(/User closed/)) {
            console.error(e);
          }
        }
      },
      disconnect: () => {
        provider.removeAllListeners();
        setProvider(null);
      },
      switchNetwork: async (chainId) => {
        let chainIdHex = typeof chainId === 'string' ? chainId : '0x' + chainId.toString(16);
        provider.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{
            chainId: chainIdHex,
          }],
        });
      },
    }}>
      {children}
    </EthersModalContext.Provider>
  );
}

export function useEthersModal() {
  return useContext(EthersModalContext);
}
