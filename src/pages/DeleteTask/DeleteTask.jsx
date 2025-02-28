import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./DeleteTask.scss";

import Spinner from "../../components/common/Spinner.jsx";

function DeleteTask() {
    const [session, setSession] = useState();
    const [user, setUser] = useState();
    const projectParams = new URLSearchParams(window.location.search).get("projectId") || "";
    const taskParams = new URLSearchParams(window.location.search).get("taskId") || "";
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!localStorage.getItem("passcode")) {
            navigate("/login");
        } else {
            fetch("https://taskman-backend.hopto.org/api/v1/sessions/single", {
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
                fetch(`https://taskman-backend.hopto.org/api/v1/users/${session.data.user}/${session.data.user}`, {
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
                deleteTask();
            }
        }
    }, [user]);

    function deleteTask() {
        fetch(`https://taskman-backend.hopto.org/api/v1/tasks/${user.data.id}/${taskParams}`, {
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
            alert("The task has been removed correctly.");
            navigate(`/project-table?projectId=${projectParams}`);
        })
        .catch(err => console.log(err));
    };

    return(
        <div className="deleteTask">
            <Helmet>
                <title>Taskman | Delete task</title>
            </Helmet>
            <div className="deleteTask_container">
                <Spinner />
            </div>
        </div>
    );
};

export default DeleteTask;