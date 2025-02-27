import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./ProjectTable.scss";

import TableHeader from "./TableHeader.jsx";
import TasksList from "./TasksList.jsx";
import NewTaskBar from "./NewTaskBar.jsx";
import ButtonLink from "../../components/common/ButtonLink.jsx";
import Spinner from "../../components/common/Spinner.jsx";

function ProjectTable() {
    const [session, setSession] = useState();
    const [user, setUser] = useState();
    const [project, setProject] = useState();
    const [teams, setTeams] = useState();
    const [iterations, setIterations] = useState();
    const [selectedIteration, setSelectedIteration] = useState({});
    const [tasks, setTasks] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [areTasksLoading, setAreTasksLoading] = useState(false);
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
                getTeams();
                getIterations();
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

    function getIterations() {
        fetch(`http://127.0.0.1:8000/api/v1/iterations/${session.data.user}?project=${projectParams}`, {
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
        .then(data => setIterations(data))
        .catch(err => console.log(err));
    };

    function getTasks() {
        fetch(`http://127.0.0.1:8000/api/v1/tasks/${session.data.user}?project=${projectParams}&iteration=${selectedIteration}`, {
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

    useEffect(() => {
        if (project && teams && iterations) {
            if (project.data && teams.data && iterations.data) {
                setIsLoading(false);
            }
        };
    }, [project, teams, iterations]);

    useEffect(() => {
        if (selectedIteration) {
            if (selectedIteration.id > 0) {
                setAreTasksLoading(true);
                getTasks();
            }
        };
    }, [selectedIteration]);

    useEffect(() => {
        if (tasks) {
            if (tasks.data) {
                setAreTasksLoading(false);
            }
        };
    }, [tasks]);

    return(
        <div className="projectTable">
            <Helmet>
                <title>Taskman | {project ? project.data.name + " table" : "..."}</title>
            </Helmet>
            <div className="projectTable_container">
                {
                    !isLoading ?
                        <Fragment>
                            <div className="projectTable_title">
                                <h1>{project.data.name} table</h1>
                            </div>
                            <div className="projectTable_body">
                                <div className="projectTable_buttons">
                                    <ButtonLink
                                        destination={`/project?projectId=${project.data.id}`}
                                        text="Go back"
                                        title="Go back"
                                        isReturn
                                    />
                                    <ButtonLink
                                        destination={`/create-iteration?projectId=${project.data.id}`}
                                        text="New"
                                        title="New"
                                        isGoing
                                    />
                                </div>
                                <div className="projectTable_main">
                                    {
                                        iterations.data.length > 0 ?
                                            <Fragment>
                                                <div className="projectTable_table">
                                                    <TableHeader
                                                        user={user}
                                                        project={project}
                                                        iterations={iterations}
                                                        selectedIteration={selectedIteration}
                                                        setSelectedIteration={setSelectedIteration}
                                                    />
                                                    <NewTaskBar
                                                        project={project}
                                                        selectedIteration={selectedIteration}
                                                    />
                                                    <TasksList
                                                        project={project}
                                                        tasks={tasks}
                                                        areTasksLoading={areTasksLoading}
                                                    />
                                                </div>
                                            </Fragment>
                                        : <h2>You are currently no tasks in this project.</h2>
                                    }
                                </div>
                            </div>
                        </Fragment>
                    : <Spinner />
                }
            </div>
        </div>
    );
};

export default ProjectTable;