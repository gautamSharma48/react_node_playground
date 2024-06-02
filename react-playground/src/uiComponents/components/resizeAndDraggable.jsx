import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

const ResizeAndDraggable = () => {
  const [dimensions, setDimensions] = useState({
    width: 200,
    height: 200,
    isLockAspectRatio: false,
    isLeftRightScale: false,
  });


  const handleResize = (e, direction, elementRef, delta, position) => {
    const { offsetWidth, offsetHeight } = elementRef;
    setDimensions((prevDimensions) => ({
      ...prevDimensions,
      width: offsetWidth,
      height: offsetHeight,
      isLeftRightScale: direction === "left" || direction === "right",
      isLockAspectRatio:
        direction === "topLeft" ||
        direction === "topRight" ||
        direction === "bottomLeft" ||
        direction === "bottomRight",
    }));
  };

  return (
    <div className="fixed inset-0 h-full w-full">
      <Rnd
        default={{
          x: (window.innerWidth -200)/2,  //centered resizable div
          y: (window.innerHeight -200)/ 2, // centered resizeable div
          width: 200,
          height: 200,
        }}
        minWidth={200}
        minHeight={200}
        lockAspectRatio={dimensions.isLockAspectRatio}
        bounds="parent"
        enableResizing={{
          top: false,
          right:  !dimensions.isLeftRightScale && true,
          bottom: false,
          left:  !dimensions.isLeftRightScale && true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        onResize={handleResize}
      >
        <div className="w-full h-full">
          <div className="relative w-full h-full bg-[blue]">
            <div
              style={{
                width: "100%",
                height: "100%",
                transform:
                  !dimensions.isLeftRightScale &&
                  `scale(${Math.min(
                    3,
                    dimensions.width / 200,
                    dimensions.height / 200
                  )})`,
                display: "grid",
                placeItems: "center",
                transformOrigin: "center center",
              }}
            >
              <div
                className={`${
                  !dimensions.isLeftRightScale && "max-w-[167px]"
                } w-full`}
              >
                <div className="checkListFirstTxt">
                  <span>sadadaSas</span>
                </div>
                <div className="w-full h-[90px] bg-[yellow]" />
              </div>
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default ResizeAndDraggable;
