import react,{useState,useEffect} from 'react';
import {Button,Container,Row,Col} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import {RegionalInfo} from './RegionalInfo/RegionalInfo';
import {RegionalLandmarks} from './RegionalLandmarks/RegionalLandmarks';
import {useQuery,useMutation} from '@apollo/client';
import {GET_REGION_BY_ID,GET_SUBREGION_BY_ID,GET_MAP_BY_ID,GET_PREVIOUS_PATHS} from '../../cache/queries';
import {BiUndo,BiRedo} from 'react-icons/bi';
import {BsArrow90DegLeft,BsArrow90DegRight} from 'react-icons/bs';
import { BallBeat,LineScalePulseOutRapid } from 'react-pure-loaders';
import {FaArrowLeft,FaArrowRight} from 'react-icons/fa';
import './RegionViewerMain.css';


export const RegionViewerMain = (props) => {
  const {region_id} = useParams();
  console.log(region_id);
  const [region,setRegion] = useState({});
  const [sibling,setSiblings] = useState([]);
  const [isInit,setIsInit] = useState(false);
  const [isMap,setIsMap] = useState(false);
  const [parentId,setParentId] = useState("");
  const [parentRegion,setParentRegion] = useState({});
  const [mapId,setMapId] = useState("");
  const [previousSibling,setPreviousSibling] = useState("");
  const [nextSibling,setNextSibling] = useState("");
  const [hasUndo,setHasUndo] = useState(false);
  const [hasRedo,setHasRedo] = useState(false);
  const [previousPaths,setPreviousPaths] = useState([]);

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
        }else{
          setIsMap(false);
        }
        setParentId(getRegionById.parent_id);
        setMapId(getRegionById.map);
      }
      setIsInit(true);
    }else{
      setIsInit(false);
    }
  },[region_data,region,parentId]);

  

  const {loading:subregions_loading, error:subregions_error,data:subregions_data,refetch:subregions_refetch} = useQuery(GET_SUBREGION_BY_ID,{
    variables:{
      parent_id:region.parent_id
    },
    skip: region.parent_id === undefined
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
        setSiblings(getRegionsByParentId);
        handleSetSiblingNavigation(getRegionsByParentId);
      }
    }
  },[subregions_data,sibling]);


  const handleSetSiblingNavigation = (sibling_arr) =>{
    if(sibling_arr.length == 1){
      setPreviousSibling(undefined);
      setNextSibling(undefined);
      return;
    }

    for(let x = 0; x< sibling_arr.length;x++){
      if(sibling_arr[x]._id === region_id){
        if(x == 0){
          setPreviousSibling(undefined);
          setNextSibling(sibling_arr[x+1]._id);
        }else if(x == sibling_arr.length-1){
          setPreviousSibling(sibling_arr[x-1]._id);
          setNextSibling(undefined);
        }else{
          setPreviousSibling(sibling_arr[x-1]._id);
          setNextSibling(sibling_arr[x+1]._id);
        }
      }
    }
  }


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


  const {loading:previous_paths_loading,error:previous_paths_error,data:previous_paths_data,refetch:previous_paths_refetch} = useQuery(GET_PREVIOUS_PATHS,{variables:{
    _id: region_id
  }})

  useEffect(()=>{
    if(previous_paths_loading){
      console.log(previous_paths_loading);
    }

    if(previous_paths_error){
      console.log(previous_paths_error.message);
      return previous_paths_error.message;
    }

    if(previous_paths_data){
      let {getRegionPaths} = previous_paths_data;
      if(getRegionPaths!==null){
        props.handleSetPaths(getRegionPaths);
        setPreviousPaths(getRegionPaths);
      }
    }
  },[previous_paths_data]);

  const handleSiblingNavigation = (direction) =>{
    if(direction === "prev"&& previousSibling !== undefined){
      window.location = `/your_maps/${previousSibling}/region/viewer`;
    }else if(direction === "next" && nextSibling!==undefined){
      window.location = `/your_maps/${nextSibling}/region/viewer`;
    }
  }

  const tpsUndo =async () =>{
      console.log("attempting undo...")
      if(props.tps.hasTransactionToUndo()){
        console.log("undo");
        await props.tps.undoTransaction();
        await region_refetch();
        await subregions_refetch();
        await parentRegion_refetch();
        await previous_paths_refetch();
        setHasUndo(props.tps.hasTransactionToUndo());
        setHasRedo(props.tps.hasTransactionToRedo());
      }

  }

  const tpsRedo = async() =>{
    if(props.tps.hasTransactionToRedo()){
      console.log("redo");
      await props.tps.doTransaction();
      await region_refetch();
      await subregions_refetch();
      await parentRegion_refetch();
      await previous_paths_refetch();
      setHasUndo(props.tps.hasTransactionToUndo());
      setHasRedo(props.tps.hasTransactionToRedo());
    }
  }


  

  if(region_loading || subregions_loading || parentRegion_loading || previous_paths_loading){
    return <div style={{position:"relative",left:700,top:300}}><LineScalePulseOutRapid color={'#123abc'} loading={true}/></div>
  }

  return (
    <Container>
      <Row>
        <Col sm ={3}>
          <BiUndo size = {50}  className ={hasUndo? "undo_redo_button": "undo_redo_button_disabled"} onClick={tpsUndo}/>
        </Col>
        <Col sm ={3}>
          <BiRedo size = {50} className ={hasRedo? "undo_redo_button": "undo_redo_button_disabled"} onClick ={tpsRedo} />
        </Col>
        <Col sm ={3}>
          <FaArrowLeft size = {40} className ={previousSibling === undefined ? "prev_sibling_arrow_disabled" : "prev_sibling_arrow"} onClick ={()=>{
            handleSiblingNavigation("prev");
          }}/>
        </Col>
        <Col sm ={3}>
        <FaArrowRight size = {40} className ={nextSibling === undefined ? "prev_sibling_arrow_disabled" : "prev_sibling_arrow"} onClick ={() =>{
           handleSiblingNavigation("next");
        }}/>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <RegionalInfo isInit ={isInit} region ={region} region_refetch ={region_refetch} subregions_refetch ={subregions_refetch} region_id ={region_id} parentRegion ={parentRegion} isMap ={isMap} history ={props.history} parentRegion_refetch ={parentRegion_refetch} previous_paths_refetch ={previous_paths_refetch} map_id ={mapId} tpsRedo ={tpsRedo} tpsUndo ={tpsUndo} tps = {props.tps} previousPaths ={previousPaths}/>
        </Col>
        <Col>
          <RegionalLandmarks region = {region} isInit ={isInit} siblings ={sibling} region_refetch ={region_refetch} subregions_refetch ={subregions_refetch} region_id ={region_id} map_id ={mapId} tpsRedo ={tpsRedo} tpsUndo ={tpsUndo} tps = {props.tps}/>
        </Col>
      </Row>
    </Container>
    
  )
}
