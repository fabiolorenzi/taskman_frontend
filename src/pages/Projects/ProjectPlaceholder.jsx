import React from "react";
import { useNavigate } from "react-router-dom";

import "./ProjectPlaceholder.scss";

function ProjectPlaceholder({project, user}) {
    const navigate = useNavigate();
    
    return(
        <div className="projectPlaceholder" onClick={() => navigate(`/project/${project.id}`)}>
            <div className="projectPlaceholder_left">
                <h1>{project.name}</h1>
            </div>
            <div className="projectPlaceholder_right">
                <p>Created at: {project.created_at.substr(0, 10)}</p>
                <p>Role: {project.main_user == user.data.id ? "main" : "other"}</p>
            </div>
        </div>
    );
};

export default ProjectPlaceholder;