import React from "react";
import { NavLink } from "react-router-dom";

import "./ButtonLink.scss";

function ButtonLink({
    destination, 
    text, 
    title,
    isGoing,
    isReturn,
    isSmall,
    isDisabled
}) {
    return(
        !isDisabled ?
            <NavLink
                to={destination}
                className={`${isSmall ? "buttonLink_small" : "buttonLink"} ${isGoing ? "normal" : ""} ${isReturn ? "warning" : ""}`}
                title={title}
            >
                {text}
            </NavLink>
        :
            <div className={`${isSmall ? "buttonLink_small_dis" : "buttonLink_dis"} ${isGoing ? "normal_dis" : ""} ${isReturn ? "warning_dis" : ""}`}>
                {title}
            </div>
    );
};

export default ButtonLink;