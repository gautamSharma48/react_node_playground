import React, { useState } from "react";
import DatePickerComponent from "./components/datePickerComponent";
import CustomCheckBox from "./components/checkbox";
import ClickOutside from "./components/clickOutside";

const uiData = [
  {
    name: "date-picker",
  },
  {
    name: "custom-checkbox",
  },
  {
    name: "click-outside",
  },
];

const Main = () => {
  const [value, setValue] = useState();
  return (
    <>
      <div className="">
        {uiData.map(({ name }, index) => (
          <button
            key={index}
            onClick={() => setValue(name)}
            className="border-[red] border-[2px] p-2"
          >
            {name}
          </button>
        ))}
      </div>
      <UIComponents value={value} />
    </>
  );
};

const UIComponents = ({ value }) => {
  return (() => {
    switch (value) {
      case "date-picker":
        return <DatePickerComponent />;
      case "custom-checkbox":
        return <CustomCheckBox />;
        case "click-outside":
          return <ClickOutside />;
      default:
        return null;
    }
  })();
};
export default Main;