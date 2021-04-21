import react,{useState} from 'react';
import {Navbar} from '../Navbar/Navbar';
import globeImg from '../../images/globe.jpg';
import {Container,Row,Col} from 'react-bootstrap';
import context from 'react-bootstrap/esm/AccordionContext';
import "./WelcomeScreen.css";

const WelcomeScreen =(props) =>{
  return (
    <Container fluid className ="welcome_screen_container">
      <Row className="justify-content-md-center data_mapper_image_row">
        <Col md ="auto"><img src={globeImg} alt="globe" className ="globe_img"/></Col>
      </Row>
      <Row className="justify-content-md-center data_mapper_introduction_row">
          <Col md ="auto"><h1>Welcome To The World Data Mapper</h1></Col>
      </Row>
      
    </Container>
  )
}

export default WelcomeScreen;