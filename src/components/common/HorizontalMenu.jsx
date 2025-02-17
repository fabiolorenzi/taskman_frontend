import React from "react";
import { NavLink } from "react-router-dom";
import "./HorizontalMenu.scss";

function HorizontalMenu() {
    return(
        <div className="horizontalMenu">
            <div className="horizontalMenu_container">
                <NavLink to="/dashboard" title="Dashboard">Dashboard</NavLink>
                <NavLink to="/projects" title="Projects">Projects</NavLink>
                <NavLink to="/settings" title="Settings">Settings</NavLink>
                <NavLink to="/logout" title="Logout">Logout</NavLink>
            </div>
        </div>
    );
};

export default HorizontalMenu;