import React from "react";
import { useSelector, useDispatch } from "react-redux";
import UserCard from "../UserCard";
import FollowBtn from "../FollowBtn";
import LoadIcon from "../../images/loading.gif";
import { getSuggestions } from "../../redux/actions/suggestionsAction";


const RightSideBar = () => {

    const { auth, suggestions } = useSelector(state => state);
    const dispatch = useDispatch();


    return (
        <div className="mt-3">

            <UserCard user={auth.user} />

            <div className="d-flex justify-content-between align-items-center my-2 mt-4">
                <h5 className="text-dark">People you may know</h5>
                {
                    !suggestions.loading &&
                    <i className="fas fa-sync-alt text-primary" style={{ cursor: 'pointer' }}
                        onClick={() => dispatch(getSuggestions(auth, 7))} />
                }
            </div>

            {
                suggestions.loading
                    ? <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
                    : <div className="suggestions">
                        {
                            suggestions.users && suggestions.users.map(user => (
                                <UserCard key={user._id} user={user} >
                                    <FollowBtn user={user} />
                                </UserCard>
                            ))
                        }
                    </div>
            }

            <div style={{ opacity: 0.5 }} className="my-2" >

                <div className="d-block">
                    <small> &copy; 2021 SOCIAL WEBSITE</small>
                    <a href="https://github.com/tusharmonga014/Social-Website" target="blank">
                        <i className="fab fa-github ml-2 text-dark" />
                    </a>
                </div>

                <div className="d-block">
                    <small>TUSHAR MONGA PRODUCTION</small>
                    <a href="https://linkedin.com/in/tusharmonga014" target="blank">
                        <i className="fab fa-linkedin ml-2 text-dark" />
                    </a>
                </div>

            </div>

        </div>
    );
}

export default RightSideBar;