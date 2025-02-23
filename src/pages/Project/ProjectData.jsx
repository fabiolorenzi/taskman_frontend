import React from "react";

import "./ProjectData.scss";

import ButtonLink from "../../components/common/ButtonLink.jsx";

function ProjectData({project, user}) {
    return(
        <div className="projectData">
            <div className="projectData_textSection">
                <div className="projectData_single">
                    <h1>Name:</h1>
                    <p>{project.data.name}</p>
                </div>
                <div className="projectData_single">
                    <h1>Description:</h1>
                    <p>{project.data.description}</p>
                </div>
            </div>
            {
                project.data.main_user == user.data.id ?
                    <div className="projectData_buttons">
                        <ButtonLink
                            destination={`/update-project?projectId=${project.data.id}`}
                            text="Update"
                            title="Update"
                            isGoing
                        />
                    </div>
                : ""
            }
        </div>
    );
};

export default ProjectData;