import './App.css';
import {useQuery} from '@apollo/client';
import * as queries from './cache/mutations';
import {jsTPS} from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';


function App() {
  let user = null;
  let transactionstack = new jsTPS();

  // const {loading, error, data, refetch} = useQuery()

  return (
    <div className="App">
      <h1>Hello World</h1>
    </div>
  );
}

export default App;
