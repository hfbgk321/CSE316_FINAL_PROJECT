import react,{useState} from 'react';
import {Modal,Button,Form} from 'react-bootstrap';
import {CREATE_MAP} from '../../../cache/mutations';
import {useMutation,useQuery} from '@apollo/client';
import {DELETE_MAP} from '../../../cache/mutations';



export const DeleteMap = (props) =>{
  
  return (
    <Modal centered show={props.showDeleteMap} onHide={() =>props.setShowDeleteMap(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Map</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are You Sure You Want To Delete This Map ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() =>props.setShowDeleteMap(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={props.handleDeleteMap}>
            Delete Map
          </Button>
        </Modal.Footer>
      </Modal>
  )

}