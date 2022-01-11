import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { login } from "../redux/actions/authAction";


const Login = () => {

    const initialState = { usernameOrEmail: '', password: '' };
    const [userData, setuserData] = useState(initialState);
    const { usernameOrEmail, password } = userData;


    const [typePass, setTypePass] = useState(false);


    const { auth, alert } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();


    useEffect(() => {
        if (auth.token) history.push('/');
    }, [auth.token, history]);


    const handleInputChange = event => {
        const { name, value } = event.target;
        setuserData({ ...userData, [name]: value });
    }


    const passwordShowToggle = () => {
        setTypePass(!typePass);
        document.getElementsByClassName('password-show-toggle')[0].classList.toggle('fa-eye-slash');
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        const loginButton = document.getElementById('login-button')
        loginButton.setAttribute('disabled', 'true');
        await dispatch(login(userData));
        loginButton.removeAttribute('disabled');
    }


    return (
        <div className="auth-page">
            <form className="form-block" onSubmit={handleSubmit}>


                <h3 className="text-uppercase text-center mb-4">Social Website</h3>


                <div className="form-group">
                    <label htmlFor="username-email">Username or Email</label>
                    <input id="username-email" className="form-control username-email-input" type="text" placeholder="Enter username or email"
                        name="usernameOrEmail" value={usernameOrEmail} onChange={handleInputChange} required autoFocus />
                    <small className="form-text text-muted ml-1">Testing email : &nbsp;johndoe@example.com</small>
                    <small className="form-text text-danger ml-1">{alert.usernameOrEmail ? alert.usernameOrEmail : ""}</small>
                </div>


                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="pass">
                        <input id="password" className="form-control password-input" type={typePass ? "text" : "password"} placeholder="Password"
                            name="password" value={password} onChange={handleInputChange} required />
                        <span className="fa fa-eye password-show-toggle" onClick={passwordShowToggle}></span>
                    </div>
                    <small className="form-text text-muted ml-1">Testing password : &nbsp;test@123</small>
                    <small className="form-text text-danger ml-1">{alert.password ? alert.password : ""}</small>
                </div>


                <button type="submit" id="login-button" className="btn btn-dark w-100">
                    Login
                </button>


                <p className="form-text text-danger mt-3 ml-1">{alert.loginError ? alert.loginError : ""}</p>


                <p className="my-2">
                    You don't have an account? <Link to="/register" style={{ color: "crimson" }}>Register Now</Link>
                </p>


            </form>
        </div>
    );
}

export default Login;