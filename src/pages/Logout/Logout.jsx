import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./Logout.scss";

import Spinner from "../../components/common/Spinner.jsx";

function Logout() {
    const [session, setSession] = useState();
    const [user, setUser] = useState();
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
        // eslint-disable-next-line
    }, [session]);

    useEffect(() => {
        if (user) {
            if (user?.message) {
                localStorage.removeItem("passcode");
                dispatch(authorize(false));
                navigate("/login");
            } else {
                dispatch(authorize(true));
                logout();
            }
        }
        // eslint-disable-next-line
    }, [user]);

    function logout() {
        fetch("http://127.0.0.1:8000/api/v1/sessions/single", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "passcode": localStorage.getItem("passcode")
            })
        })
        .then(resp => {
            if (!resp.ok) {
                throw new Error(`Error: ${resp.status} ${resp.statusText}`);
            }
            return resp.text().then(text => text ? JSON.parse(text) : {});
        })
        .then(data => {
            alert("The user logout correctly.");
            dispatch(authorize(false));
            localStorage.removeItem("passcode");
            navigate("/login");
        })
        .catch(err => console.log(err));
    };

    return(
        <div className="logout">
            <Helmet>
                <title>Taskman | Logout</title>
            </Helmet>
            <div className="logout_container">
                <Spinner />
            </div>
        </div>
    );
};

export default Logout;