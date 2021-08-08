import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/login/index";
import Register from "./pages/register/index";
// import PageRender from "./PageRender";

function App() {
  return (
    <div className='app'>
      <Router>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        {/* <Route exact path='/:page' component={PageRender} />
        <Route exact path='/:page/:id' component={PageRender} /> */}
      </Router>
    </div>
  );
}

export default App;
