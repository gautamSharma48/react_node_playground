import React from "react";

const CheckBox = () => {
  return (
    <div className="">
      <h1>CheckBox</h1>
      <label className="checkbox-container">
        <input name="consentCheckBox" id={"consentCheckBox"} type="checkbox" />
        <span className="checkmark"></span>
      </label>
    </div>
  );
};

export default CheckBox;
