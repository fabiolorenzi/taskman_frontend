import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import "./Home.scss";

function Home() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return(
        <div className="home">
            <Helmet>
                <title>Taskman | Homepage</title>
            </Helmet>
            <div className="home_container">
                <div className="home_body">
                </div>
            </div>
        </div>
    );
};

export default Home;