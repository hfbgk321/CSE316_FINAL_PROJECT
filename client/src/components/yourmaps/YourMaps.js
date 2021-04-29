import react,{useState,useEffect} from 'react';
import { Redirect } from 'react-router';
import {Container,Button,Row,Col,ListGroup} from 'react-bootstrap';
import globe from '../../images/globe.jpg';
import "./YourMaps.css";
import * as queries from '../../cache/queries';
import {useQuery,useMutation} from '@apollo/client';
import {DELETE_MAP,UPDATE_MAP_NAME} from '../../cache/mutations';
import {CreateMap} from '../Modals/CreateMap/CreateMap';

import {MapItem} from '../yourmaps/MapItem/MapItem';

import {EditItem_Transaction} from '../../utils/jsTPS';

export const YourMaps =(props) =>{
  const [showCreateMap,toggleShowCreateMap] = useState(false);
  const [isInit,setIsInit] = useState(false);
  const [maps,setMaps] = useState([]);
  const {loading, error, data, refetch} = useQuery(queries.GET_ALL_MAPS);
  const [DeleteMap] = useMutation(DELETE_MAP);
  const [UpdateMapName] = useMutation(UPDATE_MAP_NAME);

  useEffect(() =>{
    // debugger;
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
  },[data,maps]);

  const setShowCreateMap =()=>{
    toggleShowCreateMap(!showCreateMap);
  }

  const handleDeleteMap = async (_id) =>{
    let {loading, errors,data} = await DeleteMap({variables:{_id:_id}});
    if(loading) console.log(loading);
    if(errors){
      console.log(errors.message);
      return;
    }

    if(data){
      let {deleteMap} = data;
      if(deleteMap){
        await refetch();
        
      }
    }
  }

  const handleChangeMapName = async (_id, name) => {
    let {loading, errors,data} = await UpdateMapName({variables:{
      _id:_id,
      name:name
    }});

    if(loading) console.log(loading);
    if(errors){
      console.log(errors.message);
      return;
    }

    if(data){
      let {updateMapName} = data;
      if(updateMapName){
        await refetch();
      }
    }
  }



  return (
    <Container>
      <CreateMap showCreateMap ={showCreateMap} setShowCreateMap ={setShowCreateMap} fetchMaps ={refetch} history ={props.history}/>
      <Row className ="justify-content-center d-flex align-items-center your_maps_container">
        <Col>
        <ListGroup variant="flush" className ="map_list_group">
            {maps.map((map,key)=>{
              return (
               <MapItem key ={key} map = {map} handleDeleteMap = {handleDeleteMap} fetchMaps ={refetch} handleChangeMapName ={handleChangeMapName} _id ={map._id}/>
              )
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

