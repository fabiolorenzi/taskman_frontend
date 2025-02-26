import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import Button from "../../components/common/Button.jsx";
import ButtonLink from "../../components/common/ButtonLink.jsx";
import Spinner from "../../components/common/Spinner.jsx";

import "./UpdateIteration.scss";

function UpdateIteration() {
    const [session, setSession] = useState();
    const [user, setUser] = useState();
    const [project, setProject] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [initialIteration, setInitialIteration] = useState();
    const [iterationData, setIterationData] = useState({
        version: "",
        title: "",
        description: "",
        start_date: new Date(),
        end_date: new Date()
    });
    const [result, setResult] = useState();
    const projectParams = new URLSearchParams(window.location.search).get("projectId") || "";
    const iterationParams = new URLSearchParams(window.location.search).get("iterationId") || "";
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
                getProject();
            }
        }
    }, [user]);

    function getProject() {
        fetch(`http://127.0.0.1:8000/api/v1/projects/${session.data.user}/${projectParams}`, {
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
        .then(data => setProject(data))
        .catch(err => console.log(err));
    };

    useEffect(() => {
        if (project) {
            if (project?.message) {
                navigate("/projects");
            } else {
                getIteration();
            }
        }
    }, [project]);

    function getIteration() {
        fetch(`http://127.0.0.1:8000/api/v1/iterations/${session.data.user}/${iterationParams}`, {
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
        .then(data => setInitialIteration(data))
        .catch(err => console.log(err));
    };

    useEffect(() => {
        if (initialIteration) {
            if (initialIteration?.message) {
                navigate(`/project-table?projectId=${project.data.id}`);
            } else {
                setIterationData(initialIteration.data);
                setIsLoading(false);
            }
        }
    }, [initialIteration]);

    const handleChange = e => {
        e.preventDefault();
        setIterationData({...iterationData, [e.target.name]: e.target.value});
    };

    const cancelButton = e => {
        e.preventDefault();
        setIterationData({
            version: initialIteration.data.version,
            title: initialIteration.data.title,
            description: initialIteration.data.description,
            start_date: initialIteration.data.start_date,
            end_date: initialIteration.data.end_date
        });
    };

    const submitButton = e => {
        e.preventDefault();
        fetch(`http://127.0.0.1:8000/api/v1/iterations/${session.data.user}/${iterationParams}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "project": parseInt(projectParams),
                "version": iterationData.version,
                "title": iterationData.title,
                "description": iterationData.description,
                "start_date": iterationData.start_date,
                "end_date": iterationData.end_date,
                "updated_by": session.data.user,
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
                alert(`The iteration ${result.data.version} has been updated successfully.`);
                navigate(`/project-table?projectId=${project.data.id}`);
            }
        }
    }, [result]);

    return(
        <div className="createIteration">
            <Helmet>
                <title>Taskman | Create iteration</title>
            </Helmet>
            <div className="createIteration_container">
                {
                    !isLoading ?
                        <Fragment>
                            <div className="createIteration_title">
                                <h1>Create iteration</h1>
                            </div>
                            <div className="createIteration_returnLink">
                                <ButtonLink
                                    destination={`/project-table?projectId=${project.data.id}`}
                                    text="Return back"
                                    title="Return back"
                                    isReturn
                                />
                            </div>
                            <div className="createIteration_body">
                                <div className="createIteration_inputLineFirst">
                                    <label htmlFor="version">Version</label>
                                    <input
                                        type="text"
                                        name="version"
                                        value={iterationData.version}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="createIteration_inputLineFirst">
                                    <label htmlFor="title">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={iterationData.title}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="createIteration_inputLineFirst">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        name="description"
                                        value={iterationData.description}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="createIteration_inputLineFirst">
                                    <label htmlFor="start_date">Start date</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={iterationData.start_date}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="createIteration_inputLineFirst">
                                    <label htmlFor="end_date">End date</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={iterationData.end_date}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="createIteration_inputLineThird">
                                    <Button func={cancelButton} text="Cancel" isCancel />
                                    <Button func={submitButton} text="Submit" isSubmit />
                                </div>
                            </div>
                        </Fragment>
                    : <Spinner />
                }
            </div>
        </div>
    );
};

export default UpdateIteration;