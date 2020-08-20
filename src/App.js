import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { RelayProvider } from '@opengsn/gsn';
import CaptureTheFlagABI from './CaptureTheFlag.json';

const CONTRACT_ADDRESSES = {
  "0x3": { // Ropsten
    RELAY_HUB_ADDRESS: '0xF0851c3333a9Ba0D61472de4C0548F1160F95f17',
    FORWARDER_ADDRESS: '0x766400B526fB5889AE6C52b369671F5eE137880b',
    STAKE_MANAGER_ADDRESS: '0x82b22404fC614f1036FaA9787610aeDd38d365ae',
    PAYMASTER_ADDRESS: '0x4aa21CdEba9dfEC2C2621b83a15262a41C67aC67',
    CAPTURE_THE_FLAG_ADDRESS: '0x27a99ea967b026276953ac7cCeaA842F99dED8ab'
  },
  "0x2a": { // Kovan
    RELAY_HUB_ADDRESS: '0xcfcb6017e8ac4a063504b9d31b4AbD618565a276',
    FORWARDER_ADDRESS: '0x663946D7Ea17FEd07BF1420559F9FB73d85B5B03',
    STAKE_MANAGER_ADDRESS: '0x11fc12345f592F6757bBb046FA0C04Cc87f660B9',
    PAYMASTER_ADDRESS: '0x9940c8e12Ca14Fe4f82646D6d00030f4fC3C7ad1',
    CAPTURE_THE_FLAG_ADDRESS: '0x87cCc0c9B954e1E3d390fb25BAdD28a888264A32'
  }
};

const { ethereum } = window;
const rootProvider = ethereum;

const gsnConfig = {
  relayHubAddress: CONTRACT_ADDRESSES[ethereum.chainId].RELAY_HUB_ADDRESS,
  stakeManagerAddress: CONTRACT_ADDRESSES[ethereum.chainId].STAKE_MANAGER_ADDRESS,
  paymasterAddress: CONTRACT_ADDRESSES[ethereum.chainId].PAYMASTER_ADDRESS,
  verbose: true
};

const relayProvider = new RelayProvider(rootProvider, gsnConfig);
const web3 = new Web3(relayProvider);

const App = () => {
  const [flagHolder, setFlagHolder] = useState();

  useEffect(() => {
    const load = async () => {
      try {
        const contract = new web3.eth.Contract(
          CaptureTheFlagABI,
          CONTRACT_ADDRESSES[ethereum.chainId].CAPTURE_THE_FLAG_ADDRESS
        );
        setFlagHolder(await contract.methods.flagHolder().call());
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const onCaptureTheFlag = async (useGSN) => {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const web3CaptureTheFlagContract = new web3.eth.Contract(
        CaptureTheFlagABI,
        CONTRACT_ADDRESSES[ethereum.chainId].CAPTURE_THE_FLAG_ADDRESS
      );
      console.log(await web3CaptureTheFlagContract.methods.captureFlag().send({
        from: accounts[0],
        useGSN
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div>
        <pre>{`Flag Holder = ${flagHolder}`}</pre>
      </div>
      <button type="button" onClick={() => onCaptureTheFlag(false)}>Capture The Flag</button>
      <button type="button" onClick={() => onCaptureTheFlag()}>Capture The Flag (GSN)</button>
    </div>
  );
}

export default App;
