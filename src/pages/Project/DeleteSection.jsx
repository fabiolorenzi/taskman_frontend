import React, { useState } from "react";

import "./DeleteSection.scss";

import ButtonLink from "../../components/common/ButtonLink.jsx";

function DeleteSection({project, user}) {
    const [projectName, setProjectName] = useState("");

    const handleChange = e => {
        e.preventDefault();
        setProjectName(e.target.value);
    };

    return(
        <div className="deleteSection">
            <div className="deleteSection_title">
                <h1>In here you can delete the project</h1>
            </div>
            <div className="deleteSection_inputs">
                <label htmlFor="projectName">Project name</label>
                <input
                    type="text"
                    name="projectName"
                    value={projectName}
                    onChange={handleChange}
                    disabled={user.data.id != project.data.main_user}
                    autoComplete="off"
                />
            </div>
            <div className="deleteSection_buttons">
                <ButtonLink
                    destination={`/delete-project?projectId=${project.data.id}`}
                    text="Delete"
                    title="Delete"
                    isGoing
                    isSmall
                    isDisabled={user.data.id != project.data.main_user || project.data.name != projectName}
                />
            </div>
        </div>
    );
};

export default DeleteSection;