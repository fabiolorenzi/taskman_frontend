import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import Button from "../../components/common/Button.jsx";
import ButtonLink from "../../components/common/ButtonLink.jsx";
import Spinner from "../../components/common/Spinner.jsx";

import "./CreateProject.scss";

function CreateProject() {
    const [session, setSession] = useState();
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [projectData, setProjectData] = useState({
        name: "",
        description: ""
    });
    const [result, setResult] = useState();
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
        setProjectData({...projectData, [e.target.name]: e.target.value});
    };

    const cancelButton = e => {
        e.preventDefault();
        setProjectData({
            name: "",
            description: ""
        });
    };

    const submitButton = e => {
        e.preventDefault();
        fetch(`http://127.0.0.1:8000/api/v1/projects/${session.data.user}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "name": projectData.name,
                "description": projectData.description,
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
                alert(`The project ${result.data.name} has been created successfully.`);
                navigate("/projects");
            }
        }
    }, [result]);

    return(
        <div className="createProject">
            <Helmet>
                <title>Taskman | Create project</title>
            </Helmet>
            <div className="createProject_container">
                {
                    !isLoading ?
                        <Fragment>
                            <div className="createProject_title">
                                <h1>Create project</h1>
                            </div>
                            <div className="createProject_returnLink">
                                <ButtonLink
                                    destination="/projects"
                                    text="Return back"
                                    title="Return back"
                                    isReturn
                                />
                            </div>
                            <div className="createProject_body">
                                <div className="createProject_inputLineFirst">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={projectData.name}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="createProject_inputLineFirst">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        name="description"
                                        value={projectData.description}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="createProject_inputLineThird">
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

export default CreateProject;