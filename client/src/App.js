import { HashRouter as Router, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { refreshToken } from "./redux/actions/authAction";
import PageRender from "./customRouter/PageRender";
import './styles/global.css';
import Header from "./components/header/Header";
import PrivateRouter from "./customRouter/PrivateRouter";
import NewPostModal from "./components/home/NewPost/NewPostModal";

function App() {


  const { auth, post } = useSelector(state => state);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);


  return (

    <div className='app'>
      <Router>

        {auth.token && <Header />}
        {post.newPostModal && <NewPostModal />}
        {auth.token && <Route exact path="/" component={Home} />}
        {!auth.token && <Route exact path="/" component={Login} />}
        <Route exact path="/register" component={Register} />
        <PrivateRouter exact path='/:page' component={PageRender} />
        <PrivateRouter exact path='/:page/:id' component={PageRender} />

      </Router>
    </div>

  );
}

export default App;
