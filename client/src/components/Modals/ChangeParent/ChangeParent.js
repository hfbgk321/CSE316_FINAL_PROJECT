import react, {useState} from 'react';
import {Modal,Button,Form,Col} from 'react-bootstrap';
import {useMutation} from '@apollo/client';
import {CHANGE_PARENT} from '../../../cache/mutations';


export const ChangeParent =(props) =>{
  const [selectedParent,setSelectedParent] = useState("");
  const [ChangeParent] = useMutation(CHANGE_PARENT);

  const handleUpdateParent =async () =>{
    if(selectedParent.length > 0 && selectedParent !== props.parentRegion._id){
      let {data} = await ChangeParent({
        variables:{
          _id: props.region._id,
          old_parent_id:props.region.parent_id,
          new_parent_id: selectedParent
        }
      });
  
      if(data){
        let {changeParent} = data;
        if(changeParent!== undefined){
            await props.region_refetch();
            await props.subregions_refetch();
            await props.parentRegion_refetch(); 
            await props.previous_paths_refetch();
            await props.exclude_current_refetch();
            await props.all_maps_refetch();        
        }
        
      }
    }else{
      console.log("invalid selected parent");
    }
    
  }

  const handleSelectOption = (e) =>{
    setSelectedParent(e.target.value);
    console.log("new parent_id "+selectedParent);
    console.log("old_parent_id: "+props.region.parent_id);
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