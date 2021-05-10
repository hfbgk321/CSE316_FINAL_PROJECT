import react, { Component } from 'react';
import {Redirect,Route} from 'react-router-dom';
import {useQuery} from '@apollo/client';
import * as queries from '../cache/queries';
import YourMaps from '../components/yourmaps/YourMaps';
export const PrivateRoute = ({ component: Component,fetchUser,user,isInit,history,handleSetPaths,tps, ...rest }) => {

  return (
  <Route {...rest} render={(props)=>{
    if(!isInit) return "";
    if(user === null){
      return <Redirect to ={{pathname:"/welcome", state:{from: props.location}}}/>
    }else{
      return <Component tps = {tps} isInit= {isInit} handleSetPaths={handleSetPaths} history = {history} auth={true} {...props}/>
    }
    
  }}/>
  )
  
}


