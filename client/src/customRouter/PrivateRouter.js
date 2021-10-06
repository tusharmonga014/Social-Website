import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom"
import Loading from "../components/Loading";

const PrivateRouter = (props) => {

    const { auth } = useSelector(state => state);
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {

        if (auth.token){
            console.log("token present");
            console.log(isLoggedIn + " " + auth.token);
            return <Route {...props} />
        }
        else{
            console.log("token not present");
            console.log(isLoggedIn + " " + auth.token);
            return <Loading />
        }
    } else {

        console.log(isLoggedIn);
        return <Redirect to="/" />

    }
}

export default PrivateRouter;