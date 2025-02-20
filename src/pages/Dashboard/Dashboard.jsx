import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./Dashboard.scss";

function Dashboard() {
    const [session, setSession] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!localStorage.getItem("passcode")) {
            navigate("/login");
        } else {
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
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (session) {
            if (session?.message) {
                localStorage.removeItem("passcode");
                dispatch(authorize(false));
                navigate("/login");
            } else {
                dispatch(authorize(true));
            }
        }
        // eslint-disable-next-line
    }, [session]);

    return(
        <div className="dashboard">
            <Helmet>
                <title>Taskman | Dashboard</title>
            </Helmet>
            <div className="dashboard_container">
                <div className="dashboard_title">
                    <h1>Dashboard</h1>
                </div>
                <div className="dashboard_body">
                </div>
            </div>
        </div>
    );
};

export default Dashboard;