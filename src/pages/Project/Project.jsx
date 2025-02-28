import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./Project.scss";

import DeleteSection from "./DeleteSection.jsx";
import ProjectData from "./ProjectData.jsx";
import TeamData from "./TeamData.jsx";
import ButtonLink from "../../components/common/ButtonLink.jsx";
import Spinner from "../../components/common/Spinner.jsx";

function Project() {
    const [session, setSession] = useState();
    const [user, setUser] = useState();
    const [project, setProject] = useState();
    const [teams, setTeams] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const projectParams = new URLSearchParams(window.location.search).get("projectId") || "";
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
                getProject();
                getTeams();
            }
        }
    }, [user]);

    function getProject() {
        fetch(`https://taskman-backend.hopto.org/api/v1/projects/${session.data.user}/${projectParams}`, {
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
        fetch(`https://taskman-backend.hopto.org/api/v1/teams/${session.data.user}`, {
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

    useEffect(() => {
        if (project && teams) {
            if (project.data && teams.data) {
                setIsLoading(false);
            }
        };
    }, [project, teams]);

    return(
        <div className="project">
            <Helmet>
                <title>Taskman | {project ? project.data.name : "..."}</title>
            </Helmet>
            <div className="project_container">
                {
                    !isLoading ?
                        <Fragment>
                            <div className="project_title">
                                <h1>{project.data.name}</h1>
                            </div>
                            <div className="project_body">
                                <div className="project_bodyTitle">
                                    <h2>In here you find all the data of the project {project.data.name}</h2>
                                </div>
                                <div className="project_buttons">
                                    <ButtonLink
                                        destination={"/projects"}
                                        text="Go back"
                                        title="Go back"
                                        isReturn
                                    />
                                    <ButtonLink
                                        destination={`/project-table?projectId=${project.data.id}`}
                                        text="Table"
                                        title="Table"
                                        isGoing
                                    />
                                </div>
                                <div className="project_main">
                                    <ProjectData project={project} user={user} />
                                    <div className="project_mainLower">
                                        <TeamData project={project} user={user} teams={teams} />
                                        <DeleteSection project={project} user={user} />
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    : <Spinner />
                }
            </div>
        </div>
    );
};

export default Project;