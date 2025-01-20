import React from "react";
import { Rnd } from "react-rnd";

const DraggableField = ({ item, isSelected, onSelect, updateItem, updateSelectedItemsPosition }) => {
  const {
    x,
    y,
    width,
    height,
    type,
    title, // List title
    description, // List description
    content, // Content for regular text
    image,
    fontSize,
    fontFamily,
    textAlign,
    fontWeight,
    fontStyle,
    fontUnderline,
    color,
    subFields = [],
  } = item;

  // Drag stop function
  const handleDragStop = (e, d) => {
    if (updateSelectedItemsPosition) {
      updateSelectedItemsPosition(d.x - item.x, d.y - item.y); // Move all selected items
    } else {
      updateItem(item.id, { x: d.x, y: d.y }); // Move only the current item
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      updateItem(item.id, { image: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Resize stop function
  const handleResizeStop = (e, direction, ref, delta, position) => {
    updateItem(item.id, {
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      ...position,
    });
  };

  // Update any object field
  const handleFieldChange = (field, value) => {
    updateItem(item.id, { [field]: value });
  };

  // Update one of the subfields
  const handleSubFieldChange = (index, field, value) => {
    const updatedFields = [...subFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    updateItem(item.id, { subFields: updatedFields });
  };

  // Add a new subfield
  const addSubField = () => {
    const newField = { name: "", description: "" };
    updateItem(item.id, { subFields: [...subFields, newField] });
  };

  const getDefaultTitleFromType = (type) => {
    switch (type) {
      case "education":
        return "Education";
      case "hard skill":
        return "Hard Skill";
      case "soft skill":
        return "Soft Skill";
      default:
        return "List Item";
    }
  };

  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      style={{
        border: isSelected ? "2px solid blue" : "2px solid transparent",
        backgroundColor: "#fff",
        padding: "10px",
        boxShadow: "0 0 3px rgba(0,0,0,0.2)",
        textAlign,
        cursor: "pointer",
      }}
        onClick={(e) => {e.stopPropagation();
          onSelect();}}
    >
      {/* Render text */}
      {type === "text" && (
        <div
          contentEditable
          style={{
            fontSize: `${fontSize}px`,
            fontFamily,
            fontWeight,
            fontStyle,
            fontUnderline,
            color,
            textAlign,
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            outline: "none",
          }}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleFieldChange("content", e.target.innerText)}
        >
          {content}
        </div>
      )}

        {/* Render list title */}
        {type === "list" && (
          <div
            style={{
              fontSize: fontSize + 4, // Title larger than text
              fontFamily,
              fontWeight: "bold", // Made bold for emphasis
              color,
              marginBottom: "5px",
              textAlign,
            }}
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={(e) => handleFieldChange("title", e.target.innerText)} // save to 'title'
          >
            {title || "List Title..."}
          </div>
        )}

      {/* Render list description */}
      {type === "list" && (
        <div
          style={{
            fontSize: `${fontSize}px`,
            fontFamily,
            fontWeight,
            fontStyle,
            fontUnderline,
            color,
            textAlign,
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            outline: "none",
          }}
          contentEditable
          suppressContentEditableWarning={true}
          onBlur={(e) => handleFieldChange("description", e.target.innerText)}
        >
          {description || "Description..."}
        </div>
      )}

      {/* Render list of items */}
      {type === "list" && subFields && Array.isArray(subFields) && (
        <div>
          {subFields.map((field, index) => (
            <div key={index} style={{ marginBottom: "5px" }}>
              <input
                type="text"
                placeholder="List Name"
                value={field.name || ""}
                onChange={(e) =>
                  handleSubFieldChange(index, "name", e.target.value)
                }
                style={{
                  fontSize,
                  fontFamily,
                  fontWeight,
                  fontStyle,
                  fontUnderline,
                  color,
                  marginRight: "5px",
                }}
              />
              <input
                type="text"
                placeholder="Description"
                value={field.description || ""}
                onChange={(e) =>
                  handleSubFieldChange(index, "description", e.target.value)
                }
                style={{
                  fontSize,
                  fontFamily,
                  fontWeight,
                  fontStyle,
                  fontUnderline,
                  color,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Render photo */}
      {type === "photo" && (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {/* Display image */}
          {image ? (
            <img src={image} alt="Uploaded" style={{ width: "100%", height: "100%" }} />
          ) : (
            <label style={{ cursor: "pointer" }}>
              Insert Photo
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          )}

          {/* "Insert Photo" and "Delete Photo" buttons */}
          {isSelected && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-evenly",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                padding: "5px",
                zIndex: 10,
                boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Insert Photo */}
              <label style={{ cursor: "pointer" }}>
                Insert Photo
                <input
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              {/* Delete Photo */}
              <button onClick={() => updateItem(item.id, { image: null })}>Delete Photo</button>
            </div>
          )}
        </div>
      )}
    </Rnd>
  );
};

export default DraggableField;