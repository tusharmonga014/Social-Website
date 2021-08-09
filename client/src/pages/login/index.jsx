import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../../redux/actions/authAction";
import './styles.css';


const Login = () => {

    const initialState = { usernameOrEmail: '', password: '' };
    const [userData, setuserData] = useState(initialState);
    const { usernameOrEmail, password } = userData;
    const [typePass, setTypePass] = useState(false);
    const dispatch = useDispatch();


    const handleInputChange = event => {
        const { name, value } = event.target;
        setuserData({ ...userData, [name]: value });
    }


    const showWrongInputMessage = (wrongInputBlock, message) => {
        const wrongInputElement = document.createElement("p");
        const wrongInputMessage = document.createTextNode(message);
        wrongInputElement.setAttribute('class', 'wrong-input');
        wrongInputElement.appendChild(wrongInputMessage);
        wrongInputBlock.appendChild(wrongInputElement);
    }


    const removePreviousWrongInputMessages = () => {
        const wrongInputElement = document.getElementsByClassName('wrong-input')[0];
        if (wrongInputElement)
            wrongInputElement.remove();
    }

    
    const showIncorrectUsernameOrEmail = message => {
        setuserData({ ...userData, password: '' });
        document.getElementById('login-username-email').focus();
        const inputBlock = document.getElementsByClassName('username-email-group')[0];
        showWrongInputMessage(inputBlock, message);
    }

    
    const showIncorrectPassword = message => {
        setuserData({ ...userData, password: '' });
        document.getElementById('login-password').focus();
        const inputBlock = document.getElementsByClassName('password-group')[0];
        showWrongInputMessage(inputBlock, message);
    }


    const handleSubmit = async (event) => {

        event.preventDefault();
        removePreviousWrongInputMessages();

        try {

            await dispatch(login(userData));

        } catch (err) {

            const param = err.response.data.param;
            const message = err.response.data.msg;
            if (param === 'password') {
                showIncorrectPassword(message);
            } else {
                showIncorrectUsernameOrEmail(message);
            }
        }
    }

    
    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">Social Website</h3>

                <div className="form-group username-email-group">
                    <label htmlFor="login-username-email">Username or Email</label>
                    <input id="login-username-email" className="form-control" type="text" placeholder="Enter username or email"
                        aria-describedby="emailHelp" name='usernameOrEmail' value={usernameOrEmail} onChange={handleInputChange} required autoFocus />
                </div>

                <div className="form-group password-group">
                    <label htmlFor="login-password">Password</label>
                    <div className="pass">

                        <input id="login-password" className="form-control" type={typePass ? "text" : "password"} placeholder="Password"
                            name="password" value={password} onChange={handleInputChange} required />

                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? 'Hide' : 'Show'}
                        </small>
                    </div>

                </div>

                <button type="submit" className="btn btn-primary w-100">
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