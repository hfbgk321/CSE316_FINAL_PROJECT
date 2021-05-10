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
        props.history.push("/your_maps");
    };

  return (
    
    <>
      <Nav.Link onClick ={props.setShowUpdate}>{props.name}</Nav.Link>
      <Nav.Link onClick ={handleLogout}>Logout</Nav.Link>
    </>
  )
}


const LoggedOut =(props) =>{
  return (
    <>
      <Nav.Link onClick ={props.setShowCreate}>Create An Account</Nav.Link>
      <Nav.Link onClick ={props.setShowLogin}>Login</Nav.Link>
    </>
  )
  
}

const handlePreviousLink = (props,key,_id,map_id) =>{
  props.tps.clearAllTransactions();
  if(_id === map_id){
    window.location =`/your_maps/${_id}`;
  }else{
    window.location =`/your_maps/${map_id}/${_id}`;
  }
}


export const NavbarComponent = (props) =>{
  if(!props.isInit){
    return "";
  }
  return (

    <Navbar expand="lg" variant="light" bg="light">
      <Container>
        <Navbar.Brand href ="/" onClick ={() =>{
          if(props.auth){
            props.history.push("/your_maps");
          }else{
            props.history.push("/welcome");
          }
        }}>The World Data Mapper</Navbar.Brand>
        <Nav style={{position:"relative",left:60}}>
        {props.prevPaths.map((path,key)=>{
          return (
            <Nav.Item>
            <Nav.Link eventKey="link-1" onClick ={() =>
            handlePreviousLink(props,key,path._id,props.prevPaths[0]._id)}>{key === props.prevPaths.length -1 ? path.name: path.name+"  >"} </Nav.Link>
          </Nav.Item>
          )
           
        })}

        </Nav>
        <Nav className ="ml-auto">
        
        {props.auth === false ? <LoggedOut history = {props.history} setShowCreate ={props.setShowCreate} setShowLogin ={props.setShowLogin}/>:<LoggedIn name ={props.user.name} history ={props.history} fetchUser ={props.fetchUser} setShowUpdate ={props.setShowUpdate}/>}
        
        </Nav>
        
      </Container>
    </Navbar>
  )
}