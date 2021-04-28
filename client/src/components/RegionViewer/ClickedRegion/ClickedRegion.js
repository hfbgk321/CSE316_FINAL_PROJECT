import react,{useState,useEffect} from 'react';
import {Button,Container,Row,Col} from 'react-bootstrap';
import {Form} from 'react-bootstrap';


export const ClickedRegion = (props) =>{
  const [editLandmark,setEditLandmark] = useState(false);
  const handleClick = () =>{
    setEditLandmark(!editLandmark);
  }

  const handleBlur = async (e) =>{
    await props.handleChangeLandmark(props._id,e.target.value,props.landmark,props.pos);
    handleClick();
  }

  return (
    <>
     {
      !editLandmark ? <h1 onClick ={handleClick} style ={{color:"blue"}}>
      {props.landmark} </h1> : 
      <Form>
      <Form.Control type="text" placeholder="Enter your new landmark name" onBlur ={handleBlur} autoFocus={true} name = "name"/>
    </Form>
    }
    </>
   
    
  )
}