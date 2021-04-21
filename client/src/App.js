import './App.css';
import {useQuery} from '@apollo/client';
import * as queries from './cache/queries';
import {jsTPS} from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import {YourMaps} from './components/yourmaps/YourMaps';
import {PrivateRouteYourMap} from './PrivateRoutes/PrivateRouteYourMap';
import react,{useEffect, useState} from 'react';

import {LoginBootStrap} from'./components/Modals/Login/LoginBootstrap';
import {CreateAccountBootstrap} from './components/Modals/CreateAccount/CreateAccountBootstrap';
import {UpdateAccount} from './components/Modals/UpdateAccount/UpdateAccount';
import {NavbarComponent} from './components/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row ,Col} from 'react-bootstrap';

export const App = () => {

  const[showCreate,toggleShowCreate] = useState(false);
  const[showLogin, toggleShowLogin] = useState(false);
  const[showUpdate,toggleShowUpdate] = useState(false);
  const[user,setUser] = useState(null);
  const [isInit,setIsInit] = useState(false);
  let transactionstack = new jsTPS();
  const {loading, error, data, refetch} = useQuery(queries.GET_DB_USER);

  useEffect(() =>{
    if(error) { console.log(error); }
    if(loading) { console.log(loading); }
    if(data) { 
      let { getCurrentUser } = data;
      if(getCurrentUser !== null) {
         setUser(getCurrentUser);
        }else{
          setUser(null);
        }
        setIsInit(true);
    }else{
      setIsInit(false);
    }

  },[data])
  

  const setShowCreate =() =>{
    toggleShowCreate(!showCreate);
    toggleShowLogin(false);
  }

  const setShowLogin =() =>{
    toggleShowLogin(!showLogin);
    toggleShowCreate(false);
    toggleShowUpdate(false);
  }

  const setShowUpdate =() =>{
    toggleShowUpdate(!showUpdate);
    toggleShowCreate(false);
    toggleShowLogin(false);
    
  }


  return (
      <Container fluid>
        <NavbarComponent auth = {user !== null} setShowCreate ={setShowCreate} setShowLogin ={setShowLogin} setShowUpdate ={setShowUpdate} fetchUser={refetch} user ={user}/>
        <LoginBootStrap showLogin ={showLogin} setShowLogin ={setShowLogin} fetchUser ={refetch}/>
        <CreateAccountBootstrap showCreate ={showCreate} setShowCreate ={setShowCreate} fetchUser ={refetch}/>
        <UpdateAccount showUpdate ={showUpdate} setShowUpdate ={setShowUpdate} fetchUser ={refetch} user ={user} isInit ={isInit}/>
      
      <BrowserRouter>
      <Switch>
      <Redirect exact from ="/" to={{pathname:"/welcome"}}/>
        <Route exact path="/welcome" component={WelcomeScreen} user ={user} fetchUser ={refetch}/>

        <PrivateRouteYourMap user = {user}  fetchUser ={refetch} path="/your_maps" isInit ={isInit} component ={YourMaps}/>

       
    

      </Switch>
    </BrowserRouter>
      </Container>
  );
  }



