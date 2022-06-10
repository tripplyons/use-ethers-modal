import { EthersModalProvider, useEthersModal } from 'use-ethers-modal';

function Child() {
  const {
    provider, // ethers.js provider: the connected provider (with signer attached)
    ready, // boolean: whether or not the provider and other info is ready
    chainId, // number: the chain ID the connected chain
    account, // string: the address of the connected account
    balance, // BigNumber: the balance of the connected account
    connect, // function(): connect to a provider using web3modal
    disconnect, // function(): disconnect from the current provider
    switchNetwork // function(chainIdHex: string): switch to a different network
  } = useEthersModal();

  console.log(connect);

  return (
    ready ? (
      <div>
        <button onClick={disconnect}>
          Disconnect
        </button>
        <button onClick={() => switchNetwork(1)}>
          Switch Network to Mainnet
        </button>
        <div>
          Your address: {account}
        </div>
        <div>
          Your balance: {balance.toString()}
        </div>
        <div>
          Your chain ID: {chainId}
        </div>
      </div>
    ) : (
      <button onClick={connect}>
        Connect
      </button>
    )
  );
}

export default function Parent() {
  console.log('EthersModalProvider', EthersModalProvider);
  console.log('useEthersModal', useEthersModal);
  return (
    <EthersModalProvider
      settings={{
        network: 1,
        cacheProvider: true,
        theme: "dark",
        providerOptions: {
          injected: {
            display: {
              name: "Browser Extension",
              description: "Connect with the provider in your Browser"
            },
            package: null
          }
        }
      }}
    >
      <Child />
    </EthersModalProvider>
  );
}
