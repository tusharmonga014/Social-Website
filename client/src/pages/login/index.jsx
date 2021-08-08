import React, { useState } from "react";

const Login = () => {

    const initialState = { usernameOrEmail: '', password: '' };
    const [userData, setuserData] = useState(initialState);
    const { usernameOrEmail, password } = userData;

    const handleInputChange = event => {
        const { name, value } = event.target;
        setuserData({ ...userData, [name]: value });
    }

    const submitfunc = () => {
        console.log(userData);
    }

    return (
        <div className="login-page">
            <form onSubmit={submitfunc}>
                <h3 className="text-uppercase text-center mb-4">Social Website</h3>

                <div className="form-group">
                    <label htmlFor="login-username-email">Username</label>
                    <input id="login-username-email" className="form-control" type="text" placeholder="Enter username or email"
                        aria-describedby="emailHelp" name='usernameOrEmail' value={usernameOrEmail} onChange={handleInputChange} required />
                    <small id="emailHelp" className="form-text text-muted">
                        We'll never share your email with anyone else.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input id="login-password" className="form-control" type="password" placeholder="Password"
                        name="password" value={password} onChange={handleInputChange} required />
                </div>

                <button type="submit" className="btn btn-primary">
                    Submit
                </button>

            </form>
        </div>
    );
}

export default Login;