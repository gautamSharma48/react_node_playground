import React, { useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";

const DndContext = ({ children }) => {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
};

const ItemType = "ITEM";

const DraggableItem = ({ item, index, moveItem, handleDragStart, handleDragEnd, isTarget }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ItemType,
    hover(draggedItem) {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => {
      if (monitor.isDragging()) {
        handleDragStart(index);
      }
      return {
        isDragging: monitor.isDragging(),
      };
    },
    item: () => ({ index }),
    end: () => handleDragEnd(),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        padding: "8px",
        border: "1px solid black",
        marginBottom: "4px",
        cursor: "grab",
        backgroundColor: isTarget ? 'lightblue' : 'red',
        // opacity: isDragging ? 0.8 : 1,
        transition: 'background-color 0.2s ease',
      }}
    >
      {item}
    </div>
  );
};

const ChangeOrderWithDraggable = () => {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [targetIndex, setTargetIndex] = useState(null);

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
    setTargetIndex(toIndex); // Update targetIndex when an item is moved
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setTargetIndex(null);
  };

  return (
    <DndContext>
      <div>
        {items.map((item, index) => (
          <DraggableItem
            key={index}
            index={index}
            item={item}
            moveItem={moveItem}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            isTarget={index === targetIndex}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default ChangeOrderWithDraggable;
