import react,{useState,useEffect,useRef} from 'react';
import {Button,Container,Row,Col,Form,Alert,ListGroup} from 'react-bootstrap';
import {useParams} from 'react-router-dom';

import {ClickedRegion} from '../ClickedRegion/ClickedRegion';
import {useQuery,useMutation} from '@apollo/client';
import {ADD_LANDMARK_TO_REGION,CHANGE_LANDMARK_AT_POS,DELETE_LANDMARK_FROM_REGION} from '../../../cache/mutations';
import "./RegionLandmarks.css";
import {DOES_LANDMARK_EXIST} from '../../../cache/queries';

import {UpdateLandmarks_Transaction,EditLandmarks_Transaction} from '../../../utils/jsTPS';



export const RegionalLandmarks = (props) =>{

  const [AddLandmarkToRegion] = useMutation(ADD_LANDMARK_TO_REGION);
  const [ChangeLandmarkAtPos] = useMutation(CHANGE_LANDMARK_AT_POS);
  const [DeleteLandmarkFromRegion] = useMutation(DELETE_LANDMARK_FROM_REGION);
  const [landmark,setLandmark] = useState("");
  const [showError,setShowError] = useState(false);
  const [showSuccess,setShowSuccess] = useState(false);

  const formRef = useRef();



  const changeLandmark = (e) =>{
    setLandmark(e.target.value);
  }

  //for changing name of landmark
//_id:$_id,new_landmark:$new_landmark,pos:$pos

  const handleChangeLandmark = async (_id,new_landmark,old_landmark,pos) =>{
    let transaction = new UpdateLandmarks_Transaction(_id,old_landmark, new_landmark,pos,ChangeLandmarkAtPos);
    await props.tps.addTransaction(transaction);
    await props.tpsRedo();
  }

  //_id,pos,opcode,landmark,delfunction,addfunction
  const handleAddDeleteLandmark = async (_id,pos,opcode,landmark) =>{
    if(opcode == 1){
      let transaction = new EditLandmarks_Transaction(_id,pos,opcode,landmark,DeleteLandmarkFromRegion,AddLandmarkToRegion);
        await props.tps.addTransaction(transaction);
        await props.tpsRedo();
        await props.landmarks_refetch();
        await props.children_refetch();
        return;
    }
    console.log(props.landmarks);
    if(props.landmarks.includes(landmark)){
      setShowError(true);
      setShowSuccess(false);
      setLandmark("");
    }else{
      let transaction = new EditLandmarks_Transaction(_id,pos,opcode,landmark,DeleteLandmarkFromRegion,AddLandmarkToRegion);
        await props.tps.addTransaction(transaction);
        await props.tpsRedo();
        setShowSuccess(true);
        setShowError(false);
        setLandmark("");
        await props.landmarks_refetch();
        await props.children_refetch();
    }
    formRef.current.reset();
  }


  if(!props.isInit){
    return "";
  }
  return (
    <Container className = "regional_landmarks_container">
      <Row>
        <Col>
        <ListGroup as ="ul" className ="region_landmarks_list">
          {
            props.region.landmarks.map((landmark,key)=>{
              return <ClickedRegion landmarks ={props.landmarks} landmark ={landmark} key = {key} _id ={props.region._id} ownerId ={props.region.ownerId} pos ={key} handleChangeLandmark ={handleChangeLandmark} tpsRedo ={props.tpsRedo} tpsUndo ={props.tpsUndo} handleAddDeleteLandmark={handleAddDeleteLandmark} landmarks_refetch ={props.landmarks_refetch} children_refetch ={props.children_refetch} />
            })
          }
          {
            props.children.map((child,key)=>{
              return <>
                {child.landmarks.map((landmark,key)=>{
                  return  <ListGroup.Item as ="li" key ={key}>{landmark}</ListGroup.Item>
                })}
              </>
              
            })
          }
       
              {/* {props.sibling.map((sibling,key) =>{
                return <>
                    {sibling._id === props.region._id ? sibling.landmarks.map((landmark,key)=>{
                      return <ClickedRegion landmarks ={props.landmarks} landmark ={landmark} key = {key} _id ={sibling._id} ownerId ={sibling.ownerId} pos ={key} handleChangeLandmark ={handleChangeLandmark} tpsRedo ={props.tpsRedo} tpsUndo ={props.tpsUndo} handleAddDeleteLandmark={handleAddDeleteLandmark} landmarks_refetch ={props.landmarks_refetch} />
                    }): sibling.landmarks.map((landmark,key)=>{
                      return <ListGroup.Item as ="li" key ={key}>{landmark}</ListGroup.Item>
                    }) }
                    </>
              })} */}
              

        </ListGroup>
         
        </Col>
      </Row>
      <Row className ="add_landmark">
        <Col>
        <Form ref ={formRef}>
          <Form.Control type="text" placeholder="Enter your new landmark name" onChange ={changeLandmark}  name = "name"/>
        </Form>
        </Col>
        <Col>
        <Button variant = "primary" onClick ={async () => await handleAddDeleteLandmark(props.region_id,props.region.landmarks.length,0,landmark)}>Add New Landmark</Button>
        </Col>
      </Row>
      <Row>
      {
      showError && <Alert show ={true} variant="warning" className ="warning_stuff"><p>
      Unable To Add New Landmark. A landmark with this name already exists
    </p><div className="d-flex justify-content-end">
      <Button onClick = {() => setShowError(false)} variant="outline-warning">
        Close me y'all!
      </Button>
    </div></Alert>
    }

    {
      showSuccess && <Alert show ={true} variant="success" className ="warning_stuff"><p>
      Successfully Added landmark
    </p><div className="d-flex justify-content-end">
      <Button onClick = {() => setShowSuccess(false)} variant="outline-success">
        Close me y'all!
      </Button>
    </div></Alert>
    }
      </Row>
    </Container>
  )
}