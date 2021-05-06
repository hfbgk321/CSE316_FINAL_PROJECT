import react,{useState,useEffect,useRef} from 'react';
import {Button,Container,Row,Col,Alert} from 'react-bootstrap';
import {Form} from 'react-bootstrap';
import {useQuery} from "@apollo/client";
import {DOES_LANDMARK_EXIST} from '../../../cache/queries';
import './ClickedRegion.css';

export const ClickedRegion = (props) =>{
  const [editLandmark,setEditLandmark] = useState(false);
  const [newLandMark,setNewLandmark] = useState(props.landmark);
  const [showError,setShowError] = useState(false);
  const [showSuccess,setShowSuccess] = useState(false);

  const editRef = useRef();
  
  const {loading,data,error,refetch} = useQuery(DOES_LANDMARK_EXIST,{
    variables:{
      _id:props._id,
      landmark:newLandMark
    }
  })

  const handleClick = () =>{
    setEditLandmark(!editLandmark);
  }

  const handleBlur = async (e) =>{
    if(props.landmark == newLandMark){
      setEditLandmark(false);
      setNewLandmark(props.landmark);
      return;
    }
    await refetch();
    if(data){
      let {doesLandmarkExist} = data;
      if(!doesLandmarkExist){
        await props.handleChangeLandmark(props._id,newLandMark,props.landmark,props.pos);
        setNewLandmark(props.landmark);
        handleClick();
        setShowSuccess(true);
        setShowError(false);
      }else{
        setNewLandmark(props.landmark);
        handleClick();
        setShowError(true);
        setShowSuccess(false);
      }
      
    }
  }

  return (
    <>
     {
      !editLandmark ? 
      <Row>
        <Button variant ="danger" style ={{height:40,width:"auto"}} onClick = {async ()=> await props.handleAddDeleteLandmark(props._id,props.pos,1,props.landmark,)}>X</Button>
      <h3 onClick ={handleClick} style ={{color:"blue",marginBottom:20,marginLeft:10}}>
      {props.landmark} 
      </h3>
      </Row>
       : 
      <Form ref ={editRef}>
      <Form.Control type="text" placeholder="Enter your new landmark name" value ={newLandMark} onBlur ={handleBlur} autoFocus={true} name = "name" className ="clicked_region_input" onChange ={(e)=>setNewLandmark(e.target.value)}/>
    </Form>
    }
    <Row>
    {
      showError && <Alert show ={true} variant="warning" className ="alert"><p>
      A landmark with this name already exists
    </p><div className="d-flex justify-content-end">
      <Button onClick = {() => setShowError(false)} variant="outline-warning">
        Close me y'all!
      </Button>
    </div></Alert>
    }

{
      showSuccess && <Alert show ={true} variant="success" className ="alert"><p>
      Successfully edited landmark
    </p><div className="d-flex justify-content-end">
      <Button onClick = {() => setShowSuccess(false)} variant="outline-success">
        Close me y'all!
      </Button>
    </div></Alert>
    }
    </Row>
    
    
    </>
   
    
  )
}