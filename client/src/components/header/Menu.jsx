import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import UserImage from "../UserImage";
// import NotifyModal from '../NotifyModal'

const Menu = () => {
    const navLinks = [
        { label: 'Home', icon: 'home', path: '/' },
        { label: 'Message', icon: 'forum', path: '/message' }
    ]

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const isActive = (pn) => {
        if (pn === pathname) return 'active'
    }

    return (
        <div className="menu">
            <ul className="navbar-nav flex-row">
                
                
                {
                    navLinks.map((link, index) => (
                        <li className={`nav-item px-2 ${isActive(link.path)}`} key={index}>
                            <Link className="nav-link" to={link.path}>
                                <span className="material-icons">{link.icon}</span>
                            </Link>
                        </li>
                    ))
                }


                <li className="nav-item dropdown" >

                    <span className="nav-link position-relative" id="navbarDropdown"
                        role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                        <span className="material-icons">
                            notifications
                        </span>
                        {/* <span className="notify_length"></span> */}
                    </span>

                    <div className="dropdown-menu" aria-labelledby="navbarDropdown"
                        style={{ transform: 'translateX(75px)' }}>
                        {/* <NotifyModal /> */}
                    </div>

                </li>


                <li className="nav-item dropdown" style={{ opacity: 1 }} >

                    <span className="nav-link dropdown-toggle mb-1" id="navbarDropdown"
                        role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <UserImage src={auth.user.userImage} size="medium" />
                    </span>
                    
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>Profile</Link>
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" to="/"
                            onClick={() => dispatch(logout())}>
                            Logout
                        </Link>
                    </div>
                
                </li>


            </ul>
        </div>

    )
}

export default Menu