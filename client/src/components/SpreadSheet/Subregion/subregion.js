import react,{useState,useEffect} from 'react';
import {Button,Row,Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';

export const Subregion = (props) =>{

  const handleDeleteSubregion =async () =>{
    await props.handleDeleteSubregion(props._id);
  }

  const handleNavigate = () =>{
    debugger;
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
    window.location = new_path;
  }

  return (
    <tr id = {props._id}>
      <td>
        <Row>
          <Col><Button variant ="danger" onClick ={handleDeleteSubregion}>Delete</Button></Col>
          <Col><Button variant = "secondary" onClick ={handleNavigate}>Navigate To Me</Button></Col>
        </Row>
        
        
      </td>
      <td>{props.name}</td>
      <td>{props.capital}</td>
      <td>{props.leader}</td>
      <td>{props.flag}</td>
      <td>{props.landmarks[0]+","+props.landmarks[1]+" ....."}</td>
  </tr>
  )
}