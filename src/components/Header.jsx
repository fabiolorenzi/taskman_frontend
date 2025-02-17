import React from "react";
import HorizontalMenu from "./common/HorizontalMenu.jsx"

import "./Header.scss";

function Header() {
    return(
        <div className="header">
            <div className="header_container">
                <HorizontalMenu />
            </div>
        </div>
    );
};

export default Header;