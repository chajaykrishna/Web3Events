import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { create as ipfsHttpClient} from 'ipfs-http-client'
import { ethers } from 'ethers'
import { Form, Button, Row, Spinner } from 'react-bootstrap'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = ({eventContract}) => {

  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [mintingNFT, setMintingNFT] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(null);
  const [tickets, setTickets] = useState(null);
  const navigate= useNavigate();


  const uploadToIpfs = async (event)=>{
    event.preventDefault();
    const file = event.target.files[0];
    if(file != undefined){
      try{
        const result  = await client.add(file);
        console.log(`ipfs hash: ${result.path}`);
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`); 
      }
      catch(err){
        console.log(`error whilie uploading to ipfs: ${err}`);
      }
    }
    else{
      console.log("invalid file")
    }
  }

  const createNFT = async () => {
    if(!image || !price || !name || !description){console.log('all fields must be filled.');
    alert('all fields must be filled.');
      return}
      setMintingNFT(true);
      const result = await client.add(JSON.stringify({image, name, description}));
      console.log(result);
      mintNFT(result);
  }

  const mintNFT = async(result) => {
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
    try{
    const tokenId = await(await eventContract.createEvent(ethers.utils.parseEther(price.toString()), tickets, uri)).wait();
    setMintingNFT(false);
    console.log(tokenId);
    navigate(`/`);
    }catch(err){
      console.log(err);
      alert("Error while buying ticket, please try again");
    setMintingNFT(false);
    }
    
  }


  return (
    <div className="container-fluid mt-5">
    <div className="row">
      <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
        <div className="content mx-auto">
          <Row className="g-4">
            <Form.Control
              placeholder="Cover Image for the Event"
              type="file"
              required
              name="file"
              onChange={uploadToIpfs}
            />
            <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name of the Event" />
            <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
            <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Ticket Price in ETH" />
            <Form.Control onChange={(e) => setTickets(e.target.value)} size="lg" required type="number" placeholder="Total number of Tickets" />
            <div className="d-grid px-0">
            {
                            mintingNFT ?(
                                <Button variant="primary" disabled>
                                    <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    />
                                    Creating Event...
                                </Button>
                            )
                            :
                            (
                              <Button onClick={createNFT} variant="primary" size="lg">Create Event</Button>
                            )
                        }
            </div>
          </Row>
        </div>
      </main>
    </div>
  </div>
  )
  }
  
export default Create
