import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import COLOR from 'utils/constants/color';
import { SketchPicker } from 'react-color';
import 'antd/dist/antd.css';
import { Button, Popover, Menu, Dropdown, Switch, Slider, message, Tooltip } from 'antd';
import { UndoOutlined, RedoOutlined, EyeInvisibleOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { handleCreateEbookHighlights, handleListUserEbooklights } from "store/ebook_highlighter/thunks";
import { useCurrentClass } from 'store/classes/selectors';
import { useCurrentUser } from 'store/users/selectors';
import { useDispatch } from 'react-redux';
import { useEbookHighlightes } from 'store/ebook_highlighter/selectors';

const CanvasContainer = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Image = styled.img`
  background-color: ${COLOR.white};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  height: auto;
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  margin-bottom: 30px;
`;

const ControlsContainer = styled.div`
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  flex-wrap: wrap;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.9);
`;

const LineWidthPreview = styled.div`
  width: 100px;
  height: ${({ strokeWidth }) => strokeWidth}px;
  background-color: ${({ color }) => (color ? color : 'black')};
  margin-top: ${({ top }) => top}px;
`;

const ImageHighlighter = ({ imageUrl, pageId, bookId }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const currentClass = useCurrentClass();
  const currentUser = useCurrentUser();
  const [rectangles, setRectangles] = useState([]);
  const [newRect, setNewRect] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(localStorage.getItem('selectedColor') || '#50e3c2');
  const [strokeWidth, setStrokeWidth] = useState(Number(localStorage.getItem('strokeWidth')) || 2);
  const [opacity, setOpacity] = useState(Number(localStorage.getItem('opacity')) || 0.4);
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 1, height: 1 });
  const [isHighlighterMode, setIsHighlighterMode] = useState(localStorage.getItem('isHighlighterMode') === 'true');
  const [isAnnotationsVisible, setIsAnnotationsVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [hoveredRectIndex, setHoveredRectIndex] = useState(null);
  const dispatch = useDispatch();
  const ebook_highlights = useEbookHighlightes();
  const [highlights, setHighlights] = useState({});
  const [is_image_loaded, setIsImageLoaded] = useState(false);
  const [enableHighLighterEditMode,setEnableHighLighterEditMode] = useState(false);
  const [bookData,setBookData] = useState({});

  useEffect(() => {
    if (bookId && currentUser?.id) {
      dispatch(handleListUserEbooklights(currentUser.id, bookId, currentClass.id));
    }
  }, [bookId, currentUser]);

  useEffect(() => {
    if (bookId && pageId && ebook_highlights) {
      if (Array.isArray(ebook_highlights) && ebook_highlights.length > 0 && ebook_highlights[0].book_id === bookId) {
        const page_item = ebook_highlights.find(h => h.page_id === pageId);
        if (page_item) {
          if (highlights && highlights.page_id === page_item.page_id && highlights.book_id === page_item.book_id) {
            return;
          }
          setHighlights(page_item);
          setEnableHighLighterEditMode(page_item?.show);
          setIsAnnotationsVisible(page_item?.show);
          if (Array.isArray(page_item.data.rectangles)) {
            setRectangles(page_item.data.rectangles);
            setNaturalDimensions(page_item.data.naturalDimensions);
          } else {
            setRectangles([]);
            setHighlights({
              page_id: pageId,
              book_id: bookId,
              data: {
                rectangles: [],
                naturalDimensions: { width: 1, height: 1 },
              },
            });
          }
        } else {
          setRectangles([]);
          setHighlights({
            page_id: pageId,
            book_id: bookId,
            data: {
              rectangles: [],
              naturalDimensions: { width: 1, height: 1 },
            },
          });
          const canvas = canvasRef.current;
          const image = imageRef.current;
          if (canvas && image) {
            setNaturalDimensions({
              width: image.naturalWidth,
              height: image.naturalHeight,
            });
          }
        }
      }
    }
  }, [ebook_highlights, pageId, bookId]);

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

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
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
      document.body.style.overflow = 'hidden';
    }
  };

  const enableScroll = () => {
    if (window.innerWidth < 800) {
      document.body.style.overflow = 'auto';
    }
  };

  const handleMouseDown = (e) => {
    if(!enableHighLighterEditMode){
      return;
    }
    if (hoveredRectIndex !== null) return;
    setIsDrawing(true);
    disableScroll();
    const { x, y } = getRelativePosition(e);
    setNewRect({ x, y, width: 0, height: 0, color: selectedColor, strokeWidth, isHighlighterMode, opacity });
  };

  const handleMouseMove = (e) => {
    if(!enableHighLighterEditMode){
      return;
    }
    const { x, y } = getRelativePosition(e);
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

  const handleMouseUp = () => {
    if(!enableHighLighterEditMode){
      return;
    }
    if (isDrawing) {
      enableScroll();
      if (newRect.width !== 0 && newRect.height !== 0) {
        const updatedRectangles = [...rectangles, newRect];
        setHistory([...history, rectangles]);
        setRectangles(updatedRectangles);
        saveRectanglesToDB(updatedRectangles);
      }
      setNewRect(null);
      setIsDrawing(false);
      setRedoHistory([]); // Clear redo history on new draw action
    }
  };

  const handleTouchStart = (e) => {
    if(!enableHighLighterEditMode){
      return;
    }
    if (hoveredRectIndex !== null) return;
    setIsDrawing(true);
    disableScroll();
    const { x, y } = getTouchRelativePosition(e.touches[0]);
    setNewRect({ x, y, width: 0, height: 0, color: selectedColor, strokeWidth, isHighlighterMode, opacity });
  };

  const handleTouchMove = (e) => {
    if(!enableHighLighterEditMode){
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
    if(!enableHighLighterEditMode){
      return;
    }
    if (isDrawing) {
      enableScroll();
      if (newRect.width !== 0 && newRect.height !== 0) {
        const updatedRectangles = [...rectangles, newRect];
        setHistory([...history, rectangles]);
        setRectangles(updatedRectangles);
        saveRectanglesToDB(updatedRectangles);
      }
      setNewRect(null);
      setIsDrawing(false);
      setRedoHistory([]); // Clear redo history on new draw action
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    localStorage.setItem('selectedColor', color.hex);
  };

  const handleStrokeWidthChange = ({ key }) => {
    setStrokeWidth(Number(key));
    localStorage.setItem('strokeWidth', key);
  };

  const handleOpacityChange = (value) => {
    setOpacity(value / 100);
    localStorage.setItem('opacity', value / 100);
  };

  const handleModeChange = (checked) => {
    setIsHighlighterMode(checked);
    localStorage.setItem('isHighlighterMode', checked);
  };


  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setRedoHistory([rectangles, ...redoHistory]);
      setRectangles(previousState);
      saveRectanglesToDB(previousState);
      setHistory(history.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory[0];
      setHistory([...history, rectangles]);
      setRectangles(nextState);
      saveRectanglesToDB(nextState);
      setRedoHistory(redoHistory.slice(1));
    }
  };

  const handleToggleAnnotations = () => {
    setIsAnnotationsVisible(!isAnnotationsVisible);
    setEnableHighLighterEditMode(!enableHighLighterEditMode);
    saveRectanglesToDB(rectangles, !enableHighLighterEditMode);
  };

  const handleDelete = (index) => {
    const updatedRectangles = rectangles.filter((_, i) => i !== index);
    setHistory([...history, rectangles]);
    setRectangles(updatedRectangles);
    saveRectanglesToDB(updatedRectangles);
  };

  const handleClearAll = () => {
    setHistory([...history, rectangles]);
    setRectangles([]);
    saveRectanglesToDB([]);
  };

  const saveRectanglesToDB = async (rectangles,show = enableHighLighterEditMode) => {
    try {
      let data = {
        rectangles,
        naturalDimensions
      };
      const dt = {
        user_id: currentUser.id,
        class_id: currentClass.id,
        page_id: pageId,
        book_id: bookId,
        data,
        show: show
      };
      await dispatch(handleCreateEbookHighlights(dt));
    } catch (error) {
      message.error('Failed to save');
    }
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isAnnotationsVisible ) {
      rectangles.forEach((rect, index) => {
        if (rect.isHighlighterMode) {
          ctx.fillStyle = `${rect.color}${Math.floor(rect.opacity * 255).toString(16)}`; // Set fill color with opacity
          ctx.fillRect(
            (rect.x / naturalDimensions.width) * canvas.width,
            (rect.y / naturalDimensions.height) * canvas.height,
            (rect.width / naturalDimensions.width) * canvas.width,
            (rect.height / naturalDimensions.height) * canvas.height
          );
        } else {
          ctx.strokeStyle = rect.color;
          ctx.lineWidth = rect.strokeWidth;
          ctx.strokeRect(
            (rect.x / naturalDimensions.width) * canvas.width,
            (rect.y / naturalDimensions.height) * canvas.height,
            (rect.width / naturalDimensions.width) * canvas.width,
            (rect.height / naturalDimensions.height) * canvas.height
          );
        }

        // Show delete button on hover
        if (hoveredRectIndex === index) {
          ctx.fillStyle = 'red';
          const crossSize = 20;
          const crossX = (rect.x / naturalDimensions.width) * canvas.width;
          const crossY = (rect.y / naturalDimensions.height) * canvas.height;
          ctx.fillRect(crossX, crossY, crossSize, crossSize);
          ctx.fillStyle = 'white';
          ctx.font = '14px Arial';
          ctx.fillText('X', crossX + 6, crossY + 15);
        }
      });
    }

    if (newRect) {
      if (newRect.isHighlighterMode) {
        ctx.fillStyle = `${newRect.color}${Math.floor(newRect.opacity * 255).toString(16)}`; // Set fill color with opacity
        ctx.fillRect(
          (newRect.x / naturalDimensions.width) * canvas.width,
          (newRect.y / naturalDimensions.height) * canvas.height,
          (newRect.width / naturalDimensions.width) * canvas.width,
          (newRect.height / naturalDimensions.height) * canvas.height
        );
      } else {
        ctx.strokeStyle = newRect.color;
        ctx.lineWidth = newRect.strokeWidth;
        ctx.strokeRect(
          (newRect.x / naturalDimensions.width) * canvas.width,
          (newRect.y / naturalDimensions.height) * canvas.height,
          (newRect.width / naturalDimensions.width) * canvas.width,
          (newRect.height / naturalDimensions.height) * canvas.height
        );
      }
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, [rectangles, newRect, isAnnotationsVisible, hoveredRectIndex]);

  const strokeWidthMenu = (
    <Menu onClick={handleStrokeWidthChange}>
      {[2, 3, 4, 5, 6, 7, 8].map((width) => (
        <Menu.Item key={width}>
          <LineWidthPreview strokeWidth={width} top={5} />
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleMouseLeave = () => {
    setHoveredRectIndex(null);
  };
  
  const handleCanvasClick = (e) => {
    if(!enableHighLighterEditMode){
      return;
    }
    const { x, y } = getRelativePosition(e);
    if (hoveredRectIndex !== null) {
      const rect = rectangles[hoveredRectIndex];
      if (x < rect.x + 60 && y < rect.y + 60) {
        handleDelete(hoveredRectIndex);
      }
    }
  };

  return (
    <Container className="container">
      <Image
        ref={imageRef}
        src={imageUrl}
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
      {is_image_loaded ? (
        <ControlsContainer>
          <Popover
            content={<SketchPicker color={selectedColor} onChange={handleColorChange} />}
            title="Select Color"
            trigger="click"
          >
            <Button style={{ width: 50, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
              <div style={{ backgroundColor: selectedColor, width: '100%', height: '100%' }} />
            </Button>
          </Popover>      
          <Dropdown overlay={strokeWidthMenu} trigger={['click']}>
            <Button style={{ width: 60, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: 5, paddingRight: 5 }}>
              <LineWidthPreview strokeWidth={strokeWidth} top={0} />
            </Button>
          </Dropdown>
          <Tooltip title="Switch between Highlighter / Outline">
            <Switch checked={isHighlighterMode} onChange={handleModeChange} checkedChildren="Highlighter" unCheckedChildren="Outline" />
          </Tooltip>
          {isHighlighterMode ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>Opacity:</span>
              <Slider defaultValue={opacity * 100} onChange={handleOpacityChange} style={{ width: 100 }} />
            </div>
          ) : null}
          <Tooltip title="Undo last highlight">
            <Button icon={<UndoOutlined />} onClick={handleUndo} />
          </Tooltip>
          <Tooltip title="Redo last highlight">
            <Button icon={<RedoOutlined />} onClick={handleRedo} />
          </Tooltip>
          <Tooltip title="Show or hide highlights">
            <Button icon={!isAnnotationsVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={handleToggleAnnotations} />
          </Tooltip>
          <Tooltip title="Clear All Highlights">
            <Button icon={<DeleteOutlined />} onClick={handleClearAll} />
          </Tooltip>
        </ControlsContainer>
      ) : null}
    </Container>
  );
};

export default ImageHighlighter;
