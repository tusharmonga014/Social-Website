import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Info from "../../components/profile/Info";
import LoadIcon from "../../images/loading.gif";
import { getProfileUsers } from "../../redux/actions/profileAction";
import ProfilePosts from "../../components/profile/ProfilePosts";
import { getUserPosts } from "../../redux/actions/postAction";

let scrollProfile = 0;

const Profile = () => {

    const { profile, auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const { id } = useParams();


    const TABS = [
        {
            name: 'POSTS',
            id: 'posts-tab',
            onlyAuthUser: false,
            getComponentData: getUserPosts,
            component: <ProfilePosts />
        },
        {
            name: 'PHOTOS',
            id: 'photos-tab',
            onlyAuthUser: false,
            component: <></>
        },
        {
            name: 'SAVED',
            id: 'saved-tab',
            onlyAuthUser: true,
            component: <></>
        }
    ];


    const defaultTab = TABS[0];
    const [currentTab, setCurrentTab] = useState(defaultTab);


    window.addEventListener('scroll', () => {
        if (window.location.pathname === '/') {
            scrollProfile = window.pageYOffset;
            return scrollProfile;
        }
    });


    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({ top: scrollProfile, behavior: 'smooth' });
        }, 100);
    }, []);


    useEffect(() => {
        const allTabs = document.querySelectorAll('.profile-tab button');
        allTabs.forEach(tab => tab.classList.remove('active'));
        const selectedTab = document.getElementById(currentTab.id);
        selectedTab.classList.add('active');
    }, [currentTab]);


    useEffect(() => {
        if (profile.ids.every(item => item !== id))
            dispatch(getProfileUsers(id, auth, currentTab));
    }, [id, auth, currentTab, dispatch, profile.ids]);


    return (
        <div className="profile">

            <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

            <div className="profile-tab">
                {
                    TABS.map(tab => {
                        const onlyToAuthUser = tab.onlyAuthUser ? auth.user._id === id : true;
                        return (
                            onlyToAuthUser &&
                            < button key={tab.id} id={tab.id} onClick={() => setCurrentTab(tab)}>
                                {tab.name}
                            </button>
                        )
                    })
                }
            </div>

            {
                profile.loading
                    ? <img className="d-block mx-auto" src={LoadIcon} alt="loading" />
                    : currentTab.component
            }

        </div >
    );
}

export default Profile;