import react,{useState,useEffect} from 'react';
import {Button,Container,Row,Col,Form} from 'react-bootstrap';
import {useParams} from 'react-router-dom';

import {ClickedRegion} from '../ClickedRegion/ClickedRegion';
import {useQuery,useMutation} from '@apollo/client';
import {ADD_LANDMARK_TO_REGION,CHANGE_LANDMARK_AT_POS,DELETE_LANDMARK_FROM_REGION} from '../../../cache/mutations';
import "./RegionLandmarks.css";

import {UpdateLandmarks_Transaction,EditLandmarks_Transaction} from '../../../utils/jsTPS';



export const RegionalLandmarks = (props) =>{

  const [AddLandmarkToRegion] = useMutation(ADD_LANDMARK_TO_REGION);
  const [ChangeLandmarkAtPos] = useMutation(CHANGE_LANDMARK_AT_POS);
  const [DeleteLandmarkFromRegion] = useMutation(DELETE_LANDMARK_FROM_REGION);
  const [landmark,setLandmark] = useState("");

  const changeLandmark = (e) =>{
    setLandmark(e.target.value);
  }

  const handleAddNewLandMark = async () =>{
    if(landmark.length > 0){
      let {loading, errors, data} = await AddLandmarkToRegion({variables:{
        _id: props.region_id,
        landmark:landmark
      }});
  
      if(loading) console.log(loading);
      if(errors){
        console.log(`Error: ${errors.message}`);
        return errors;
      }
  
      if(data){
        let {addLandmarkToRegion} = data;
        if(addLandmarkToRegion!== null){
          await props.region_refetch();
          await props.subregions_refetch();
        }
      }
    }
    
  }

  //for changing name of landmark
//_id:$_id,new_landmark:$new_landmark,pos:$pos

  const handleChangeLandmark = async (_id,new_landmark,old_landmark,pos) =>{
    let transaction = new UpdateLandmarks_Transaction(_id,old_landmark, new_landmark,pos,ChangeLandmarkAtPos);
    props.tps.addTransaction(transaction);
    await props.tpsRedo();
  }

  //_id,pos,opcode,landmark,delfunction,addfunction
  const handleAddDeleteLandmark = async (_id,pos,opcode,landmark) =>{
    let transaction = new EditLandmarks_Transaction(_id,pos,opcode,landmark,DeleteLandmarkFromRegion,AddLandmarkToRegion);
    props.tps.addTransaction(transaction);
    await props.tpsRedo();
  }


  if(!props.isInit){
    return "";
  }
  return (
    <Container className = "regional_landmarks_container">
      <Row>
        <Col>
          <ul className ="region_landmarks_list">
            <div className ="region_landmarks_inner_div">
            {props.siblings.map((sibling,key) =>{
              return (
                <li className ="regional_landmarks_list_item">
                  {sibling._id === props.region._id ? sibling.landmarks.map((landmark,key)=>{
                    return <ClickedRegion landmark ={landmark} key = {key} _id ={sibling._id} pos ={key} handleChangeLandmark ={handleChangeLandmark} tpsRedo ={props.tpsRedo} tpsUndo ={props.tpsUndo} handleAddDeleteLandmark={handleAddDeleteLandmark} />
                  }): sibling.landmarks.map((landmark,key)=>{
                    return <h1 key ={key}>{landmark}</h1>
                  }) }
                </li>
              )
            })}
            </div>
            
          </ul>
        </Col>
      </Row>
      <Row>
        <Col>
        <Form>
          <Form.Control type="text" placeholder="Enter your new landmark name" onChange ={changeLandmark}  name = "name"/>
        </Form>
        </Col>
        <Col>
        <Button variant = "primary" onClick ={async () => await handleAddDeleteLandmark(props.region_id,props.region.landmarks.length,0,landmark)}>Add New Landmark</Button>
        </Col>
      </Row>
    </Container>
  )
}