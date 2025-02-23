import React from "react";
import { NavLink } from "react-router-dom";

import "./ButtonLink.scss";

function ButtonLink({
    destination, 
    text, 
    title,
    isGoing,
    isReturn,
    isSmall
}) {
    return(
        <NavLink
            to={destination}
            className={`${isSmall ? "buttonLink_small" : "buttonLink"} ${isGoing ? "normal" : ""} ${isReturn ? "warning" : ""}`}
            title={title}
        >
            {text}
        </NavLink>
    );
};

export default ButtonLink;