import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import { useSelector } from "react-redux";
// import PageRender from "./PageRender";

function App() {

  const { auth } = useSelector(state => state);

  return (
    <div className='app'>
      <Router>
        <Route exact path="/" component={auth.token ? Home : Login} />
        <Route exact path="/register" component={Register} />
        {/* <Route exact path='/:page' component={PageRender} />
        <Route exact path='/:page/:id' component={PageRender} /> */}
      </Router>
    </div>
  );
}

export default App;
