import React from "react";

import "./TableHeader.scss";

import ButtonLink from "../../components/common/ButtonLink.jsx";

function TableHeader({
    user,
    project,
    iterations,
    selectedIteration,
    setSelectedIteration
}) {
    const selectIteration = e => {
        e.preventDefault();
        if (e.target.value > 0) {
            const tempIteration = iterations.data.find(x => x.id == e.target.value);
            setSelectedIteration(tempIteration);
        };
    };

    return (
        <div className="tableHeader">
            <div className="tableHeader_left">
                <p>{selectedIteration?.title ? "v" + selectedIteration?.version + ": " + selectedIteration?.title : "---------"}</p>
            </div>
            <div className="tableHeader_mid">
                <select onChange={selectIteration}>
                    <option value={0}>-----</option>
                    {
                        iterations.data.map(iter => {
                            return(
                                <option value={iter.id} key={"iterationsSel_" + iter.id}>{iter.version}</option>
                            );
                        })
                    }
                </select>
            </div>
            <div className="tableHeader_right">
                <ButtonLink
                    destination={selectedIteration?.title ? `/update-iteration?projectId=${selectedIteration.project}&iterationId=${selectedIteration.id}` : ""}
                    text="Update"
                    title="Update"
                    isGoing
                    isSmall
                    isDisabled={user.data.id != project.data.main_user || !selectedIteration?.id}
                />
                <ButtonLink
                    destination={selectedIteration?.title ? `/delete-iteration?projectId=${selectedIteration.project}&iterationId=${selectedIteration.id}` : ""}
                    text="Delete"
                    title="Delete"
                    isReturn
                    isSmall
                    isDisabled={user.data.id != project.data.main_user || !selectedIteration?.id}
                />
            </div>
        </div>
    );
};

export default TableHeader;