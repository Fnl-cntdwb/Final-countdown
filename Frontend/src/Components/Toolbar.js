import React, { useState } from "react";

const Toolbar = ({ isCollapsed, toggleCollapse, updateSelectedItemsStyle, onExportToPDF, onUndo, onRedo, setSelectionMode }) => {
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textAlign, setTextAlign] = useState("left");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontUnderline, setFontUnderline] = useState("none");
  const [fontStyle, setFontStyle] = useState("normal");
  const [color, setColor] = useState("#000000");

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setFontSize(newSize);
    updateSelectedItemsStyle({ fontSize: newSize });
  };

  const handleFontFamilyChange = (e) => {
    const newFont = e.target.value;
    setFontFamily(newFont);
    updateSelectedItemsStyle({ fontFamily: newFont });
  };

  const handleTextAlignChange = (align) => {
    setTextAlign(align);
    updateSelectedItemsStyle({ textAlign: align });
  };

  const handleFontWeightChange = () => {
    const newWeight = fontWeight === "normal" ? "bold" : "normal";
    setFontWeight(newWeight);
    updateSelectedItemsStyle({ fontWeight: newWeight });
  };

  const handleUnderlineChange = () => {
    const newUnderline = fontUnderline === "underline" ? "none" : "underline";
    setFontUnderline(newUnderline);
    updateSelectedItemsStyle({ textDecoration: newUnderline });
  };

  const handleFontStyleChange = () => {
    const newStyle = fontStyle === "normal" ? "italic" : "normal";
    setFontStyle(newStyle);
    updateSelectedItemsStyle({ fontStyle: newStyle });
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    updateSelectedItemsStyle({ color: newColor });
  };


  return (
    <div className={`toolbar ${isCollapsed ? "collapsed" : ""}`}>
      <button onClick={toggleCollapse} style={{ marginBottom: "10px" }}>
        {isCollapsed ? ">" : "<"}
      </button>
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column" }}>
        <button onClick={() => onExportToPDF()}>Export to PDF</button>
        <button onClick={onUndo}>Undo (Ctrl+Z)</button>
        <button onClick={onRedo}>Redo (Ctrl+Y)</button>
      </div>
      <div className="button-group">
        <button onClick={handleFontWeightChange}>B</button>
        <button onClick={handleFontStyleChange}>I</button>
        <button onClick={handleUnderlineChange}>U</button>
      </div>
      <div>
        <label>
          Font size:
          <input
            type="number"
            value={fontSize}
            onChange={handleFontSizeChange}
            min="8"
            max="72"
          />
        </label>

        <label>
          Font family:
          <select value={fontFamily} onChange={handleFontFamilyChange}>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </label>

        <label>
          Text Align:
          <button onClick={() => handleTextAlignChange("left")}>Left</button>
          <button onClick={() => handleTextAlignChange("center")}>Center</button>
          <button onClick={() => handleTextAlignChange("right")}>Right</button>
          <button onClick={() => handleTextAlignChange("justify")}>Justify</button>
        </label>

        <label>
          Text Color:
          <input type="color" value={color} onChange={handleColorChange} />
        </label>
      </div>
    </div>
  );
};

export default Toolbar;
