import React from "react";

import "./TeamData.scss";

import ButtonLink from "../../components/common/ButtonLink.jsx";

function TeamData({project, user, teams}) {
    return(
        <div className="teamData">
            <div className="teamData_title">
                <h1>This is the team working on this project</h1>
            </div>
            {
                user.data.id == project.data.main_user ?
                    <div className="teamData_buttons">
                        <ButtonLink
                            destination={`/create-team?projectId=${project.data.id}`}
                            text="Add"
                            title="Add"
                            isGoing
                            isSmall
                        />
                    </div>
                : ""
            }
            <div className="teamData_list">
                {
                    teams.data.map(team => {
                        return(
                            <div className="teamData_single" key={"team_" + team.id}>
                                <div className="teamData_singleText">
                                    <p>Id: {team.user}</p>
                                    <p>Role: {team.role}</p>
                                </div>
                                <div className="teamData_singleButtons">
                                    <ButtonLink
                                        destination={`/update-team?projectId=${project.data.id}&teamId=${team.id}`}
                                        text="Update"
                                        title="Update"
                                        isGoing
                                        isSmall
                                    />
                                    <ButtonLink
                                        destination={`/delete-team?projectId=${project.data.id}&teamId=${team.id}`}
                                        text="Delete"
                                        title="Delete"
                                        isReturn
                                        isSmall
                                    />
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default TeamData;