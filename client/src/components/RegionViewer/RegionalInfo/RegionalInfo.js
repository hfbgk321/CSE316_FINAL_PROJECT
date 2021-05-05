import react,{useState,useEffect} from 'react';
import {Button,Container,Row,Col,Image} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import globe from '../../../images/globe.jpg'
import './RegionInfo.css';
import {BsPencil} from 'react-icons/bs';
import {ChangeParent} from '../../Modals/ChangeParent/ChangeParent';
import {useQuery,useMutation} from '@apollo/client';
import {GET_ALL_REGIONS_EXCEPT_CURRENT,GET_ALL_MAPS} from '../../../cache/queries';
import {CHANGE_PARENT} from '../../../cache/mutations';
import {EditParents_Transaction} from '../../../utils/jsTPS';


//previousPaths
export const RegionalInfo = (props) =>{
  const [showChangeParent,toggleChangeParent] = useState(false);
  const [potentialParentsRegions,setPotentialParentsRegions] = useState([]);
  const [potentialParentsMaps,setPotentialParentsMaps] = useState([]);
  const [ChangingParent] = useMutation(CHANGE_PARENT);

  const getImagePath = () =>{
    let paths = props.previousPaths;
    console.log("in prop change");
    let src = "images";
    for(let x = 0; x< paths.length;x++){
      src+=`/${paths[x].name}`;
    }
    src+=`/${props.region.name} Flag.png`;
    console.log(src);
    try{
      let temp = require(`../../../${src}`).default;
      console.log(temp);
      return src;
    }catch(error){
      console.log(error);
      return 'images/mclovin.jpg';
    }
  }
  getImagePath();

  console.log(props.region_id);
  const {loading:exclude_current_loading,error:exclude_current_error,data:exclude_current_data,refetch:exclude_current_refetch} = useQuery(GET_ALL_REGIONS_EXCEPT_CURRENT,{
    variables:{
      _id:props.region_id
    }
  });


  useEffect(()=>{
    if(exclude_current_loading){
      console.log(exclude_current_loading);
    }

    if(exclude_current_error){
      console.log(exclude_current_error.message);
      return exclude_current_error.message;
    }
    if(exclude_current_data){
      let {getAllRegionsExceptCurrent} = exclude_current_data;
      if(getAllRegionsExceptCurrent!==undefined){
        setPotentialParentsRegions(getAllRegionsExceptCurrent);
      }
    }
  },[exclude_current_data]);


  const {loading:all_maps_loading,error:all_maps_error,data:all_maps_data,refetch:all_maps_refetch} = useQuery(GET_ALL_MAPS);

  useEffect(() =>{
    if(all_maps_loading){
      console.log(all_maps_loading);
    }

    if(all_maps_error){
      console.log(all_maps_error.message);
      return all_maps_error.message;
    }

    if(all_maps_data){
      let {getAllMaps} = all_maps_data;
      if(getAllMaps!==undefined){
        setPotentialParentsMaps(getAllMaps);
      }
    }
  },[all_maps_data]);



  const setChangeParent = () =>{
    toggleChangeParent(!showChangeParent);
  }

  //_id, newParent,oldParent,callback

  const handleChangeParents = async (_id, newParent,oldParent) =>{
    console.log("old "+oldParent);
    console.log("new "+newParent);
    console.log("_id "+_id);
      let transaction = new EditParents_Transaction(_id,newParent,oldParent,ChangingParent);
      props.tps.addTransaction(transaction);
      await props.tpsRedo();
      await props.parentRegion_refetch();
      await props.previous_paths_refetch();
      await exclude_current_refetch();
      await all_maps_refetch();
  }

  if(!props.isInit) {
    return "";
  }
  return (
    <Container className ="viewer_container">
      <Row>
        <img src ={require(`../../../${getImagePath()}`).default} className ="viewer_img"/>
      </Row>
      <div className ="viewer_info">
      <Row>
        <Col>
          <h4>Region Name: {props.region.name}</h4>
        </Col>
      </Row>
      <Row>
        <Col md ={5}>
          <h4>Parent Region:</h4>
        </Col>
        <Col>
        <h4 className ="parent_name" onClick ={()=>{
            if(props.isMap){
              props.history.push(`/your_maps/${props.map_id}`);
              // window.location = `/your_maps/${props.map_id}`;
            }else{
              props.history.push(`/your_maps/${props.map_id}/${props.parentRegion._id}`);
              // window.location = `/your_maps/${props.map_id}/${props.parentRegion._id}`;
            }
          }}>
          {props.parentRegion.name}
        </h4>
        </Col>
        <Col>
        <BsPencil size={25} className ="pencil" onClick ={setChangeParent}/>
        </Col>
      </Row>
    
      <Row>
          <Col>
          <h4>Region Capital: {props.region.capital}</h4>
          </Col>   
      </Row>
      <Row>
        <Col>
          <h4>Region Leader: {props.region.leader}</h4>
        </Col>
      </Row>
      <Row>
        <Col>
        <h4># Of Sub Regions: {props.region.children.length}</h4>
        </Col>
      </Row>
      </div>
      <ChangeParent setChangeParent ={setChangeParent} showChangeParent ={showChangeParent} loading ={exclude_current_loading || all_maps_loading} potentialParents ={[...potentialParentsMaps,...potentialParentsRegions]} parentRegion ={props.parentRegion} history ={props.history} region = {props.region} region_refetch ={props.region_refetch} subregions_refetch ={props.subregions_refetch} parentRegion_refetch ={props.parentRegion_refetch} previous_paths_refetch ={props.previous_paths_refetch} exclude_current_refetch = {exclude_current_refetch} all_maps_refetch ={all_maps_refetch} handleChangeParents ={handleChangeParents} />
      
    </Container>
  )
}