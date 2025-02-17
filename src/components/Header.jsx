import React from "react";
import HorizontalMenu from "./common/HorizontalMenu.jsx";
import UnsignedMenu from "./common/UnsignedMenu.jsx";

import "./Header.scss";

function Header() {
    let value = false;
    return(
        <div className="header">
            <div className="header_container">
                {
                    value ?
                        <HorizontalMenu />
                    :
                        <UnsignedMenu />
                }
            </div>
        </div>
    );
};

export default Header;