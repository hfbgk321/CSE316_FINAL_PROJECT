
import {Modal,Button,Form} from 'react-bootstrap';




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