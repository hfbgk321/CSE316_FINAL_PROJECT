import './App.css';
import {useQuery} from '@apollo/client';
import * as queries from './cache/queries';
import {jsTPS} from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect,useHistory } from 'react-router-dom';
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
import {Container,Row ,Col} from 'react-bootstrap';

import {RegionViewerMain} from './components/RegionViewer/RegionViewerMain';

export const App = () => {
  let history = useHistory();
  const[showCreate,toggleShowCreate] = useState(false);
  const[showLogin, toggleShowLogin] = useState(false);
  const[showUpdate,toggleShowUpdate] = useState(false);
  const[user,setUser] = useState(null);
  const [isInit,setIsInit] = useState(false);
  let transactionstack = new jsTPS();
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
      <NavbarComponent auth = {user !== null} setShowCreate ={setShowCreate} prevPaths = {prevPaths} setShowLogin ={setShowLogin} setShowUpdate ={setShowUpdate} fetchUser={refetch} user ={user} history={history} isInit ={isInit} tps ={transactionstack}/>
        <LoginBootStrap showLogin ={showLogin} setShowLogin ={setShowLogin} fetchUser ={refetch} history={history}/>
        <CreateAccountBootstrap showCreate ={showCreate} setShowCreate ={setShowCreate} fetchUser ={refetch} history={history} setShowLogin={setShowLogin}/>
        <UpdateAccount showUpdate ={showUpdate} setShowUpdate ={setShowUpdate} fetchUser ={refetch} user ={user} isInit ={isInit} history={history}/>
      <Switch>
      <Redirect exact from ="/" to={{pathname:user!==null ? "/your_maps" :"/welcome"}}/>
        <Route exact path="/welcome" component={WelcomeScreen} user ={user} fetchUser ={refetch} history={history}/>

        <PrivateRoute user = {user}  fetchUser ={refetch} exact path="/your_maps" isInit ={isInit} component ={YourMaps} history={history}/>

        <PrivateRoute user ={user} fetchUser ={refetch} exact path= "/your_maps/:map_id" isInit ={isInit} component ={RegionSpreadSheet} history={history} handleSetPaths ={handleSetPaths} tps = {transactionstack}/>
        <PrivateRoute user ={user} fetchUser ={refetch} exact path= "/your_maps/:map_id/:region_id" isInit ={isInit} component ={RegionSpreadSheet} history={history} handleSetPaths ={handleSetPaths} tps = {transactionstack}/>

        <PrivateRoute user= {user} fetchUser ={refetch} exact path ="/your_maps/:map_id/:region_id/viewer" isInit ={isInit} component ={RegionViewerMain} history ={history} tps = {transactionstack} />

        <PrivateRoute user= {user} fetchUser ={refetch} exact path ="/your_maps/:map_id/viewer" isInit ={isInit} component ={RegionViewerMain} history ={history} tps = {transactionstack} />

      </Switch>
      </Container>
  );
  }



