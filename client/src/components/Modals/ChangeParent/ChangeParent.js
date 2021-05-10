import react, {useState} from 'react';
import {Modal,Button,Form,Col} from 'react-bootstrap';



export const ChangeParent =(props) =>{
  const [selectedParent,setSelectedParent] = useState("");


  const handleUpdateParent =async () =>{
    if(selectedParent.length > 0 && selectedParent !== props.parentRegion._id){
      await props.handleChangeParents(props.region._id,selectedParent,props.region.parent_id);
      props.setChangeParent();
    }else{
      console.log("invalid selected parent");
    }

  }

  //_id, newParent,oldParent,callback
  const handleSelectOption = (e) =>{
    setSelectedParent(e.target.value);
  }


  return (
    <Modal centered show={props.showChangeParent} onHide={() =>props.setChangeParent()}>
        <Modal.Header closeButton>
          <Modal.Title>Change Parent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            props.loading ? <div />
            : <Form>
              
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Potential Parents</Form.Label>
                <Form.Control as="select" defaultValue ={props.parentRegion._id} onChange ={handleSelectOption}>
                  {props.potentialParents.map((parent,key)=>{
                      return <option key ={key} value ={parent._id}>{parent.name}</option>
                  })}
                </Form.Control>
              </Form.Group>
              
            </Form>
        }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() =>props.setChangeParent()}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateParent}>
            Update Parent
          </Button>
        </Modal.Footer>
      </Modal>
  )
}


//region_id : 609073fd03095162e4662d8b region_name: layer_b
//old_parent: 609073f903095162e4662d89 map : map1
//new_parent: 609073fb03095162e4662d8a region_name: layer_a
//609073fb03095162e4662d8a