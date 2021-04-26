import react,{useState} from 'react';
import {Modal,Button,Form} from 'react-bootstrap';
import {CREATE_MAP} from '../../../cache/mutations';
import {useMutation,useQuery} from '@apollo/client';
import {DELETE_SUBREGION} from '../../../cache/mutations';



export const DeleteRegion = (props) =>{
  
  return (
    <Modal centered show={props.showDeleteRegion} onHide={() =>props.setShowDeleteRegion(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Region</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are You Sure You Want To Delete This Region ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() =>props.setShowDeleteRegion(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={props.handleDeleteSubregion}>
            Delete Region
          </Button>
        </Modal.Footer>
      </Modal>
  )

}