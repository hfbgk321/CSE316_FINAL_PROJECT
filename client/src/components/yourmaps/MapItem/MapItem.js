import react,{useState} from 'react';
import {ListGroup,Button,Container,Row,Col} from 'react-bootstrap';

export const MapItem = (props) =>{

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
          <Button variant="danger" onClick ={handleDelete}>Delete</Button>
        </Col>
      </Row>
    </Container>
  )
}