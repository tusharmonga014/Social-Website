import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import { refreshToken } from "./redux/actions/authAction";
import PageRender from "./customRouter/PageRender";
import Header from "./components/header/Header";
import PrivateRouter from "./customRouter/PrivateRouter";
import NewPostModal from "./components/home/newPost/NewPostModal";
import { getPosts } from "./redux/actions/postAction";
import { getSuggestions } from "./redux/actions/suggestionsAction";
import "./styles/global.css";


function App() {

  const { auth, post, suggestions } = useSelector(state => state);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);


  useEffect(() => {
    if (auth.token && post.homePosts.posts.length === 0) dispatch(getPosts(auth, 1));
  }, [auth, auth.token, post.homePosts.posts.length, dispatch]);


  useEffect(() => {
    if (auth.token && !suggestions.users) dispatch(getSuggestions(auth, 7));
  }, [auth, auth.token, suggestions.users, dispatch]);


  return (

    <div className='app main'>
      <Router>

        {auth.token && <Header />}
        {(post.newPostModal || post.onEdit) && <NewPostModal />}
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
