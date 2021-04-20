import './App.css';
import {useQuery} from '@apollo/client';
import * as queries from './cache/queries';
import {jsTPS} from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import {YourMaps} from './components/yourmaps/YourMaps';
import {PrivateRouteYourMap} from './PrivateRoutes/PrivateRouteYourMap';
import react,{useEffect, useState} from 'react';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Login from './components/Login/Login';
import {Navbar} from './components/Navbar/Navbar';
import { UserInputError } from 'apollo-server-errors';


export const App = () => {

  const[showCreate,toggleShowCreate] = useState(false);
  const[showLogin, toggleShowLogin] = useState(false);
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
  }


  return (
    <div>
      <BrowserRouter>
      <Navbar auth = {user !== null} setShowCreate ={setShowCreate} setShowLogin ={setShowLogin} fetchUser={refetch} user ={user}/>
      <Switch>
      <Redirect exact from ="/" to={{pathname:"/welcome"}}/>
        <Route exact path="/welcome" component={WelcomeScreen} user ={user} fetchUser ={refetch}/>

        <PrivateRouteYourMap user = {user}  fetchUser ={refetch} path="/your_maps" isInit ={isInit}component ={YourMaps}/>

       
    

      </Switch>
    </BrowserRouter>
       {
        showCreate && <CreateAccount fetchUser={refetch} setShowCreate ={setShowCreate}/>
      }
      {
        showLogin && <Login fetchUser ={refetch} setShowLogin ={setShowLogin}/>
      }
    </div>
    
    
  );
  }



