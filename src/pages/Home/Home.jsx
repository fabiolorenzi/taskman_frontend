import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./Home.scss";

import Logo from "../../media/logo.png"

function Home() {
    const [session, setSession] = useState();
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (localStorage.getItem("passcode")) {
            dispatch(authorize(true));
            fetch("http://127.0.0.1:8000/api/v1/sessions/single", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "passcode": localStorage.getItem("passcode")
                })
            })
            .then(resp => resp.json())
            .then(data => setSession(data))
            .catch(err => console.log(err));
        };
    }, []);

    useEffect(() => {
        if (session) {
            if (session?.message) {
                localStorage.removeItem("passcode");
                dispatch(authorize(false));
                navigate("/login");
            } else {
                fetch(`http://127.0.0.1:8000/api/v1/users/${session.data.user}/${session.data.user}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        "passcode": localStorage.getItem("passcode")
                    })
                })
                .then(resp => resp.json())
                .then(data => setUser(data))
                .catch(err => console.log(err));
            }
        }
    }, [session]);

    useEffect(() => {
        if (user) {
            if (user?.message) {
                localStorage.removeItem("passcode");
                dispatch(authorize(false));
                navigate("/login");
            } else {
                dispatch(authorize(true));
            }
        }
    }, [user]);

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