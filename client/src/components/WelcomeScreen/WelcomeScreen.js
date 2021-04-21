import react,{useState} from 'react';
import {Navbar} from '../Navbar/Navbar';
import globeImg from '../../images/globe.jpg';
import {Container,Row,Col} from 'react-bootstrap';

const WelcomeScreen =(props) =>{
  return (
    <>
      <Row>
          <Col><h1>This is the welcome screen</h1></Col>
      </Row>
      <Row>
        <Col><img src={globeImg} alt="globe" style={{height:500,width:700}}/></Col>
      </Row>
      
    </>
  )
}

export default WelcomeScreen;