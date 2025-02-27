import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import Button from "../../components/common/Button.jsx";
import ButtonLink from "../../components/common/ButtonLink.jsx";
import Spinner from "../../components/common/Spinner.jsx";

import "./CreateTask.scss";

function CreateTask() {
    const [session, setSession] = useState();
    const [user, setUser] = useState();
    const [project, setProject] = useState();
    const [iteration, setIteration] = useState();
    const [tasks, setTasks] = useState();
    const [teams, setTeams] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: 1
    });
    const [selectedType, setSelectedType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedUser, setSelectedUser] = useState(0);
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
                getTasks();
                getTeams();
            }
        }
    }, [project]);

    useEffect(() => {
        if (iteration && tasks && teams) {
            if (iteration?.message || tasks?.message || teams?.messagee) {
                navigate(`/project?projectId=${projectParams}`);
            } else {
                setIsLoading(false);
            }
        };
    }, [iteration, tasks, teams]);

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
        .then(data => setIteration(data))
        .catch(err => console.log(err));
    };

    function getTasks() {
        fetch(`http://127.0.0.1:8000/api/v1/tasks/${session.data.user}?project=${projectParams}&iteration=${iterationParams}`, {
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
        .then(data => setTasks(data))
        .catch(err => console.log(err));
    };

    function getTeams() {
        fetch(`http://127.0.0.1:8000/api/v1/teams/${session.data.user}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "project": parseInt(projectParams),
                "passcode": localStorage.getItem("passcode")
            })
        })
        .then(resp => resp.json())
        .then(data => setTeams(data))
        .catch(err => console.log(err));
    };

    const handleChange = e => {
        e.preventDefault();
        setTaskData({...taskData, [e.target.name]: e.target.value});
    };

    const handleStatus = e => {
        e.preventDefault();
        setSelectedStatus(e.target.value);
    };

    const handleType = e => {
        e.preventDefault();
        if (e.target.value != "-----") {
            setSelectedType(e.target.value);
        };
    };

    const handleUser = e => {
        e.preventDefault();
        if (e.target.value) {
            setSelectedUser(e.target.value);
        };
    };

    const cancelButton = e => {
        e.preventDefault();
        setTaskData({
            title: "",
            description: "",
            priority: 1
        });
        setSelectedStatus("New");
        setSelectedType("-----");
        setSelectedUser(0);
    };

    const submitButton = e => {
        e.preventDefault();
        fetch(`http://127.0.0.1:8000/api/v1/tasks/${session.data.user}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "number": tasks.data.length + 1,
                "title": taskData.title,
                "description": taskData.description,
                "type": selectedType,
                "priority": taskData.priority,
                "status": selectedStatus,
                "project": parseInt(projectParams),
                "user": selectedUser,
                "iteration": parseInt(iterationParams),
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
                alert(`The task N${result.data.number} has been created successfully.`);
                navigate(`/project-table?projectId=${project.data.id}`);
            }
        }
    }, [result]);

    return(
        <div className="createTask">
            <Helmet>
                <title>Taskman | Create task</title>
            </Helmet>
            <div className="createTask_container">
                {
                    !isLoading ?
                        <Fragment>
                            <div className="createTask_title">
                                <h1>Create task</h1>
                            </div>
                            <div className="createTask_returnLink">
                                <ButtonLink
                                    destination={`/project-table?projectId=${project.data.id}`}
                                    text="Return back"
                                    title="Return back"
                                    isReturn
                                />
                            </div>
                            <div className="createTask_body">
                                <div className="createTask_inputLineFirst">
                                    <label htmlFor="title">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={taskData.title}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="createTask_inputLineFirst">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        name="description"
                                        value={taskData.description}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="createTask_inputLineFirst">
                                    <label htmlFor="type">Type</label>
                                    <select onChange={handleType}>
                                        <option value="-----">-----</option>
                                        <option value="task">Task</option>
                                        <option value="bug">Bug</option>
                                    </select>
                                </div>
                                <div className="createTask_inputLineFirst">
                                    <label htmlFor="priority">Priority</label>
                                    <input
                                        type="number"
                                        name="priority"
                                        value={taskData.priority}
                                        min={1}
                                        max={5}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="createTask_inputLineFirst">
                                    <label htmlFor="status">Status</label>
                                    <select onChange={handleStatus}>
                                        <option value="new">New</option>
                                        <option value="progress">Progress</option>
                                        <option value="finished">Finished</option>
                                    </select>
                                </div>
                                <div className="createTask_inputLineFirst">
                                    <label htmlFor="user">user</label>
                                    <select onChange={handleUser}>
                                        <option value={0} key="user_0">0: none</option>
                                        {
                                            teams.data.map(u => {
                                                return(
                                                    <option value={u.id} key={`user_${u.id}`}>{u.id}: {u.role}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="createTask_inputLineThird">
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

export default CreateTask;