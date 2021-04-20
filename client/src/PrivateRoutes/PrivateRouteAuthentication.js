import react, { Component } from 'react';
import {Redirect,Route} from 'react-router-dom';

export const  PrivateRouteAuthentication =  ({component: Component, user, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => user === null
        ? <Component {...props} />
        : <Redirect to={{pathname: '/your_maps', state: {from: props.location}}} />}
    />
  )
}