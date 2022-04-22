import React from 'react'
import ethers from 'ethers';
import { useState, useEffect} from 'react'
import { Button, Card,Row, Col,Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'



const Home = ({account, eventContract}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate= useNavigate();

  const itemSelected = (item) =>{
    // navigate("/item/itemId", {state: {item_data:item}});
  }
//  function on call will load all listed nfts
  const loadEvents = async() => {
    const items_ = await eventContract.getEvents();
    console.log(items_)
    const items = await Promise.all(items_.map(async (i)=>{
      const uri = i;
      const meta = await axios.get(uri);
      // let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item = {
          // price: price,
          name: meta.data.name,
          description: meta.data.description,
          image: meta.data.image
      }
      return item;
    }))
    setItems(items);
    setLoading(false);
  }

  const buyItem = async(item)=> {
    // console.log(ethers.utils.parseEther(item.price))
    // await (await marketplace.buyMarketItem(item.itemId, {value: ethers.utils.parseEther(item.price)})).wait();
    // loadMarketItems();

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
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    {item.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <div className='d-grid'>
                    <Button onClick={() => buyItem(item)} variant="primary" size="lg">
                      Buy for {(item.price)} ETH
                    </Button>
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

export default Home
