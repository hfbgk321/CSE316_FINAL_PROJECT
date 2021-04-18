import react,{useState} from 'react';
import {Navbar} from '../Navbar/Navbar';
import CreateAccount from '../CreateAccount/CreateAccount';
import Login from '../Login/Login';

const WelcomeScreen =(props) =>{
  const[showCreate,toggleShowCreate] = useState(false);
  const[showLogin, toggleShowLogin] = useState(false);

  const setShowCreate =() =>{
    toggleShowCreate(!showCreate);
  }

  const setShowLogin =() =>{
    toggleShowLogin(!showLogin);
  }
  const auth = props.user === null ? false : true; 
  return (
    <div>
      <Navbar auth = {auth} setShowCreate ={setShowCreate} setShowLogin ={setShowLogin}/>
      <h1>This is the welcome screen</h1>
      {
        showCreate && <CreateAccount fetchUser={props.fetchUser} setShowCreate ={setShowCreate}/>
      }
      {
        showLogin && <Login fetchUser ={props.fetchUser} setShowLogin ={setShowLogin}/>
      }
    </div>
  )
}

export default WelcomeScreen;