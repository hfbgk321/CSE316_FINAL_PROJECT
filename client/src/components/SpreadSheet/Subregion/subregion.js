import {useState,useEffect} from 'react';
import {Button,Row,Col,Form,Image} from 'react-bootstrap';
import {DeleteRegion} from '../../Modals/DeleteRegion/DeleteRegion';
import './Subregion.css';
import mclovin from '../../../images/mclovin.jpg'
import algeria from '../../../images/The World/Africa/Algeria Flag.png';
import { assertScalarType, assertSchema } from 'graphql';




export const Subregion = (props) =>{


  const [editName,toggleEditName] = useState(false);
  const [editCapital, toggleEditCapital] = useState(false);
  const [editLeader,toggleEditLeader] = useState(false);
  const [editFlag,toggleEditFlag] = useState(false);
  const [showDeleteRegion,toggleDeleteRegion] = useState(false);
  const [mapPath,setMapPath] = useState('images/The World/Africa/Algeria Flag.png');

  const getImagePath = () =>{
    let paths = props.previousPaths;
    console.log("in prop change");
    let src = "images";
    for(let x = 0; x< paths.length;x++){
      src+=`/${paths[x].name}`;
    }
    src+=`/${props.region_name}/${props.name} Flag.png`;
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
  

  let click = false;
  let timer = 0;

  const handleClick = () =>{
    timer = setTimeout(()=>{
      if(!click){
        toggleEditName(!editName);
      }
      click = false;
    },200);
  }

  const handleDoubleClick = () =>{
    clearTimeout(timer);
    click = true;
    handleNavigate();
  }

  const setShowDeleteRegion = () =>{
    toggleDeleteRegion(!showDeleteRegion);
  }

  const handleEditName = async (e) =>{
    let {name, value} = e.target;
    if(value !== props[name] && value.length >0){
      await props.updateSubregion(props._id,name,value,props[name]);
    }
    toggleEditName(false);
  }

  const handleEditCapital = async (e) =>{
    let {name, value} = e.target;
    if(value !== props[name]&& value.length >0){
      await props.updateSubregion(props._id,name,value,props[name]);
    }
    toggleEditCapital(false);
  }

  const handleEditLeader = async (e) =>{
    let {name, value} = e.target;
    if(value !== props[name]&& value.length >0){
      await props.updateSubregion(props._id,name,value,props[name]);
    }
    toggleEditLeader(false);
  }

  const handleEditFlag = async (e) =>{
    let {name, value} = e.target;
    if(value !== props[name]&& value.length >0){
      await props.updateSubregion(props._id,name,value,props[name]);
    }
    toggleEditFlag(false);
  }

//pos,_id,region,opcode
  const handleDeleteSubregion =async () =>{
    console.log(props.isParentAMap);
    console.log(props.pos);
    let region = {
      _id: props._id,
      name: props.name,
      capital: props.capital,
      leader:props.leader,
      flag: props.flag,
      landmarks: props.landmarks,
      parent_id: props.parent_id,
      isParentAMap: props.isParentAMap,
      children:props.children,
      map:props.map
    }
    await props.AddOrDeleteSubregion(props.pos,props._id,region,0);
    toggleDeleteRegion(false);
  }

  const manipulateUrl = () =>{
    let current_path = props.history.location.pathname+"";
    //props.history.push(`${current_path}/${props._id}`);
    let path = current_path.split("/");
    if(path.length == 4){
      path[path.length-1] = props._id;
    }else{
      path.push(props._id);
    }
    
    console.log(path);
    let new_path ="/";
    for(let x = 1; x< path.length;x++){
      if(x == path.length-1){
        new_path+=path[x];
      }else{
        new_path+=(path[x]+"/");
      }
    }
    return new_path;
  }
  const handleNavigate = () =>{
    props.tps.clearAllTransactions();
    let path = manipulateUrl();
    window.location = path;
  }

  const handleClickLandmarks =() =>{
    window.location = `/your_maps/${props._id}/region/viewer`;
  }
  const handleDefaultSrc =(ev) =>{
    ev.target.src = mclovin;
  }


  return (
    <>
    <tr id = {props._id} className ={props.pos == props.focusPos ? "selected_region":"unselected_region" }>
      <td>
        <Row>
          <Col><Button variant ="danger" onClick ={setShowDeleteRegion}>Delete</Button></Col>
          <Col><Button variant = "secondary" onClick ={handleNavigate}>Navigate To Me</Button></Col>
        </Row>
        
        
      </td>
      {
        !editName ? <td onClick ={handleClick} onDoubleClick = {handleDoubleClick} >{props.name}</td> : (
          <td>
            <Form>
            <Form.Control type="text" placeholder="Enter your new name" onBlur ={handleEditName} autoFocus={true} name = "name"/>
          </Form>
          </td>
          
        )
      }

      {
        !editCapital ? <td onClick = {() =>{toggleEditCapital(!editCapital)}}>{props.capital}</td> : (
          <td>
            <Form>
              <Form.Control type="text" placeholder="Enter your new capital" onBlur ={handleEditCapital} autoFocus={true} name = "capital"/>
            </Form>
          </td>
        )
      }


      {
        !editLeader ? <td onClick = {() =>{toggleEditLeader(!editLeader)}}>{props.leader}</td> : (
          <td>
            <Form>
            <Form.Control type="text" placeholder="Enter your new leader" onBlur ={handleEditLeader} autoFocus={true} name = "leader"/>
          </Form>
          </td>
          
        )
      }

      <td>
        <img  className="flag_img" src={require(`../../../${getImagePath()}`).default}/>
      </td>

      <td onClick ={handleClickLandmarks} className ="landmark_td">{props.landmarks[0]+","+props.landmarks[1]+" ....."}</td>
  </tr>
  {showDeleteRegion && <DeleteRegion setShowDeleteRegion ={setShowDeleteRegion} showDeleteRegion ={showDeleteRegion} handleDeleteSubregion ={handleDeleteSubregion} />}
  </>
  )
}