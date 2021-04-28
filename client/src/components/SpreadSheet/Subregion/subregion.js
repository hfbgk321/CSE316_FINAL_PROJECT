import react,{useState,useEffect} from 'react';
import { useDebugValue } from 'react';
import {Button,Row,Col,Form} from 'react-bootstrap';
import {Link,useParams} from 'react-router-dom';
import {DeleteRegion} from '../../Modals/DeleteRegion/DeleteRegion';
export const Subregion = (props) =>{

  const [editName,toggleEditName] = useState(false);
  const [editCapital, toggleEditCapital] = useState(false);
  const [editLeader,toggleEditLeader] = useState(false);
  const [editFlag,toggleEditFlag] = useState(false);
  const [showDeleteRegion,toggleDeleteRegion] = useState(false);

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
      children:props.children
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
    let path = manipulateUrl();
    window.location = `${path}/viewer`;
  }


  return (
    <>
    <tr id = {props._id}>
      <td>
        <Row>
          <Col><Button variant ="danger" onClick ={setShowDeleteRegion}>Delete</Button></Col>
          <Col><Button variant = "secondary" onClick ={handleNavigate}>Navigate To Me</Button></Col>
        </Row>
        
        
      </td>
      {
        !editName ? <td onClick = {() =>{toggleEditName(!editName)}}>{props.name}</td> : (
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

      {
        !editFlag ? <td onClick = {() =>{toggleEditFlag(!editFlag)}}>{props.flag}</td> : (
          <td>
            <Form>
            <Form.Control type="text" placeholder="Enter your new flag" onBlur ={handleEditFlag} autoFocus={true} name = "flag"/>
          </Form>
          </td>
          
        )
      }

      <td onClick ={handleClickLandmarks}>{props.landmarks[0]+","+props.landmarks[1]+" ....."}</td>
  </tr>
  {showDeleteRegion && <DeleteRegion setShowDeleteRegion ={setShowDeleteRegion} showDeleteRegion ={showDeleteRegion} handleDeleteSubregion ={handleDeleteSubregion} />}
  </>
  )
}