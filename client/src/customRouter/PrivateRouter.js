import { Route, Redirect } from "react-router-dom"

const PrivateRouter = (props) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn ? <Route {...props} /> : <Redirect to="/" />
}

export default PrivateRouter;