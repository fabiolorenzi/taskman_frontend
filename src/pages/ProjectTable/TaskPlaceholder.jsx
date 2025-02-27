import React from "react";
import { NavLink } from "react-router-dom";

import "./TaskPlaceholder.scss";

function TaskPlaceholder({
    project,
    task
}) {
    let statusClass = "";
    if (task.status == "new") {
        statusClass = "task_new";
    } else if (task.status == "progress") {
        statusClass = "task_progress";
    } else if (task.status == "finished") {
        statusClass = "task_finished";
    };

    return(
        <NavLink
            className={"taskPlaceholder " + statusClass}
            to={`/task?projectId=${project.data.id}&taskId=${task.id}`}
        >
            <div className="taskPlaceholder_body">
                <p className="taskPlaceholder_number">N{task.number}</p>
                <p className="taskPlaceholder_title">{task.title}</p>
                <p className="taskPlaceholder_type">Type: {task.type}</p>
                <p className="taskPlaceholder_user">User: {task.user}</p>
                <p className="taskPlaceholder_status">Status: {task.status}</p>
            </div>
        </NavLink>
    );
};

export default TaskPlaceholder