// import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { useState } from 'react';
import { ethers } from "ethers";
import './App.css';

function App() {
  const { ethereum } = window
  const [balance, setBalance] = useState(0)
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  const handleBtnClick = () => {
    if (!ethereum || !ethereum.isMetaMask) {
      window.open('https://metamask.io/download/')
      return
    }

    setBalance(0)
    setUsdcBalance(0)
    setIsConnected(false)
    if (ethereum.networkVersion !== '137') {
      alert('Error: The Network is Wrong!')
      return
    }

    connect()
  }

  const connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts");
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balanceRaw = await signer.getBalance()
    setBalance(ethers.utils.formatEther(balanceRaw))

    // get USDC balance
    const USDC_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
    const abi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function balanceOf(address) view returns (uint)",
      "function transfer(address to, uint amount)",
      "event Transfer(address indexed from, address indexed to, uint amount)"
    ];

    const daiContract = new ethers.Contract(USDC_ADDRESS, abi, provider);
    const usdcBalanceRaw = await daiContract.balanceOf(address)
    setUsdcBalance(ethers.utils.formatEther(usdcBalanceRaw))

    setIsConnected(true)
  }

  return (
    // <Web3ReactProvider getLibrary={getLibrary}>
    <div className="App">
      <div className='connect-btn' onClick={handleBtnClick}>
        connect to metamask
      </div>
      {isConnected && <div className='balance'>
        <div>{balance} MATIC</div>
        <div>{usdcBalance} USDC</div>
      </div>}
    </div>
    // </Web3ReactProvider>
  )
}

export default App;
