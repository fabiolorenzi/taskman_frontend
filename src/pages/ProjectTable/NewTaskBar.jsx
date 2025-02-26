import React from "react";

import "./NewTaskBar.scss";

import ButtonLink from "../../components/common/ButtonLink.jsx";

function NewTaskBar({
    project,
    selectedIteration
}) {
    return(
        <div className="newTaskBar">
            <div className="newTaskBar_body">
                <ButtonLink
                    destination={`/create-task?projectId=${project.data.id}&iterationId=${selectedIteration?.id}`}
                    text="Add task"
                    title="Add task"
                    isGoing
                    isSmall
                    isDisabled={!selectedIteration?.id}
                />
            </div>
        </div>
    );
};

export default NewTaskBar;