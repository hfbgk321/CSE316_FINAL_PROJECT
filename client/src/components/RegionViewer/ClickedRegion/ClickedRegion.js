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
      !editLandmark ? 
      <Row>
        <Button variant ="danger" style ={{height:40,width:"auto"}}>X</Button>
      <h3 onClick ={handleClick} style ={{color:"blue",marginBottom:20,marginLeft:10}}>
      {props.landmark} 
      </h3>
      </Row>
       : 
      <Form>
      <Form.Control type="text" placeholder="Enter your new landmark name" onBlur ={handleBlur} autoFocus={true} name = "name" className ="clicked_region_input"/>
    </Form>
    }
    </>
   
    
  )
}