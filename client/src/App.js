import './App.css';
import {useQuery} from '@apollo/client';
import * as queries from './cache/queries';
import {jsTPS} from './utils/jsTPS';
import {Switch, Route, Redirect,useHistory } from 'react-router-dom';
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import {YourMaps} from './components/yourmaps/YourMaps';
import {PrivateRoute} from './PrivateRoutes/PrivateRoute';

import react,{useEffect, useState} from 'react';


import {LoginBootStrap} from'./components/Modals/Login/LoginBootstrap';
import {CreateAccountBootstrap} from './components/Modals/CreateAccount/CreateAccountBootstrap';
import {UpdateAccount} from './components/Modals/UpdateAccount/UpdateAccount';
import {NavbarComponent} from './components/Navbar/Navbar';
import {RegionSpreadSheet} from './components/SpreadSheet/RegionSpreadSheet';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'react-bootstrap';

import {RegionViewerMain} from './components/RegionViewer/RegionViewerMain';

export const App = (props) => {
  let history = useHistory();
  const[showCreate,toggleShowCreate] = useState(false);
  const[showLogin, toggleShowLogin] = useState(false);
  const[showUpdate,toggleShowUpdate] = useState(false);
  const[user,setUser] = useState(null);
  const [isInit,setIsInit] = useState(false);
  
  const [prevPaths,setPrevPaths] = useState([]);
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

  const handleSetPaths = (paths) =>{
    setPrevPaths(paths);
  }


  if(!isInit){
    return "";
  }
  return (
      <Container fluid>
      <NavbarComponent auth = {user !== null} setShowCreate ={setShowCreate} prevPaths = {prevPaths} setShowLogin ={setShowLogin} setShowUpdate ={setShowUpdate} fetchUser={refetch} user ={user} history={history} isInit ={isInit} tps ={props.transactionstack}/>
        <LoginBootStrap showLogin ={showLogin} setShowLogin ={setShowLogin} fetchUser ={refetch} history={history}/>
        <CreateAccountBootstrap showCreate ={showCreate} setShowCreate ={setShowCreate} fetchUser ={refetch} history={history} setShowLogin={setShowLogin}/>
        <UpdateAccount showUpdate ={showUpdate} setShowUpdate ={setShowUpdate} fetchUser ={refetch} user ={user} isInit ={isInit} history={history}/>
      <Switch>
      <Redirect exact from ="/" to={{pathname:user!==null ? "/your_maps" :"/welcome"}}/>
        <Route exact path="/welcome" component={WelcomeScreen} user ={user} fetchUser ={refetch} history={history}/>

        <PrivateRoute user = {user}  fetchUser ={refetch} exact path="/your_maps" isInit ={isInit} component ={YourMaps} history={history}/>

        <PrivateRoute user ={user} fetchUser ={refetch} exact path= "/your_maps/:map_id" isInit ={isInit} component ={RegionSpreadSheet} history={history} handleSetPaths ={handleSetPaths} tps = {props.transactionstack}/>
        <PrivateRoute user ={user} fetchUser ={refetch} exact path= "/your_maps/:map_id/:region_id" isInit ={isInit} component ={RegionSpreadSheet} history={history} handleSetPaths ={handleSetPaths} tps = {props.transactionstack}/>


        <PrivateRoute user= {user} fetchUser ={refetch} exact path ="/your_maps/:region_id/region/viewer" isInit ={isInit} component ={RegionViewerMain} history ={history} tps = {props.transactionstack} handleSetPaths ={handleSetPaths}/>

      </Switch>
      </Container>
  );
  }



