import {ethers} from "ethers";
import { useState, useEffect} from 'react'
import { Button, Card,Row, Col,Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const MyPurchases = ({eventContract}) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate= useNavigate();
  
    const itemSelected = (item) =>{
       navigate("/event", {state: {item_data:item}});
    }
  //  function on call will load all listed nfts
    const loadEvents = async() => {
      const items_ = await eventContract.getMyEvents();
      const items = await Promise.all(items_.map(async (i)=>{
        const meta = await axios.get(i.uri);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        // let ticketsAvailable = parseInt(ethers.utils.formatUnits(i.ticketsAvailable.toString()));  returns error data
        let ticketsAvailable = i.ticketsAvailable.toNumber();
        let item = {
            id: i.id,
            name: meta.data.name,
            description: meta.data.description,
            image: meta.data.image,
            price: price,
            ticketsAvailable: ticketsAvailable,
            organizer: i.organizer
        }
        return item;
      }))
      setItems(items);
      setLoading(false);
    }
  
    useEffect(()=>{
      loadEvents();
    },[])
  
    if (loading) return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
            <Spinner animation="border" style={{diplay:'flex'}}/>
        </div>
    )


  return (
    <div className='flex justify-center'>
    {console.log(`items array length in return: ${items.length}`)}
   {items.length > 0 ?
     <div className="px-5 container">
       <Row xs={1} md={2} lg={4} className="g-4 py-5">
         {items.map((item, idx) => (
           <Col key={idx} className="overflow-hidden">
             <Card>
               <Card.Img variant="top" onClick ={()=>itemSelected(item)} src={item.image}/>
               <Card.Body color="secondary">
                 <Card.Title>{item.name.slice(0,20)}</Card.Title>
                 <Card.Text>
                   {item.description.slice(0,30)}
                 </Card.Text>
               </Card.Body>
               <Card.Footer>
                 <div className='d-grid'>
                     <b>Ticket Purchased</b>
                 </div>
               </Card.Footer>
             </Card>
           </Col>
         ))}
       </Row>
     </div>
     : (
       <main style={{ padding: "1rem 0" }}>
         <h2>No listed assets</h2>
       </main>
     )}
   </div>
  )
}

export default MyPurchases
