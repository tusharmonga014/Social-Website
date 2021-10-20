import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Info from "../../components/profile/Info";
import { getProfileUsers } from "../../redux/actions/profileAction";
import ProfilePosts from "../../components/profile/ProfilePosts";
import { getSavedPosts, getUserMedia, getUserPosts } from "../../redux/actions/postAction";
import ProfilePhotos from "../../components/profile/ProfilePhotos";
import SavedPosts from "../../components/profile/SavedPosts";

var scrollProfile = 0;

const Profile = () => {

    const { profile, auth, post } = useSelector(state => state);
    const dispatch = useDispatch();
    const { id } = useParams();


    const TABS = [
        {
            name: 'POSTS',
            id: 'posts-tab',
            onlyAuthUser: false,
            getComponentData: getUserPosts,
            dataPresent: (id) => post.profilePostsArray.find(profilePosts => profilePosts._id === id),
            component: <ProfilePosts />
        },
        {
            name: 'PHOTOS',
            id: 'photos-tab',
            onlyAuthUser: false,
            getComponentData: getUserMedia,
            dataPresent: (id) => post.userMedia.find(user => user._id === id),
            component: <ProfilePhotos />
        },
        {
            name: 'SAVED',
            id: 'saved-tab',
            onlyAuthUser: true,
            getComponentData: getSavedPosts,
            dataPresent: () => false,
            component: <SavedPosts />
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
        if (!currentTab.dataPresent(id))
            dispatch(currentTab.getComponentData(id, auth, 1));
        const allTabs = document.querySelectorAll('.profile-tab button');
        allTabs.forEach(tab => tab.classList.remove('active'));
        const selectedTab = document.getElementById(currentTab.id);
        selectedTab.classList.add('active');
    }, [currentTab, dispatch, id, auth]);


    useEffect(() => {
        if (profile.ids.every(item => item !== id))
            dispatch(getProfileUsers(id, auth));
    }, [id, auth, dispatch, profile.ids]);


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
                currentTab.component
            }

        </div >
    );
}

export default Profile;