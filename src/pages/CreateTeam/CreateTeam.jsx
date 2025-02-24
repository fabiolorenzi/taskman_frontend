import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import Button from "../../components/common/Button.jsx";
import ButtonLink from "../../components/common/ButtonLink.jsx";
import Spinner from "../../components/common/Spinner.jsx";

import "./CreateTeam.scss";

function CreateTeam() {
    const [session, setSession] = useState();
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [team, setTeam] = useState({
        user: 0,
        role: ""
    });
    const [result, setResult] = useState();
    const projectParams = new URLSearchParams(window.location.search).get("projectId") || "";
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
                setIsLoading(false);
            }
        }
    }, [user]);

    const handleChange = e => {
        e.preventDefault();
        setTeam({...team, [e.target.name]: e.target.value});
    };

    const cancelButton = e => {
        e.preventDefault();
        setTeam({
            user: 0,
            role: ""
        });
    };

    const submitButton = e => {
        e.preventDefault();
        fetch(`http://127.0.0.1:8000/api/v1/teams/${session.data.user}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "user": team.user,
                "project": parseInt(projectParams),
                "role": team.role,
                "passcode": localStorage.getItem("passcode")
            })
        })
        .then(resp => resp.json())
        .then(data => setResult(data))
        .catch(err => {
            console.log(err);
            alert("Error. Please try again");
        });
    };

    useEffect(() => {
        if (result) {
            if (result.data) {
                alert(`The team member ${result.data.name} has been added successfully.`);
                navigate(`/project?projectId=${projectParams}`);
            }
        }
    }, [result]);

    return(
        <div className="createTeam">
            <Helmet>
                <title>Taskman | Create team</title>
            </Helmet>
            <div className="createTeam_container">
                {
                    !isLoading ?
                        <Fragment>
                            <div className="createTeam_title">
                                <h1>Create team</h1>
                            </div>
                            <div className="createTeam_returnLink">
                                <ButtonLink
                                    destination={`/project?projectId=${projectParams}`}
                                    text="Return back"
                                    title="Return back"
                                    isReturn
                                />
                            </div>
                            <div className="createTeam_body">
                                <div className="createTeam_inputLineFirst">
                                    <label htmlFor="user">User</label>
                                    <input
                                        type="number"
                                        name="user"
                                        min={0}
                                        value={team.user}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="createTeam_inputLineFirst">
                                    <label htmlFor="role">Role</label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={team.role}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="createTeam_inputLineThird">
                                    <Button func={cancelButton} text="Cancel" isCancel />
                                    <Button func={submitButton} text="Add" isSubmit />
                                </div>
                            </div>
                        </Fragment>
                    : <Spinner />
                }
            </div>
        </div>
    );
};

export default CreateTeam;