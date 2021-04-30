import react,{useState} from 'react';
import {ListGroup,Button,Container,Row,Col,Form} from 'react-bootstrap';
import {DeleteMap} from '../../Modals/DeleteMap/DeleteMap';
import './MapItem.css';
export const MapItem = (props) =>{

  const [showDeleteMap,toggleShowDeleteMap] = useState(false);
  const [editMapName,setEditMapName] = useState(false);
  let click = false;
  let timer = 0;

  const handleClick = () =>{
    timer = setTimeout(()=>{
      if(!click){
        handleClickName();
      }
      click = false;
    },400);
  }

  const handleDoubleClick = () =>{
    clearTimeout(timer);
    click = true;
    setEditMapName(true);
  }

  const handleEditMapName = async (e) =>{
    if(e.target.value.length >0 && e.target.value !== props.map.name){
      await props.handleChangeMapName(props._id,e.target.value);
    }
    setEditMapName(false);
  }

  const setShowDeleteMap =() =>{
    toggleShowDeleteMap(!showDeleteMap);
  }
  const handleClickName = () =>{
    window.location = `/your_maps/${props.map._id}`
  }

  const handleDelete = async () =>{
    await props.handleDeleteMap(props.map._id);
    await props.fetchMaps();
    setShowDeleteMap();
  }



  return (
    <Container>
      <Row className ="align-items-center map_item_row">      
        <Col>
        {
          !editMapName ? <ListGroup.Item className = "map_list_item" key ={props.key} onDoubleClick={handleDoubleClick} onClick = {handleClick}>{props.map.name}
          </ListGroup.Item> : <Form>
            <Form.Control type="text" placeholder="Enter your new name" onBlur ={handleEditMapName} autoFocus={true} name = "name"/>
          </Form>
        }
          
        </Col>
        <Col>
          <Button variant="danger" onClick ={setShowDeleteMap}>Delete</Button>
        </Col>
      </Row>
      {setShowDeleteMap && <DeleteMap showDeleteMap ={showDeleteMap} setShowDeleteMap={setShowDeleteMap} handleDeleteMap ={handleDelete}/>}
    </Container>
  )
}