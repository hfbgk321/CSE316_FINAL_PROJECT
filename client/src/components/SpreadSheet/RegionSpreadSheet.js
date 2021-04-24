import react,{useState,useEffect} from 'react';
import {Table,Container,Row,Col,Button} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import {useQuery,useMutation} from "@apollo/client";
import * as queries from '../../cache/queries';
import {ADD_NEW_REGION,ADD_NEW_REGION_TO_MAP} from '../../cache/mutations';
import {Subregion} from './Subregion/subregion';
import { set } from 'mongoose';

export const RegionSpreadSheet =(props)=>{
  let {map_id,region_id} = useParams();
  const [parent_id,setParentId] = useState(region_id === undefined ? map_id : region_id);
  const [isMap,setIsMap] = useState(region_id === undefined ? true : false);
  console.log(parent_id);
  const [mapInfo,setMapInfo] = useState({});
  const [subregions,setSubregions] = useState([]);
  const [input,setInput] = useState({
    	_id: "",
    name: "None",
    capital: "None",
    leader:"None",
    flag: "None",
    landmarks: [],
    parent_id: parent_id,
    isParentAMap: region_id === undefined ? true : false
  });

  const [isInit,setIsInit] = useState(false);
  const {loading:subregion_loading,error:subregion_error,data:subregion_data,refetch:subregion_refetch} = useQuery(queries.GET_SUBREGION_BY_ID ,{
    variables:{parent_id:parent_id}
  });

  const {loading:current_map_loading, error:current_map_error,data:current_map_data} = useQuery(isMap ? queries.GET_MAP_BY_ID : queries.GET_REGION_BY_ID,{
    variables:{
      _id: parent_id
    }
  })


  const [AddSubregion] = useMutation(ADD_NEW_REGION);
  const [AddSubregionToMap] = useMutation(ADD_NEW_REGION_TO_MAP);

  useEffect(()=>{
    if(subregion_loading) console.log(subregion_loading);
    if(subregion_error) console.log(subregion_error);
    if(subregion_data){
      let {getRegionsByParentId} = subregion_data;
      if(getRegionsByParentId!==null){
        setSubregions(getRegionsByParentId);
      }
      setIsInit(true);
    }else{
      setIsInit(false);
    }
  },[subregion_data]);

  useEffect(() =>{
    if(current_map_loading) console.log(current_map_loading);
    if(current_map_error) console.log(current_map_error);
    if(current_map_data){
      let tobesaved = {};
      if(isMap){
        let {getMapById} = current_map_data;
        if(getMapById!==null){
          tobesaved = getMapById;
        }
      }else{
        let {getRegionById} = current_map_data;
        if(getRegionById!==null){
          tobesaved = getRegionById;
        }
      }
      setMapInfo(tobesaved);
    }
  },[current_map_data]);


  const handleAddNewRegion =async ()=>{
    let return_info;
    
    if(isMap){
      return_info = await AddSubregionToMap({variables:{subregion:{...input}}});
    }else{
      return_info = await AddSubregion({variables:{subregion:{...input}}});
    }
    const {loading:adding_region_loading,error:adding_region_error,data:adding_region_data} = return_info;

    if (adding_region_error) { 
			console.log(adding_region_error.message);
			return `Error: ${adding_region_error.message}` 
		};

		if (adding_region_data) {
			await subregion_refetch();
		};
  }


  return (
    <Container fluid className = "spreadsheet_container">
      <Row className ="button_row">
          <Col sm ={1}><Button variant="primary" onClick ={handleAddNewRegion}>Add Region</Button>{' '}</Col>
          <Col sm ={1}><Button variant="secondary">Undo</Button>{' '}</Col>
          <Col sm ={1}><Button variant="secondary">Redo</Button>{' '}</Col>
          <Col sm ={9}><h3>Region Name: {mapInfo.name}</h3></Col>
      </Row>
        <Row className="table_row">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Capital</th>
              <th>Leader</th>
              <th>Flag</th>
              <th>Landmarks</th>
            </tr>
          </thead>
          <tbody>
            {subregions.map((subregion,key)=>{
              return(
                <Subregion _id ={subregion._id} name ={subregion.name} leader ={subregion.leader} flag ={subregion.flag} landmarks ={subregion.landmarks} parent_id ={parent_id} capital = {subregion.capital} history = {props.history}/>
              )
            })}
            
          </tbody>
        </Table>
        </Row>
        
    </Container>
   
  )

}