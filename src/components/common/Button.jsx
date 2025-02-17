import React from "react";

import "./Button.scss";

function Button({func, text, isCancel, isSubmit, isWarning}) {
    return(
        <button
            className={`button ${isCancel ? "cancel" : ""} ${isSubmit ? "submit" : ""} ${isWarning ? "warning" : ""}`}
            onClick={func}
        >
            {text}
        </button>
    );
};

export default Button;