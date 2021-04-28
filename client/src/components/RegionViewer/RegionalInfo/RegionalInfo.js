import react,{useState,useEffect} from 'react';
import {Button,Container,Row,Col,Image} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import globe from '../../../images/globe.jpg'

export const RegionalInfo = (props) =>{
  debugger;
  if(!props.isInit) {
    return "";
  }
  return (
    <Container>
      <Row>
        <Image src ={globe} fluid/>
      </Row>
      <Row>
        <Col>
          <h3>Region Name: {props.region.name}</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Parent Region: {props.parentRegion.name}</h3>
        </Col>
      </Row>
    
      <Row>
          <Col>
          <h3>Region Capital: {props.region.capital}</h3>
          </Col>   
      </Row>
      <Row>
        <Col>
          <h3>Region Leader: {props.region.leader}</h3>
        </Col>
      </Row>
      <Row>
        <Col>
        <h3># Of Sub Regions: {props.region.children.length}</h3>
        </Col>
      </Row>
    </Container>
  )
}