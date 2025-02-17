import React from "react";
import { NavLink } from "react-router-dom";
import "./UnsignedMenu.scss";

function UnsignedMenu() {
    return(
        <div className="unsignedMenu">
            <div className="unsignedMenu_container">
                <NavLink to="/" title="Homepage">Homepage</NavLink>
                <NavLink to="/signin" title="Signin">Signin</NavLink>
                <NavLink to="/login" title="Login">Login</NavLink>
            </div>
        </div>
    );
};

export default UnsignedMenu;