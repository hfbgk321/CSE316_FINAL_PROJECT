import react, { Component } from 'react';
import {Redirect,Route} from 'react-router-dom';
import {useQuery} from '@apollo/client';
import * as queries from '../cache/queries';
import YourMaps from '../components/yourmaps/YourMaps';
export const PrivateRouteYourMap = ({ component: Component,fetchUser,user,isInit, ...rest }) => {

  return (
  <Route {...rest} render={(props)=>{
    debugger;
    console.log(user);
    if(!isInit) return "";
    if(user === null){
      return <Redirect to ={{pathname:"/welcome", state:{from: props.location}}}/>
    }else{
      return <Component auth={true} {...props}/>
    }
    
  }}/>
  )
  
}


