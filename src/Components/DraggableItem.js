import React from "react";
import { useDrag } from "react-dnd";

const DraggableItem = ({ type, label }) => {
  const [, dragRef] = useDrag({
    type: type,
    item: { type, label },
  });

  return (
    <div
      ref={dragRef}
      style={{
        padding: "8px",
        margin: "4px",
        backgroundColor: "#f0f0f0",
        cursor: "move",
      }}
    >
      {label}
    </div>
  );
};

export default DraggableItem;
