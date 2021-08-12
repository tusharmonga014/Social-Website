import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import UserCard from "../UserCard";
import LoadIcon from "../../images/loading.gif";
import { setAlert } from "../../redux/actions/alertAction";

const Search = () => {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);

    const { auth } = useSelector(state => state);
    const [load, setLoad] = useState(false);
    const dispatch = useDispatch();


    const handleSearch = async (event) => {
        const toSearch = event.target.value;
        setSearch(toSearch);

        if (!toSearch) {
            setUsers([]);
            return;
        }

        try {
            setLoad(true);
            const res = await getDataAPI(`users/search?username=${toSearch}`, auth.token);
            setUsers(res.data.users);
            setLoad(false);
        } catch (err) {
            dispatch(setAlert(err));
        }
    }

    const handleClose = () => {
        setSearch('');
        setUsers([]);
    }

    return (
        <div className="search_form">
            <input type="text" name="search" id="search" title="Search"
                value={search} autoComplete="off" onChange={handleSearch} />

            <div className="search_icon" style={{ opacity: search ? 0 : 0.3 }}>
                <span className="material-icons">search</span>
                <span> Search</span>
            </div>

            <div className="close_search" onClick={handleClose}
                style={{ opacity: search.length === 0 ? 0 : 1 }} >
                &times;
            </div>

            {load && <img className="loading" src={LoadIcon} alt="loading" />}

            <div className="users">
                {
                    search && users.map(user => (
                        <UserCard
                            key={user._id}
                            user={user}
                            border="border"
                            handleClose={handleClose}
                        />
                    ))
                }
            </div>
        </div >
    )
}

export default Search