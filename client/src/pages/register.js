import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { register } from "../redux/actions/authAction";


const Register = () => {

    const initialState = { fullName: '', username: '', email: '', newPassword: '', confirmPassword: '', gender: '' }
    const [userData, setUserData] = useState(initialState);
    const { fullName, username, email, newPassword, confirmPassword} = userData


    const [typePass, setTypePass] = useState(false)
    const [typeConfirmPass, setTypeConfirmPass] = useState(false)


    const { auth, alert } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();


    useEffect(() => {
        if (auth.token) history.push('/');
    }, [auth.token, history]);


    const handleInputChange = event => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    }


    const passwordShowToggle = passwordType => {
        if (passwordType === 'newPassword') {
            setTypePass(!typePass);
            document.getElementsByClassName('password-show-toggle')[0].classList.toggle('fa-eye-slash');
        } else {
            setTypeConfirmPass(!typeConfirmPass);
            document.getElementsByClassName('password-show-toggle')[1].classList.toggle('fa-eye-slash');
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        const registerButton = document.getElementById('register-button')
        registerButton.setAttribute('disabled', 'true');
        await dispatch(register(userData));
        registerButton.removeAttribute('disabled');

    }


    return (
        <div className="auth-page">
            <form className="form-block" onSubmit={handleSubmit}>


                <h3 className="text-uppercase text-center mb-4">Create An Account</h3>


                <div className="form-group">
                    <label htmlFor="full-name">
                        Full Name<span className="text-danger">*</span>
                    </label>
                    <input id="full-name" className="form-control full-name-input" type="text" placeholder="Enter Full Name"
                        name="fullName" value={fullName.replace(/ +(?= )/g, '')} onChange={handleInputChange} required
                        autoFocus minLength="3" maxLength="25" />
                    <small className="form-text text-danger ml-1">{alert.fullName ? alert.fullName : ""}</small>
                </div>


                <div className="form-group">
                    <label htmlFor="email">
                        Email Address<span className="text-danger">*</span>
                    </label>
                    <input id="email" className="form-control email-input" type="email" placeholder="Enter email address"
                        aria-describedby="emailHelp" name="email" value={email} onChange={handleInputChange} required />
                    <small id="emailHelp" className="text-muted ml-1">We'll never share your email with anyone else.</small>
                    <small className="form-text text-danger ml-1">{alert.email ? alert.email : ""}</small>
                </div>


                <div className="form-group">
                    <label htmlFor="username">
                        Username<span className="text-danger">*</span>
                    </label>
                    <input id="username" className="form-control username-input" type="text" placeholder="Enter username"
                        name="username" value={username.toLowerCase().replace(/ /g, '')} onChange={handleInputChange} required
                        minLength="3" maxLength="25" />
                    <small className="form-text text-danger ml-1">{alert.username ? alert.username : ""}</small>
                </div>


                <div className="form-group">
                    <label htmlFor="newPassword">
                        Password<span className="text-danger">*</span>
                    </label>
                    <div className="pass">
                        <input id="newPassword" className="form-control newPassword-input" type={typePass ? "text" : "password"} placeholder="Password"
                            name="newPassword" value={newPassword} onChange={handleInputChange} required
                            style={{ backgroundColor: alert.newPassword ? "#fd2d6a14" : "" }} />
                        <span className="fa fa-eye password-show-toggle" onClick={() => passwordShowToggle('newPassword')}></span>
                    </div>
                    <small className="form-text text-danger ml-1">{alert.newPassword ? alert.newPassword : ""}</small>
                </div>


                <div className="form-group">
                    <label htmlFor="confirm-password">
                        Confirm Password<span className="text-danger">*</span>
                    </label>
                    <div className="pass">
                        <input id="confirm-password" className="form-control confirm-password-input" type={typeConfirmPass ? "text" : "password"} placeholder="Confirm Password"
                            name="confirmPassword" value={confirmPassword} onChange={handleInputChange} required
                            style={{ backgroundColor: alert.confirmPassword ? "#fd2d6a14" : "" }} />
                        <span className="fa fa-eye password-show-toggle" onClick={() => passwordShowToggle('confirmPassword')}></span>
                    </div>
                    <small className="form-text text-danger ml-1">{alert.confirmPassword ? alert.confirmPassword : ""}</small>
                </div>


                <div className="form-group">
                    Gender<span className="text-danger">*</span> :
                    <div className="row justify-content-between mx-2 mb-1 mt-2">
                        <label htmlFor="male">
                            <input type="radio" id="male" className="mr-1" name="gender"
                                value="male" onChange={handleInputChange} />Male
                        </label>
                        <label htmlFor="female">
                            <input type="radio" id="female" className="mr-1" name="gender"
                                value="female" onChange={handleInputChange} />Female
                        </label>
                        <label htmlFor="other">
                            <input type="radio" id="other" className="mr-1" name="gender"
                                value="other" onChange={handleInputChange} />Other
                        </label>
                    </div>
                    <small className="form-text text-danger ml-1">{alert.gender ? alert.gender : ""}</small>
                </div>


                <button type="submit" id="register-button" className="btn btn-dark w-100">
                    Register
                </button>


                <p className="form-text text-danger mt-3 ml-1">{alert.registerError ? alert.registerError : ""}</p>


                <p className="my-2">
                    Already have an account? <Link to="/" style={{ color: "crimson" }}>Login Now</Link>
                </p>


            </form>
        </div>
    )
}

export default Register;