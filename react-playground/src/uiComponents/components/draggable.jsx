import React, { useRef } from "react";
import Drag from "react-draggable";

const DraggableComponent = () => {
  const draggerRef = useRef(null);

  const handleDrag = (e, ui) => {
    // Custom logic to stop dragging when the component reaches the window bounds
    const { x, y } = ui.deltaX > 0 ? ui : { x: 0, y: 0 };
    const { clientWidth, clientHeight } = document.documentElement;
    const { offsetWidth, offsetHeight } = draggerRef.current;

    if (x < 0 || y < 0 || x + offsetWidth > clientWidth || y + offsetHeight > clientHeight) {
      // Stop dragging if the component reaches the window bounds
      return false;
    }
  };

  return (
    <Drag
   
      onDrag={handleDrag}
      axis="both"
      position={null}
      grid={[25, 25]}
      scale={1}
      bounds={true}
    >
      <div    ref={draggerRef}   className="fixed w-full h-full inset-0 flex justify-center items-center">
        <div className=" w-[100px] h-[100px] bg-[grey]"></div>
      </div>
    </Drag>
  );
};

export default DraggableComponent;
