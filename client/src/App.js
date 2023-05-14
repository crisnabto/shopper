import './App.css';
import { Route, Switch } from 'react-router-dom';
import Board from './components/Board';

function App() {
  return (
    <Switch>
      <Route exact path = "/board" component={Board}></Route>
    </Switch>
  );
}

export default App;
