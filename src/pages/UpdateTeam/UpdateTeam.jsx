import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import Button from "../../components/common/Button.jsx";
import ButtonLink from "../../components/common/ButtonLink.jsx";
import Spinner from "../../components/common/Spinner.jsx";

import "./UpdateTeam.scss";

function UpdateTeam() {
    const [session, setSession] = useState();
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [initialTeam, setInitialTeam] = useState();
    const [team, setTeam] = useState({
        id: 0,
        user: 0,
        project: 0,
        role: ""
    });
    const [result, setResult] = useState();
    const projectParams = new URLSearchParams(window.location.search).get("projectId") || "";
    const teamParams = new URLSearchParams(window.location.search).get("teamId") || "";
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
                getTeam();
            }
        }
    }, [user]);

    function getTeam() {
        fetch(`https://taskman-backend.hopto.org/api/v1/teams/${session.data.user}/${teamParams}`, {
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
        .then(data => setInitialTeam(data))
        .catch(err => console.log(err));
    };

    useEffect(() => {
        if (initialTeam) {
            if (initialTeam.data) {
                setTeam({
                    id: initialTeam.data.id,
                    user: initialTeam.data.user,
                    role: initialTeam.data.role
                });
                setIsLoading(false);
            }
        }
    }, [initialTeam]);

    const handleChange = e => {
        e.preventDefault();
        setTeam({...team, [e.target.name]: e.target.value});
    };

    const cancelButton = e => {
        e.preventDefault();
        setTeam({
            id: initialTeam.data.id,
            user: initialTeam.data.user,
            role: initialTeam.data.role
        });
    };

    const updateButton = e => {
        e.preventDefault();
        fetch(`https://taskman-backend.hopto.org/api/v1/teams/${session.data.user}/${team.id}`, {
            method: "PUT",
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
                alert(`The team member ${result.data.id} has been updated successfully.`);
                navigate(`/project?projectId=${result.data.project}`);
            }
        }
    }, [result]);

    return(
        <div className="updateTeam">
            <Helmet>
                <title>Taskman | Update team</title>
            </Helmet>
            <div className="updateTeam_container">
                {
                    !isLoading ?
                        <Fragment>
                            <div className="updateTeam_title">
                                <h1>Update team</h1>
                            </div>
                            <div className="updateTeam_returnLink">
                                <ButtonLink
                                    destination={`/project?projectId=${initialTeam.data.project}`}
                                    text="Return back"
                                    title="Return back"
                                    isReturn
                                />
                            </div>
                            <div className="updateTeam_body">
                                <div className="updateTeam_inputLineFirst">
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
                                <div className="updateTeam_inputLineFirst">
                                    <label htmlFor="role">Role</label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={team.role}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="updateTeam_inputLineThird">
                                    <Button func={cancelButton} text="Cancel" isCancel />
                                    <Button func={updateButton} text="Update" isSubmit />
                                </div>
                            </div>
                        </Fragment>
                    : <Spinner />
                }
            </div>
        </div>
    );
};

export default UpdateTeam;