// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";

// const Register = () => {

//     const initialState = { fullName: '', username: '', email: '', password: '', confirmPassword: '', gender: '' }
//     const [userData, setUserData] = useState(initialState);
//     const { fullname, username, email, password, cf_password } = userData


//     const [typePass, setTypePass] = useState(false)
//     const [typeCfPass, setTypeCfPass] = useState(false)


//     const { auth } = useSelector(state => state);
//     const dispatch = useDispatch();
//     const history = useHistory();


//     useEffect(() => {
//         if (auth.token) history.push('/');
//     }, [auth.token, history]);


//     return (
//         <div>

//         </div>
//     )
// }

// export default Register;