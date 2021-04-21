import react,{useState,useEffect} from 'react';
import './navbar.css'
import { LOGOUT } from '../../cache/mutations';
import {WButton, WNavItem} from 'wt-frontend'
import {Redirect} from 'react-router-dom';
import { useMutation, useApolloClient }     from '@apollo/client';
import {Container,Navbar,Nav} from 'react-bootstrap';

const LoggedIn =(props) =>{
  
  const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);

    const handleLogout = async (e) => {
        Logout();

        const { data } = await props.fetchUser();
        if (data) {
            await client.resetStore();
        }
        window.location ="/welcome";
    };

  return (
    
    <>
      <Nav.Link href="#home" onClick ={props.setShowUpdate}>{props.name}</Nav.Link>
      <Nav.Link href="#link" onClick ={handleLogout}>Logout</Nav.Link>
    </>
  )
}


const LoggedOut =(props) =>{
  return (
    <>
      <Nav.Link href="#home" onClick ={props.setShowCreate}>Create An Account</Nav.Link>
      <Nav.Link href="#link" onClick ={props.setShowLogin}>Login</Nav.Link>
    </>
  )
  
}


export const NavbarComponent = (props) =>{

  return (

    <Navbar expand="lg" variant="light" bg="light">
      <Container>
        <Navbar.Brand href="#">Navbar</Navbar.Brand>
        <Nav className ="ml-auto">
        {props.auth === false ? <LoggedOut setShowCreate ={props.setShowCreate} setShowLogin ={props.setShowLogin}/>:<LoggedIn name ={props.user.name} fetchUser ={props.fetchUser} setShowUpdate ={props.setShowUpdate}/>}
        </Nav>
        
      </Container>
    </Navbar>
  )
}