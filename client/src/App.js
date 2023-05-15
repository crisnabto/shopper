import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Switch>
      <Route exact path = "/home" component={Home}></Route>
    </Switch>
  );
}

export default App;
