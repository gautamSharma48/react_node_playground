import { Button, Dropdown, Menu } from "antd";
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
// import 'antd/dist/';

const CanvasContainer = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Image = styled.img`
  background-color: yellow;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  height: 800px;
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  margin-bottom: 30px;
  background-color: red;
`;

const ImageHighlighter = ({ imageUrl, pageId, bookId }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [rectangles, setRectangles] = useState([]);
  const [newRect, setNewRect] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    localStorage.getItem("selectedColor") || "#50e3c2"
  );
  const [strokeWidth, setStrokeWidth] = useState(
    Number(localStorage.getItem("strokeWidth")) || 2
  );
  const [opacity, setOpacity] = useState(
    Number(localStorage.getItem("opacity")) || 0.4
  );
  const [naturalDimensions, setNaturalDimensions] = useState({
    width: 1,
    height: 1,
  });
  const [isHighlighterMode, setIsHighlighterMode] = useState(
    localStorage.getItem("isHighlighterMode") === "true"
  );
  const [isAnnotationsVisible, setIsAnnotationsVisible] = useState(true);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [hoveredRectIndex, setHoveredRectIndex] = useState(null);
  const [highlights, setHighlights] = useState({});
  const [is_image_loaded, setIsImageLoaded] = useState(false);
  const [enableHighLighterEditMode, setEnableHighLighterEditMode] =
    useState(true);
  const [bookData, setBookData] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);

  // console.log(ebook_highlights)

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      if (canvas && image) {
        canvas.width = image.clientWidth;
        canvas.height = image.clientHeight;
        redrawCanvas();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [rectangles, isAnnotationsVisible]);

  const getRelativePosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * naturalDimensions.width,
      y: ((event.clientY - rect.top) / rect.height) * naturalDimensions.height,
    };
  };

  const getTouchRelativePosition = (touch) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((touch.clientX - rect.left) / rect.width) * naturalDimensions.width,
      y: ((touch.clientY - rect.top) / rect.height) * naturalDimensions.height,
    };
  };

  const disableScroll = () => {
    if (window.innerWidth < 800) {
      document.body.style.overflow = "hidden";
    }
  };

  const enableScroll = () => {
    if (window.innerWidth < 800) {
      document.body.style.overflow = "auto";
    }
  };

  const handleTouchStart = (e) => {
    if (!enableHighLighterEditMode) {
      return;
    }
    if (hoveredRectIndex !== null) return;
    setIsDrawing(true);
    disableScroll();
    const { x, y } = getTouchRelativePosition(e.touches[0]);
    setNewRect({
      x,
      y,
      width: 0,
      height: 0,
      color: selectedColor,
      strokeWidth,
      isHighlighterMode,
      opacity,
    });
  };

  const handleTouchMove = (e) => {
    if (!enableHighLighterEditMode) {
      return;
    }
    const { x, y } = getTouchRelativePosition(e.touches[0]);
    if (isDrawing) {
      setNewRect((prevRect) => ({
        ...prevRect,
        width: x - prevRect.x,
        height: y - prevRect.y,
      }));
    } else {
      const hoveredIndex = rectangles.findIndex(
        (rect) =>
          x >= rect.x &&
          x <= rect.x + rect.width &&
          y >= rect.y &&
          y <= rect.y + rect.height
      );
      setHoveredRectIndex(hoveredIndex !== -1 ? hoveredIndex : null);
    }
  };

  const handleTouchEnd = () => {
    if (!enableHighLighterEditMode) {
      return;
    }
    if (isDrawing) {
      enableScroll();
      if (newRect.width !== 0 && newRect.height !== 0) {
        const updatedRectangles = [...rectangles, newRect];
        setHistory([...history, rectangles]);
        setRectangles(updatedRectangles);
      }
      setNewRect(null);
      setIsDrawing(false);
      setRedoHistory([]); // Clear redo history on new draw action
    }
  };

  const handleStrokeWidthChange = ({ key }) => {
    setStrokeWidth(Number(key));
    localStorage.setItem("strokeWidth", key);
  };

  const handleDelete = (index) => {
    const updatedRectangles = rectangles.filter((_, i) => i !== index);
    setHistory([...history, rectangles]);
    setRectangles(updatedRectangles);
  };

  // it will add payload key in the rectangles array
  const updateRectangle = (index, payload) => {
    setRectangles((prev) =>
      prev.map((data, i) => {
        if (i === index) {
          return { ...data, ...payload };
        }
        return data;
      })
    );
  };

  //actions for button click for show input text field
  const handleCanvasClick = (e) => {
    if (!enableHighLighterEditMode) {
      return;
    }
    const { x, y } = getRelativePosition(e);
    if (hoveredRectIndex !== null) {
      const rect = rectangles[hoveredRectIndex];
      if (x < rect.x + 60 && y < rect.y + 60) {
        // handleDelete(hoveredRectIndex);
        updateRectangle(hoveredRectIndex, { showInput: true, textData: "" });
      } else if (x < rect.x + 160 && y < rect.y + 160) {
        updateRectangle(hoveredRectIndex, { showInput: true, textData: "" });
      }
    }
  };

  useEffect(() => {
    setRectangles((prev) =>
      prev.map((data, i) => {
        if (data?.showInput) {
          return { ...data, showInput: false };
        }
        return data;
      })
    );
  }, [newRect]);

  // addd actual width,height,left and top for show text field config
  const handleMouseMove = (e) => {
    if (!enableHighLighterEditMode) {
      return;
    }
    const { x, y } = getRelativePosition(e);
    const canvas = canvasRef.current;

    if (isDrawing) {
      setNewRect((prevRect) => ({
        ...prevRect,
        width: x - prevRect.x, // wrong
        height: y - prevRect.y, // wrong
        textData: null,
        actualWidth:
          (Math.abs(x - prevRect.x) / naturalDimensions.width) * canvas.width,
        actualHeight:
          (Math.abs(y - prevRect.y) / naturalDimensions.height) * canvas.height,
        actualLeft: (prevRect.x / naturalDimensions.width) * canvas.width,
        actualTop: (prevRect.y / naturalDimensions.height) * canvas.height,
      }));
    } else {
      const hoveredIndex = rectangles.findIndex(
        (rect) =>
          x >= rect.x &&
          x <= rect.x + rect.width &&
          y >= rect.y &&
          y <= rect.y + rect.height
      );
      setHoveredRectIndex(hoveredIndex !== -1 ? hoveredIndex : null);
    }
  };

  const handleMouseDown = (e) => {
    if (!enableHighLighterEditMode) {
      return;
    }
    if (hoveredRectIndex !== null) return;
    setIsDrawing(true);
    disableScroll();
    const { x, y } = getRelativePosition(e);
    setNewRect({
      x,
      y,
      width: 0,
      height: 0,
      actualHeight: 0,
      actualWidth: 0,
      color: selectedColor,
      strokeWidth,
      isHighlighterMode,
      opacity,
    });
  };

  const handleMouseUp = () => {
    if (!enableHighLighterEditMode) {
      return;
    }
    if (isDrawing) {
      enableScroll();
      if (newRect.width !== 0 && newRect.height !== 0) {
        const updatedRectangles = [...rectangles, newRect];
        setHistory([...history, rectangles]);
        setRectangles(updatedRectangles);
      }
      setNewRect(null);
      setIsDrawing(false);
      setRedoHistory([]); // Clear redo history on new draw action
    }
  };

  const handleInputKeyDown = (event, index) => {
    const { type, target, key } = event || null;
    if (type) {
      switch (type) {
        case "change":
          return updateRectangle(index, {
            textData: target.value,
          });
        case "keydown":
          if (key === "Enter") {
            updateRectangle(index, {
              showInput: false,
              textData: target.value,
            });
          }
          return;
        default:
          return null;
      }
    }
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isAnnotationsVisible) {
      rectangles.forEach((rect, index) => {
        const x = (rect.x / naturalDimensions.width) * canvas.width;
        const y = (rect.y / naturalDimensions.height) * canvas.height;

        const width =
          (Math.abs(rect.width) / naturalDimensions.width) * canvas.width;
        const height =
          (Math.abs(rect.height) / naturalDimensions.height) * canvas.height;

        if (rect.isHighlighterMode) {
          ctx.fillStyle = `${rect.color}${Math.floor(
            rect.opacity * 255
          ).toString(16)}`;
          ctx.fillRect(x, y, width, height);
        } else {
          ctx.strokeStyle = rect.color;
          ctx.lineWidth = rect.strokeWidth;
          ctx.strokeRect(x, y, width, height);
        }

        // Show delete button on hover
        if (hoveredRectIndex === index) {
          ctx.fillStyle = "red";
          const crossSize = 20;
          const crossX = (rect.x / naturalDimensions.width) * canvas.width;
          const crossY = (rect.y / naturalDimensions.height) * canvas.height;
          ctx.fillRect(crossX, crossY, crossSize, crossSize);
          ctx.fillStyle = "white";
          ctx.font = "14px Arial";
          ctx.fillText("X", crossX + 6, crossY + 15);

          // Draw the "plus" icon for adding input text
          const plusSize = 20;
          const plusX = crossX + crossSize + 10; // Position it next to the "X" icon
          const plusY = crossY; // Align it with the "X" icon
          ctx.fillStyle = "green";
          ctx.fillRect(plusX, plusY, plusSize, plusSize);
          ctx.fillStyle = "white";
          ctx.font = "14px Arial";
          ctx.fillText("+", plusX + 6, plusY + 15);
        }
      });
    }

    if (newRect) {
      const x = (newRect.x / naturalDimensions.width) * canvas.width;
      const y = (newRect.y / naturalDimensions.height) * canvas.height;
      const width =
        (Math.abs(newRect.width) / naturalDimensions.width) * canvas.width;
      const height =
        (Math.abs(newRect.height) / naturalDimensions.height) * canvas.height;

      if (newRect.isHighlighterMode) {
        // handleShowTextField(hoveredRectIndex,{actualWidth: width, actualHeight: height});
        ctx.fillStyle = `${newRect.color}${Math.floor(
          newRect.opacity * 255
        ).toString(16)}`;
        ctx.fillRect(x, y, width, height);
      } else {
        //   handleShowTextField(hoveredRectIndex,{actualWidth: width, actualHeight: height});
        ctx.strokeStyle = newRect.color;
        ctx.lineWidth = newRect.strokeWidth;
        ctx.strokeRect(x, y, width, height);
      }
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, [rectangles, newRect, isAnnotationsVisible, hoveredRectIndex]);

  //   const strokeWidthMenu = (
  //     <Menu onClick={handleStrokeWidthChange}>
  //       {[2, 3, 4, 5, 6, 7, 8].map((width) => (
  //         <Menu.Item key={width}>
  //           <LineWidthPreview strokeWidth={width} top={5} />
  //         </Menu.Item>
  //       ))}
  //     </Menu>
  //   );

  const handleMouseLeave = () => {
    setHoveredRectIndex(null);
  };

  return (
    <Container className="container">
      <Image
        ref={imageRef}
        src={""}
        alt="To be highlighted"
        className="image"
        onLoad={() => {
          const canvas = canvasRef.current;
          const image = imageRef.current;
          setIsImageLoaded(true);
          if (canvas && image) {
            setNaturalDimensions({
              width: image.naturalWidth,
              height: image.naturalHeight,
            });
            canvas.width = image.clientWidth;
            canvas.height = image.clientHeight;
            redrawCanvas();
          }
        }}
      />
      <CanvasContainer
        ref={canvasRef}
        className="highlight-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseLeave={handleMouseLeave}
      />
      {rectangles?.map((element, index) => {
        if (element?.textData === null) {
          return null;
        }
        return (
          <textarea
            key={index}
            type="text"
            readOnly={element?.showInput ? false : true}
            placeholder="Press Enter to save the data."
            style={{
              resize: "none",
              position: "absolute",
              left: `${element.actualLeft}px`,
              top: `${element.actualTop}px`,
              display: element?.showInput
                ? "block"
                : element?.textData?.length === 0
                ? "none"
                : "block",
              zIndex: element?.showInput ? "10" : "0",
              width: element?.actualWidth,
              height: element?.actualHeight,
              outline: "none",
              border: "none",
              padding: "10px",
              background: !element?.showInput && "transparent",
              paddingTop:
                element?.actualHeight > 100 && !element?.showInput && "20px",
            }}
            onKeyDown={(event) => handleInputKeyDown(event, index)}
            onChange={(event) => handleInputKeyDown(event, index)}
          />
        );
      })}
    </Container>
  );
};

export default ImageHighlighter;
