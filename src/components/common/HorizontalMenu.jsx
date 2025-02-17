import React from "react";
import { NavLink } from "react-router-dom";
import "./HorizontalMenu.scss";

function HorizontalMenu() {
    return(
        <div className="horizontalMenu">
            <div className="horizontalMenu_container">
                <NavLink to="/" title="Homepage">Homepage</NavLink>
                <NavLink to="/projects" title="Projects">Projects</NavLink>
                <NavLink to="/settings" title="Settings">Settings</NavLink>
            </div>
        </div>
    );
};

export default HorizontalMenu;