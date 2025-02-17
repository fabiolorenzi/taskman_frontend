import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import "./Home.scss";

import Logo from "../../media/logo.png"

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
                    <div className="home_top">
                        <div className="home_title">
                            <h1>Taskman</h1>
                        </div>
                        <div className="home_underTitle">
                            <h2>Manage easily your projects</h2>
                        </div>
                    </div>
                    <div className="home_bottom">
                        <div className="home_bottomBody">
                            <div className="home_bottomText">
                                <p>Using Taskman, you can organize every task for your team. Work faster, work better, work smarter!</p>
                            </div>
                            <div className="home_bottomImage">
                                <img src={Logo} alt="userImage" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;