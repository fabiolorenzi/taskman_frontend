import React from "react";

import "./TasksList.scss";

import TaskPlaceholder from "./TaskPlaceholder.jsx";
import Spinner from "../../components/common/Spinner.jsx";

function TasksList({
    project,
    tasks,
    areTasksLoading,
    iteration
}) {
    return(
        <div className="tasksList">
            {
                !areTasksLoading ?
                    tasks && tasks?.data.length > 0 ?
                        tasks?.data.map(t => {
                            return(
                                <TaskPlaceholder
                                    project={project}
                                    task={t}
                                    key={`task_${t.id}`}
                                />
                            );
                        })
                    : <h2>{iteration == 0 ? "Please select an iteration" : "There are no tasks for this iteration"}</h2>
                : <Spinner />
            }
        </div>
    );
};

export default TasksList;