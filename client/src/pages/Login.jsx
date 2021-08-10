import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { login } from "../redux/actions/authAction";


const Login = () => {

    const initialState = { usernameOrEmail: '', password: '' };
    const [userData, setuserData] = useState(initialState);
    const { usernameOrEmail, password } = userData;


    const [typePass, setTypePass] = useState(false);


    const { auth } = useSelector(state => state);
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


    const showWrongInputMessage = (refInputElement, position, message) => {
        const wrongInputElement = document.createElement("p");
        const wrongInputMessage = document.createTextNode(message);
        wrongInputElement.setAttribute('class', 'wrong-input');
        wrongInputElement.appendChild(wrongInputMessage);
        refInputElement.insertAdjacentElement(position, wrongInputElement);
    }


    const removePreviousWrongInputMessages = () => {
        const wrongInputElement = document.getElementsByClassName('wrong-input')[0];
        if (wrongInputElement) wrongInputElement.remove();
    }


    const showIncorrectUsernameOrEmail = message => {
        setuserData({ ...userData, password: '' });
        document.getElementsByClassName('username-email-input')[0].focus();
        const inputElement = document.getElementsByClassName('username-email-input')[0];
        showWrongInputMessage(inputElement, 'afterend', message);
    }


    const showIncorrectPassword = message => {
        setuserData({ ...userData, password: '' });
        document.getElementsByClassName('password-input')[0].focus();
        const inputElement = document.getElementsByClassName('password-show-toggle')[0];
        showWrongInputMessage(inputElement, 'afterend', message);
    }


    const showDefaultError = () => {
        const lastFormElement = document.getElementsByClassName('form-block')[0].lastChild;
        const message = 'Login request failed. Please try again after some time.'
        showWrongInputMessage(lastFormElement, 'afterend', message);
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        document.getElementById('login-button').setAttribute('disabled', 'true');
        removePreviousWrongInputMessages();

        try {
            await dispatch(login(userData));
        } catch (err) {
            const status = err.request.status;
            if (status === 400 || status === 401 || status === 404) {
                const param = err.response.data.param;
                const message = err.response.data.msg;
                if (param === 'password') showIncorrectPassword(message);
                else showIncorrectUsernameOrEmail(message);
            } else {
                console.log(err);
                showDefaultError();
            }
            document.getElementById('login-button').removeAttribute('disabled');
        }
    }


    return (
        <div className="auth-page">
            <form className="form-block" onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">Social Website</h3>

                <div className="form-group">
                    <label htmlFor="username-email">Username or Email</label>
                    <input id="username-email" className="form-control username-email-input" type="text" placeholder="Enter username or email"
                        aria-describedby="emailHelp" name='usernameOrEmail' value={usernameOrEmail} onChange={handleInputChange} required autoFocus />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="pass">

                        <input id="password" className="form-control password-input" type={typePass ? "text" : "password"} placeholder="Password"
                            name="password" value={password} onChange={handleInputChange} required />

                        <span className="fa fa-eye password-show-toggle" onClick={passwordShowToggle}></span>
                    </div>

                </div>

                <button type="submit" id='login-button' className="btn btn-primary w-100">
                    Login
                </button>

                <p className="my-2">
                    You don't have an account? <Link to="/register" style={{ color: "crimson" }}>Register Now</Link>
                </p>

            </form>
        </div>
    );
}

export default Login;