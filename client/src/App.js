import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { refreshToken } from "./redux/actions/authAction";
// import PageRender from "./PageRender";
import './styles/global.css';

function App() {


  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);


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
