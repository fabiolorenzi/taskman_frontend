import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authorize } from "../../redux/actions/authorize.js";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./Projects.scss";

import ProjectPlaceholder from "./ProjectPlaceholder.jsx";
import ButtonLink from "../../components/common/ButtonLink.jsx";
import Spinner from "../../components/common/Spinner.jsx";

function Projects() {
    const [session, setSession] = useState();
    const [user, setUser] = useState();
    const [projects, setProjects] = useState();
    const [isLoading, setIsLoading] = useState(true);
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
                getProjects();
            }
        }
    }, [user]);

    function getProjects() {
        fetch(`https://taskman-backend.hopto.org/api/v1/projects/${session.data.user}`, {
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
        .then(data => setProjects(data))
        .catch(err => console.log(err));
    };

    useEffect(() => {
        if (projects) {
            if (projects.data) {
                setIsLoading(false);
            }
        };
    }, [projects]);

    return(
        <div className="projects">
            <Helmet>
                <title>Taskman | Projects</title>
            </Helmet>
            <div className="projects_container">
                {
                    !isLoading ?
                        <Fragment>
                            <div className="projects_title">
                                <h1>Projects</h1>
                            </div>
                            <div className="projects_body">
                                <div className="projects_bodyTitle">
                                    <h2>In here you find all the projects you are in</h2>
                                </div>
                                <div className="projects_newProject">
                                    <ButtonLink
                                        destination="/create-project"
                                        text="Create new project"
                                        title="Create new project"
                                        isGoing
                                    />
                                </div>
                                <div className="projects_projectsList">
                                    {
                                        projects.data.length > 0 ?
                                            projects.data.map(proj => {
                                                return(
                                                    <ProjectPlaceholder key={"project" + proj.id} project={proj} user={user} />
                                                )
                                            })
                                        : <h2>You are currently not part of any project.</h2>
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

export default Projects;