import React from "react";
import { useSelector } from "react-redux";

import HorizontalMenu from "./common/HorizontalMenu.jsx";
import UnsignedMenu from "./common/UnsignedMenu.jsx";

import "./Header.scss";

function Header() {
    const userAuthorized = useSelector(state => state.authorize);

    return(
        <div className="header">
            <div className="header_container">
                {
                    userAuthorized ?
                        <HorizontalMenu />
                    :
                        <UnsignedMenu />
                }
            </div>
        </div>
    );
};

export default Header;