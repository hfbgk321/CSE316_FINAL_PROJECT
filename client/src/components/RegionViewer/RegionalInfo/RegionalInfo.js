import react,{useState,useEffect} from 'react';
import {Button,Container,Row,Col,Image} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import globe from '../../../images/globe.jpg'
import './RegionInfo.css';
import {BsPencil} from 'react-icons/bs';

export const RegionalInfo = (props) =>{

  if(!props.isInit) {
    return "";
  }
  return (
    <Container className ="viewer_container">
      <Row>
        <Image src ={globe} className ="viewer_img"/>
      </Row>
      <div className ="viewer_info">
      <Row>
        <Col>
          <h4>Region Name: {props.region.name}</h4>
        </Col>
      </Row>
      <Row>
        <Col md ={5}>
          <h4>Parent Region:</h4>
        </Col>
        <Col>
        <h4 className ="parent_name" onClick ={()=>{
            if(props.isMap){
              window.location = `/your_maps/${props.map_id}`;
            }else{
              window.location = `/your_maps/${props.map_id}/${props.parentRegion._id}`;
            }
          }}>
          {props.parentRegion.name}
        </h4>
        </Col>
        <Col>
        <BsPencil size={25} className ="pencil" />
        </Col>
      </Row>
    
      <Row>
          <Col>
          <h4>Region Capital: {props.region.capital}</h4>
          </Col>   
      </Row>
      <Row>
        <Col>
          <h4>Region Leader: {props.region.leader}</h4>
        </Col>
      </Row>
      <Row>
        <Col>
        <h4># Of Sub Regions: {props.region.children.length}</h4>
        </Col>
      </Row>
      </div>
      
    </Container>
  )
}