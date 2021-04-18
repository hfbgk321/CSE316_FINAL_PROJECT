import './App.css';
import {useQuery} from '@apollo/client';
import * as queries from './cache/queries';
import {jsTPS} from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import {YourMaps} from './components/yourmaps/YourMaps';
import Login from './components/Login/Login';

function App() {
  let user = null;
  let transactionstack = new jsTPS();

  const {loading, error, data, refetch} = useQuery(queries.GET_DB_USER);

  if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) {
       user = getCurrentUser; 
      }
  }
    

  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/" to={{pathname: user === null ? "/welcome" : "/your_maps"}}/>
        <Route 
          path ="/welcome"
          name = "welcome"
          render ={()=><WelcomeScreen fetchUser ={refetch} user ={user}/>}
        />

        <Route
          path="/your_maps"
          name ="Your Maps"
          render ={()=>
            user === null ?<Redirect path ="/welcome"/> :<YourMaps tps ={transactionstack} fetchUser ={refetch} user ={user}/>
          }
        />
{/* 
        <Route 
          path = "/login"
          name ="login"
          render ={() => user === null ? <Login fetchUser ={refetch} user ={user}/> : <Redirect path ="/your_maps"/>}
        /> */}
      </Switch>
    
    </BrowserRouter>
  );
}


export default App;
