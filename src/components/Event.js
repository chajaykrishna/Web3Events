import { Row, Col, Image, Button, Spinner } from 'react-bootstrap';
import {useLocation} from 'react-router-dom'
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom'
import {useState} from 'react'

const Event = ({ eventSellerContract}) => {
    const [mintingNFT, setMintingNFT] = useState(false);
    const {state} = useLocation();
    const item = state.item_data;
    const navigate = useNavigate();

    const buyTicket = async () => {
        setMintingNFT(true);
        try{
            await (await eventSellerContract.buyEventPass(item.id, {value: ethers.utils.parseEther(item.price)})).wait();
            console.log("Ticket Bought");
            navigate("/mypurchases"); 
        }
        catch(e){
            console.log(e);
            alert("Error while buying ticket, please try again");
            setMintingNFT(false);
        }
    }

  return (
    <div className='Event'>
        <div className='container '>
            <Row xs={1} md={1} lg={2} className="g-4 py-5">
               
                <Col><Image fluid src={item.image}/></Col>
                <Col className="g-4 py-5 px-5 bg-light d-flex align-items-start flex-column overflow-hidden">
                    <div className='mb-auto' >
                        <Row><h3 className='font-bold'>{state.item_data.name}</h3></Row>
                        <Row><p>{item.description}</p></Row>
                        <div><p>Organizer: <b>{item.organizer}</b></p></div>
                        <div><p>tickets available: <b>{item.ticketsAvailable}</b></p></div>
                    </div>
                    <div>
                        <div className='py-3'><p className='d-inline'>price in ETH: </p><h4 className='font-bold d-inline'>{item.price}</h4></div>
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
                                    Buying Ticket...
                                </Button>
                            )
                            :
                            (
                                <div><Button onClick={()=>buyTicket()} size="lg">Buy Ticket</Button></div>
                            )
                        }
                    </div>
                    
                </Col>
            </Row>
        </div>
      
    </div>
  )
}

export default Event
