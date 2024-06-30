import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { Transition, CSSTransition } from "react-transition-group";

const ResizeAndDraggable = () => {
  const [accordin, setShowAccordin] = useState(true);
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

  const defaultStyle = {
    transition: `all 500ms ease-in-out`,
    opacity: 0,
  };
  const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  };

  return (
    <div className="fixed inset-0 h-full w-full">
      <Rnd
        default={{
          x: (window.innerWidth - 200) / 2, //centered resizable div
          y: (window.innerHeight - 200) / 2, // centered resizeable div
          width: 200,
          height: 200,
        }}
        minWidth={200}
        size={{
          height: !accordin ? "0px" : dimensions?.height,
          width: dimensions?.width,
        }}
        minHeight={accordin && 200}
        lockAspectRatio={dimensions.isLockAspectRatio}
        bounds="window"
        enableResizing={{
          top: false,
          right: !dimensions.isLeftRightScale && true,
          bottom: false,
          left: !dimensions.isLeftRightScale && true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        onResize={handleResize}
      >
        <div className="w-full h-full">
          <div className="relative w-full h-full bg-[blue]">
            <button
              className={`${!accordin ? "rotate-90 transition" : "rotate-0 transition"} bg-[red] text-white rounded-lg w-[100px] text-[white] mb-2`}
              onClick={() => setShowAccordin((prev) => !prev)}
            >
              Accordin
            </button>
            <Transition appear in={true} timeout={500}>
              {(status) => (
                <CSSTransition timeout={1000}>
                <div
                className={`box-${status}`}
                  style={{
                    width: "100%",

                    // transform:
                    //   !dimensions.isLeftRightScale &&
                    //   `scale(${Math.min(
                    //     3,
                    //     dimensions.width / 200,
                    //     dimensions.height / 200
                    //   )})`,
                    display: "grid",
                    placeItems: "center",
                    transformOrigin: "center center",
                    ...defaultStyle, ...transitionStyles[status]
                  }}
                >
                  {accordin && (
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
                  )}
                </div>
                </CSSTransition>
              )}
            </Transition>
          </div>
        </div>
      </Rnd>
    </div>
  );
};

export default ResizeAndDraggable;
