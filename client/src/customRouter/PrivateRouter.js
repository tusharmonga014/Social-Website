import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom"

const PrivateRouter = (props) => {
    const { auth } = useSelector(state => state)
    return auth.token ? <Route {...props} /> : <Redirect to="/" />
}

export default PrivateRouter;