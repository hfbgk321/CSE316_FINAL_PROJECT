import react,{useState,useEffect} from 'react';
import { Redirect } from 'react-router';
import {Container,Button,Row,Col,ListGroup} from 'react-bootstrap';
import globe from '../../images/globe.jpg';
import "./YourMaps.css";
import * as queries from '../../cache/queries';
import {useQuery} from '@apollo/client';
import {CreateMap} from '../Modals/CreateMap/CreateMap';
export const YourMaps =(props) =>{
  const [showCreateMap,toggleShowCreateMap] = useState(false);
  const [isInit,setIsInit] = useState(false);
  const [maps,setMaps] = useState([]);
  const {loading, error, data, refetch} = useQuery(queries.GET_ALL_MAPS);

  useEffect(() =>{
    if(error) { console.log(error); }
    if(loading) { console.log(loading); }
    if(data){
      let {getAllMaps} = data;
      if(getAllMaps!==null){
        setMaps(getAllMaps);
      }
      setIsInit(true);
    }else{
      setIsInit(false);
    }
  },[data]);

  const setShowCreateMap =()=>{
    toggleShowCreateMap(!showCreateMap);
  }
  
  return (
    <Container>
      <CreateMap showCreateMap ={showCreateMap} setShowCreateMap ={setShowCreateMap} fetchMaps ={refetch}/>
      <Row className ="justify-content-center d-flex align-items-center your_maps_container">
        <Col>
        <ListGroup variant="flush" className ="map_list_group">
            {maps.map((map,key)=>{
              return <ListGroup.Item className = "map_list_item" key ={key}>{map.name}</ListGroup.Item>
            })}
        </ListGroup>
        </Col>
        <Col>
          <Row><img src ={globe} style={{height:200,width:500}}/></Row>
          <Row>
            <Button variant="secondary" size="lg" block onClick={setShowCreateMap}> Create New Map</Button>
        </Row>
        </Col>
      </Row>
    </Container>
  );
}

