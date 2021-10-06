import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom"
import Loading from "../components/Loading";

const PrivateRouter = (props) => {

    const { auth } = useSelector(state => state);
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {

        if (auth.token)
            return <Route {...props} />
        else
            return <Loading />

    } else {
        return <Redirect to="/" />
    }
}

export default PrivateRouter;