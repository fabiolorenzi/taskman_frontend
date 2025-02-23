import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import Button from "../../components/common/Button.jsx";
import ButtonLink from "../../components/common/ButtonLink.jsx";
import Spinner from "../../components/common/Spinner.jsx";

import "./UpdateProject.scss";

function UpdateProject() {
    const [session, setSession] = useState();
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [initialProject, setInitialProject] = useState();
    const [projectData, setProjectData] = useState({
        id: 0,
        name: "",
        main_user: 0,
        description: ""
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
        .then(data => setInitialProject(data))
        .catch(err => console.log(err));
    };

    useEffect(() => {
        if (initialProject) {
            if (initialProject.data) {
                setProjectData({
                    id: initialProject.data.id,
                    name: initialProject.data.name,
                    main_user: initialProject.data.main_user,
                    description: initialProject.data.description
                });
                setIsLoading(false);
            }
        }
    }, [initialProject]);

    const handleChange = e => {
        e.preventDefault();
        setProjectData({...projectData, [e.target.name]: e.target.value});
    };

    const cancelButton = e => {
        e.preventDefault();
        setProjectData({
            id: initialProject.data.id,
            name: initialProject.data.name,
            main_user: initialProject.data.main_user,
            description: initialProject.data.description
        });
    };

    const updateButton = e => {
        e.preventDefault();
        fetch(`http://127.0.0.1:8000/api/v1/projects/${session.data.user}/${projectData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "name": projectData.name,
                "description": projectData.description,
                "main_user": projectData.main_user,
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
                alert(`The project ${result.data.name} has been updated successfully.`);
                navigate(`/project?projectId=${projectData.id}`);
            }
        }
    }, [result]);

    return(
        <div className="updateProject">
            <Helmet>
                <title>Taskman | Update project</title>
            </Helmet>
            <div className="updateProject_container">
                {
                    !isLoading ?
                        <Fragment>
                            <div className="updateProject_title">
                                <h1>Create project</h1>
                            </div>
                            <div className="updateProject_returnLink">
                                <ButtonLink
                                    destination={`/project?projectId=${projectData.id}`}
                                    text="Return back"
                                    title="Return back"
                                    isReturn
                                />
                            </div>
                            <div className="updateProject_body">
                                <div className="updateProject_inputLineFirst">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={projectData.name}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="updateProject_inputLineFirst">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        name="description"
                                        value={projectData.description}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="updateProject_inputLineThird">
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

export default UpdateProject;