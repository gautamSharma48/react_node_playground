import React from "react";

const SharedAndAssigned = () => {
  return (
    <>
      <div className="box">
        <SharedAndAssignedTask />
      </div>
    </>
  );
};

const SharedAndAssignedTask = () => {
  const isSharedActive = true;
  const isAssignedActive = true;
  return (
    <div style={{ position: "relative" }}>
      {isSharedActive && (
        <>
          <img
            className="assigned-image-0"
            alt=""
            src="./shared/shared-bg.svg"
          />
          <img
            className="assigned-image-3"
            alt=""
            src="./shared/shared-left.svg"
          />
          <img
            className="assigned-image-2"
            alt=""
            src="./shared/shared-mid.svg"
          />
          <img
            className="shared-image-right"
            alt=""
            src="./shared/shared-right.svg"
          />

          <b className="assigned-text">Shared by Maris</b>
        </>
      )}
      {isAssignedActive && (
        <>
          <img
            style={{ left: isSharedActive && "185px" }}
            className={"assigned-image-0"}
            alt=""
            src="./assigned-bg.svg"
          />
          <img
            style={{ left: isSharedActive && "255px" }}
            className={"assigned-image-1"}
            alt=""
            src="./assigned-right.svg"
          />
          <img
            style={{ left: isSharedActive && "191px" }}
            className={"assigned-image-2"}
            alt=""
            src="./assigned-mid.svg"
          />
          <img
            style={{ left: isSharedActive && "183px" }}
            className={"assigned-image-3"}
            alt=""
            src="./assigned-left.svg"
          />
          <b
            style={{ left: isSharedActive && "209px" }}
            className="assigned-text"
          >
            Assigned
          </b>
        </>
      )}
    </div>
  );
};
export default SharedAndAssigned;
