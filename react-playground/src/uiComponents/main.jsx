import React, { useState } from "react";
import DatePickerComponent from "./components/datePickerComponent";
import CustomCheckBox from "./components/checkbox";
import ClickOutside from "./components/clickOutside";
import LinearProgress from "./components/linearProgress";
import DraggableComponent from "./components/draggable";
import ResizeAndDraggable from "./components/resizeAndDraggable";
import NotificationButton from "./components/notificationButton";
import ChangeOrderWithDraggable from "./components/changeOrderWithDraggable";


const uiData = [
  {
    name: "date-picker",
    Component: DatePickerComponent,
  },
  {
    name: "custom-checkbox",
    Component: CustomCheckBox,
  },
  {
    name: "click-outside",
    Component: ClickOutside,
  },
  {
    name: "linear-progress",
    Component: LinearProgress,
  },
  {
    name: "react-draggable",
    Component: DraggableComponent,
  },
  {
    name: "react-resize-draggable",
    Component: ResizeAndDraggable,
  },
  {
    name: "notification-button",
    Component: NotificationButton,
  },
  
  {
    name: "draggable-with-change-order",
    Component: ChangeOrderWithDraggable,
  },
];

const Main = () => {
  const [value, setValue] = useState("");
  return (
    <>
      <div className="overflow-y-auto h-screen w-full">
        {uiData.map(({ name, Component }, index) => (
          <div className="grid" key={index}>
            <button
              key={index}
              onClick={() => setValue(name)}
              className="border-[red] border-[2px] p-2"
            >
              {name}
            </button>
            {value === name && (
              <div>
                <Component />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};



export default Main;
