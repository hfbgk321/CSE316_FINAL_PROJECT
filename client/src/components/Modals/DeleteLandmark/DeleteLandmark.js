import react,{useState,useEffect} from 'react';
import {Modal,Button,Form} from 'react-bootstrap';


export const DeleteLandmark = (props) =>{
  return (
    <Modal centered show={props.showDeleteLandmark} onHide={() =>props.setShowDeleteLandmark(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Delete Landmark</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Are You Sure You Want To Delete This Landmark ?</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() =>props.setShowDeleteLandmark(false)}>
        Close
      </Button>
      <Button variant="danger" onClick={async () => {
        await props.handleAddDeleteLandmark(props._id,props.pos,1,props.landmark);
        props.setShowDeleteLandmark(false);
        }}>
        Delete Landmark
      </Button>
    </Modal.Footer>
  </Modal>
  )
 
}