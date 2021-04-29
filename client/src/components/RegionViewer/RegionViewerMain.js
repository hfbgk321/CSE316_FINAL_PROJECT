import react,{useState,useEffect} from 'react';
import {Button,Container,Row,Col} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import {RegionalInfo} from './RegionalInfo/RegionalInfo';
import {RegionalLandmarks} from './RegionalLandmarks/RegionalLandmarks';
import {useQuery,useMutation} from '@apollo/client';
import {GET_REGION_BY_ID,GET_SUBREGION_BY_ID,GET_MAP_BY_ID} from '../../cache/queries';



export const RegionViewerMain = (props) => {
  const {map_id,region_id} = useParams();
  const [region,setRegion] = useState({});
  const [sibling,setSiblings] = useState([]);
  const [isInit,setIsInit] = useState(false);
  const [isMap,setIsMap] = useState(false);
  const [parentId,setParentId] = useState("");
  const [parentRegion,setParentRegion] = useState({});

  const {loading:region_loading,error:region_error,data:region_data,refetch:region_refetch} = useQuery(GET_REGION_BY_ID,{variables:{_id:region_id}});

  

  useEffect(()=>{
    if(region_loading) console.log(region_loading);
    if(region_error){
      console.log(`Error: ${region_error.message}`);
      return region_error.message;
    }

    if(region_data){
      let {getRegionById} = region_data;
      if(getRegionById._id !== undefined){
        setRegion(getRegionById);
        if(getRegionById.isParentAMap){
          setIsMap(true);
          setParentId(getRegionById.parent_id);
        }
      }
      setIsInit(true);
    }else{
      setIsInit(false);
    }
  },[region_data]);

  const {loading:subregions_loading, error:subregions_error,data:subregions_data,refetch:subregions_refetch} = useQuery(GET_SUBREGION_BY_ID,{
    variables:{
      parent_id:region.parent_id
    }
  })

  useEffect(() =>{
    if(subregions_loading) console.log(subregions_loading);
    if(subregions_error) {
      console.log(`Error: ${subregions_error.message}`);
      return subregions_error.message;
    }
    if(subregions_data){
      let {getRegionsByParentId} =subregions_data;
      if(getRegionsByParentId !== null){
        setSiblings(getRegionsByParentId)
      }
    }
  },[subregions_data,sibling]);


  const {loading:parentRegion_loading, error:parentRegion_error,data:parentRegion_data,refetch:parentRegion_refetch} = useQuery(isMap ? GET_MAP_BY_ID : GET_REGION_BY_ID,{
    variables:{
      _id:region.parent_id
    }
  })

  useEffect(() =>{
    if(parentRegion_loading) console.log(parentRegion_loading);
    if(parentRegion_error){
      console.log(parentRegion_error.message);
      return parentRegion_error.message;
    }

    if(parentRegion_data){
      let info = parentRegion_data;
      if(isMap){
        let {getMapById} = info;
        if(getMapById!==null){
          setParentRegion(getMapById);
        }
      }else{
        let {getRegionById} = info;
        if(getRegionById!==null){
          setParentRegion(getRegionById);
        }
      }
    }
  },[parentRegion_data,parentRegion]);
  


  return (
    <Container>
      <Row>
        <Col>
        <Button variant = "secondary">Undo</Button>
        </Col>
        <Col>
        <Button variant = "secondary">Redo</Button>
      </Col>
      </Row>
      
      <Row>
        <Col>
          <RegionalInfo isInit ={isInit} region ={region} region_refetch ={region_refetch} subregions_refetch ={subregions_refetch} region_id ={region_id} map_id = {map_id} parentRegion ={parentRegion} isMap ={isMap}/>
        </Col>
        <Col>
          <RegionalLandmarks region = {region} isInit ={isInit} siblings ={sibling} region_refetch ={region_refetch} subregions_refetch ={subregions_refetch} region_id ={region_id} map_id = {map_id}/>
        </Col>
      </Row>
    </Container>
    
  )
}
