import react,{useState} from 'react';
import {ListGroup,Button,Container,Row,Col} from 'react-bootstrap';
import {DeleteMap} from '../../Modals/DeleteMap/DeleteMap';

export const MapItem = (props) =>{

  const [showDeleteMap,toggleShowDeleteMap] = useState(false);

  const setShowDeleteMap =() =>{
    toggleShowDeleteMap(!showDeleteMap);
  }
  const handleClickName = () =>{
    window.location = `/your_maps/${props.map._id}`
  }

  const handleDelete = async () =>{
    await props.handleDeleteMap(props.map._id);
    await props.fetchMaps();
  }



  return (
    <Container>
      <Row>      
        <Col>
          <ListGroup.Item className = "map_list_item" key ={props.key} onClick = {handleClickName}>{props.map.name}
          </ListGroup.Item>
        </Col>
        <Col>
          <Button variant="danger" onClick ={setShowDeleteMap}>Delete</Button>
        </Col>
      </Row>
      {setShowDeleteMap && <DeleteMap showDeleteMap ={showDeleteMap} setShowDeleteMap={setShowDeleteMap} handleDeleteMap ={handleDelete}/>}
    </Container>
  )
}