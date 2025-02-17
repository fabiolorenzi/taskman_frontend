import React, { Fragment, useEffect } from "react";
import { Helmet } from "react-helmet";

import "./Error.scss";

import ButtonLink from "../../components/ButtonLink.jsx";

function Error() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return(
        <div className="errorPage">
            <Helmet>
                <title>Taskman | Error</title>
            </Helmet>
            <div className="errorPage_container">            
                <Fragment>
                    <div className="errorPage_title">
                        <h1>Error</h1>
                    </div>
                    <div className="errorPage_text">
                        <p>Page not found, please go back to the homepage.</p>
                    </div>
                    <div className="errorPage_buttonSection">
                        <ButtonLink
                            destination="/"
                            text="Homepage"
                            title="Homepage"
                            isGoing
                        /> 
                    </div>
                </Fragment>
            </div>
        </div>
    );
};

export default Error;