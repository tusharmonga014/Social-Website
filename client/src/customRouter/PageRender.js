import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import Login from "../pages/login";

const generatePage = (pageName) => {
    const page = () => require(`../pages/${pageName}`).default;

    try {
        return React.createElement(page());
    } catch (error) {
        return (<NotFound />);
    }
}

const PageRender = () => {
    const { page, id } = useParams();

    const { auth } = useSelector(state => state);
    let pageName = "";

    if (id) {
        pageName = `${page}/[id]`;
    } else {
        pageName = `${page}`;
    }

    if (auth.token) return generatePage(pageName);
    else return (<Login />);
}

export default PageRender;