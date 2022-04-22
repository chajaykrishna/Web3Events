import './App.css';
import {useState, useEffect} from 'react';
import {Router, Route, Routes, BrowserRouter} from 'react-router-dom';
import { Spinner, ToastContainer, Toast } from 'react-bootstrap';
import {ethers} from "ethers";
import Navigation from './Navigation';
import event from './events.json';
import Create from './Create';
import Home from './Home';


function App() {

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [eventContract, setEvnetContract] = useState(null);
  const [toast, setToast] = useState(false);


  const walletConnect = async ()=>{
    const accounts = await window.ethereum.request({method: "eth_accounts"});
    const chainId = await window.ethereum.request({method: "eth_chainId"});
    console.log(chainId)
    if(chainId === "0x4") {
      if(accounts.length === 0) {
        console.log("No authorised accounts found");
        return
      }
      else{
        setAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        loadContracts(signer);
      }
    }
    else{
      setToast(true);
    }
    
  }

  const toastMsg = () => {
    console.log("Please connect to the mumbai testnet");
    return(
      <ToastContainer position="middle-center" className>
      <Toast>
      <Toast.Header closeButton={false}>
      <strong className="me-auto">Network Error!</strong>
      </Toast.Header>
        <Toast.Body>Change the Network to Rinkeby Testnet and refresh the page.</Toast.Body>
      </Toast>
      </ToastContainer>
    )
  }

  
  const web3Handler = async () =>{
      if(account === null){
      const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
      setAccount(accounts[0]);
      }      
     const provider = new ethers.providers.Web3Provider(window.ethereum);
     const signer = provider.getSigner();
     loadContracts(signer);
  }

  const loadContracts = async (signer) =>{
    const contract = new ethers.Contract("0x68946692447Cf545BadbE6651C1C365FdbC2fBA0", event.abi, signer);
    setEvnetContract(contract);
    setLoading(false);
  }

  useEffect(()=>{
    walletConnect();
  },[])

  return (
    <BrowserRouter>
    <div className='App'>
      <Navigation web3Handler={web3Handler} account={account}/>
      {toast ? (toastMsg()): null}
      {loading ?
      (
        <>
        { (!toast) ? (
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
          <Spinner animation="border" style={{diplay:'flex'}}/>
          <p className='mx-3 my-0'>Metamask Connection Required...</p>
            </div>
         ): null}
        </>
      )
      : (
      <Routes>
      <Route path="/" element = {<Home account={account} eventContract={eventContract}/>}/>
      <Route path="/create" element = {<Create account={account} eventContract={eventContract}/>}/>
      </Routes>
      )}
    </div>
    </BrowserRouter>
  );
}

export default App;
