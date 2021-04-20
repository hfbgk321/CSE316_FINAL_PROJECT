import react,{useState,useEffect} from 'react';
import './navbar.css'
import { LOGOUT } from '../../cache/mutations';
import {WButton, WNavItem} from 'wt-frontend'
import {Redirect} from 'react-router-dom';
import { useMutation, useApolloClient }     from '@apollo/client';


const LoggedIn =(props) =>{
  
  const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);

    const handleLogout = async (e) => {
      // debugger;
        Logout();

        const { data } = await props.fetchUser();
        if (data) {
            await client.resetStore();
        }
        window.location ="/welcome";
    };

  return (
    <div>
    <a className ="navbar_item">{props.name}</a>
    <a className ="navbar_item" onClick ={handleLogout}> Logout</a>
    </div>
  )
}


const LoggedOut =(props) =>{
  
  return (
    <div>
    <a className ="navbar_item" onClick ={props.setShowCreate}>Create An Account</a>
    <a className ="navbar_item" onClick ={props.setShowLogin}>Login</a>
    </div>
  )
}


export const Navbar = (props) =>{

  return (
    <div className ="horizontal">
      <a className ="navbar_item">Place Logo Here</a>
      <div className ="navbar_authentication_items">
        {props.auth === false ? <LoggedOut setShowCreate ={props.setShowCreate} setShowLogin ={props.setShowLogin}/>:<LoggedIn name ={props.user.name} fetchUser ={props.fetchUser}/>}
      </div>
      
    </div>
  )
}