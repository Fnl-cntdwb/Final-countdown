import React, { useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import Toolbar from "./Toolbar";
import DraggableField from "./DraggableField";
import Sidebar from "./Sidebar";
import { jsPDF } from "jspdf";

const Canvas = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isToolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false); // used for tracking selection areas
  const [selectionArea, setSelectionArea] = useState(null); // stores the coordinates of the selected area
  const [selectionMode, setSelectionMode] = useState(true);
  const canvasRef = useRef(null);
  const [ctrlPressed, setCtrlPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Control") {
        setCtrlPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Control") {
        setCtrlPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleDrop = (item, offset) => {
    const canvas = canvasRef.current.getBoundingClientRect();
    const { x, y } = offset;

    const newItem = {
      ...item,
      id: Date.now(),
      x: x - canvas.left,
      y: y - canvas.top,
      width: 200,
      height: 100,
      content: item.label || "",
      image: null,
      type: item.type,
      fontSize: 16,
      fontFamily: "Arial",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "left",
      color: "#000000",
    };

    const newHistory = [...history.slice(0, historyIndex + 1), { action: "add", item: newItem }];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setItems((prevItems) => [...prevItems, newItem]);
  };

    const updateSelectedItemsPosition = (dx, dy) => {
      const updatedItems = items.map((item) => {
        if (selectedItems.includes(item.id)) {
          return {
            ...item,
            x: item.x + dx,
            y: item.y + dy,
          };
        }
        return item;
      });
      setItems(updatedItems); // Set the updated list
    };

       const updateItem = (id, updates) => {
         const updatedItems = items.map((item) => {
           if (item.id === id) {
             return { ...item, ...updates };
           }
           return item;
         });
         setItems(updatedItems); // Update the list of items
       };

  const deleteSelectedItems = () => {
    if (selectedItems.length === 0) return;
    const newItems = items.filter((item) => !selectedItems.includes(item.id));
    const deletedItems = items.filter((item) => selectedItems.includes(item.id));
    const newHistory = [
      ...history.slice(0, historyIndex + 1),
      { action: "delete", items: deletedItems },
    ];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setItems(newItems);
    setSelectedItems([]);
  };

  const undo = () => {
    if (historyIndex < 0) return;
    const previousAction = history[historyIndex];
    if (previousAction.action === "add") {
      setItems(items.filter((item) => item.id !== previousAction.item.id));
    } else if (previousAction.action === "update") {
      updateItem(previousAction.id, previousAction.updates); // revert the update
    } else if (previousAction.action === "delete") {
      setItems((prevItems) => [...prevItems, ...previousAction.items]);
    }
    setHistoryIndex(historyIndex - 1);
  };

  const redo = () => {
    if (historyIndex + 1 >= history.length) return;
    const nextAction = history[historyIndex + 1];
    if (nextAction.action === "add") {
      setItems((prevItems) => [...prevItems, nextAction.item]);
    } else if (nextAction.action === "update") {
      updateItem(nextAction.id, nextAction.updates);
    } else if (nextAction.action === "delete") {
      setItems(items.filter((item) => item.id !== nextAction.id));
    }
    setHistoryIndex(historyIndex + 1);
  };

    const exportToPDF = () => {
      const doc = new jsPDF();

      // Width and height of an A4 sheet in pt (default for jsPDF)
      const a4Width = 210; // mm -> pt
      const a4Height = 297; // mm -> pt

      // Ensure all elements are rendered correctly
      items.forEach((item) => {
        const itemX = item.x / 3.7795275591; // Convert px -> pt
        const itemY = item.y / 3.7795275591; // Convert px -> pt
        const itemWidth = item.width / 3.7795275591; // Convert px -> pt
        const itemHeight = item.height / 3.7795275591; // Convert px -> pt

        if (item.type === "text") {
          // Handling text
          doc.setFontSize(item.fontSize / 3.7795275591 * 2.8346456693); // Convert font size to pt
          doc.setFont(item.fontFamily, item.fontStyle || "normal");
          doc.setTextColor(item.color || "#000000");
          doc.text(item.content, itemX, itemY, { align: item.textAlign });
        } else if (item.type === "photo" && item.image) {
          // Handling images
          try {
            doc.addImage(item.image, "JPEG", itemX, itemY, itemWidth, itemHeight);
          } catch (e) {
            console.error("Error adding image to PDF: ", e);
          }
        } else if (item.type === "list") {
          // Handling list
          let currentY = itemY; // Start at the specified position

          // Render list title
          if (item.title) {
            doc.setFontSize((item.fontSize + 4) / 3.7795275591 * 2.8346456693); // Larger font size for title
            doc.setFont(item.fontFamily, "bold");
            doc.setTextColor(item.color || "#000000");
            doc.text(item.title, itemX, currentY);
            currentY += 12; // Move Y downwards
          }

          // Render list description (if available)
          if (item.description) {
            doc.setFontSize(item.fontSize / 3.7795275591 * 2.8346456693);
            doc.setTextColor(item.color || "#555555"); // Slightly lighter color
            doc.text(item.description, itemX, currentY);
            currentY += 10; // Move Y downwards
          }

          // Render items from subFields
          if (Array.isArray(item.subFields) && item.subFields.length > 0) {
            doc.setFontSize(item.fontSize / 3.7795275591 * 2.8346456693);
            doc.setFont(item.fontFamily, "normal");
            doc.setTextColor(item.color || "#000000");

            item.subFields.forEach((field, index) => {
              const bullet = `${index + 1}. `;
              const content = `${bullet}${field.name || "No title"} - ${field.description || "No description"}`;
              doc.text(content, itemX, currentY);
              currentY += 10; // Move Y for the next list item
            });
          }
        }
      });

      // Save the PDF
      doc.save("canvas.pdf");
    };

  const [, dropRef] = useDrop({
    accept: ["image", "text", "photo", "list"],
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset) {
        handleDrop(item, offset);
      }
    },
  });

  const [isDragging, setIsDragging] = useState(false);

  const startSelection = (e) => {
    if (!selectionMode || e.button !== 0) return;

    setIsDragging(false);
    const rect = canvasRef.current.getBoundingClientRect();
    const xStart = e.clientX - rect.left;
    const yStart = e.clientY - rect.top;
    setSelectionArea({ xStart, yStart, xEnd: xStart, yEnd: yStart });
  };

  const updateSelection = (e) => {
    if (!selectionMode || !selectionArea) return;
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setSelectionArea((prev) => ({
      ...prev,
      xEnd: e.clientX - rect.left,
      yEnd: e.clientY - rect.top,
    }));
  };

  const endSelection = () => {
    if (!selectionMode || !selectionArea) return;

    if (!isDragging) {
      setSelectionArea(null);
      setIsDragging(false);
      return;
    }

    const { xStart, yStart, xEnd, yEnd } = selectionArea;

    const selected = items.filter((item) => {
      const itemRight = item.x + item.width;
      const itemBottom = item.y + item.height;

      return (
        Math.max(xStart, xEnd) >= item.x &&
        Math.min(xStart, xEnd) <= itemRight &&
        Math.max(yStart, yEnd) >= item.y &&
        Math.min(yStart, yEnd) <= itemBottom
      );
    });

    setSelectedItems(selected.map((item) => item.id));
    setSelectionArea(null);
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (selectionArea) updateSelection(e);
    };

    const handleMouseUp = () => {
      endSelection();
    };

    if (selectionMode) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectionArea, selectionMode]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete") {
        deleteSelectedItems();
      } else if (e.key === "z" && e.ctrlKey) {
        undo();
      } else if (e.key === "y" && e.ctrlKey) {
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, historyIndex, selectedItems]);

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh", position: "relative" }}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        ref={(node) => {
          dropRef(node);
          canvasRef.current = node;
        }}
        id="canvas"
        style={{
          width: "210mm", // fixed size of A4 format
          height: "297mm", // fixed size of A4 format
          position: "absolute",
          top: "50%", // vertically
          left: "50%", // horizontally
          transform: "translate(-50%, -50%)", // align to the center of the page
          backgroundColor: "#fff",
          overflow: "hidden",
          border: "1px solid #ccc",
          marginTop: "100px",
        }}
        onMouseDown={startSelection} // Start selection
        onMouseMove={updateSelection} // Update area
        onMouseUp={endSelection} // End selection
      >
        {/* Displaying selection area */}
        {selectionArea && (
            <div
              style={{
                position: "absolute",
                left: `${Math.min(selectionArea.xStart, selectionArea.xEnd)}px`,
                top: `${Math.min(selectionArea.yStart, selectionArea.yEnd)}px`,
                width: `${Math.abs(selectionArea.xEnd - selectionArea.xStart)}px`,
                height: `${Math.abs(selectionArea.yEnd - selectionArea.yStart)}px`,
                backgroundColor: "rgba(0, 0, 255, 0.3)",
                border: "2px dashed blue",
            }}
          />
        )}
        {items.map((item) => (
            <DraggableField
              key={item.id}
              item={item}
              isSelected={selectedItems.includes(item.id)}
              onSelect={() => {
                setSelectedItems((prev) =>
                  prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                );
              }}
              updateItem={updateItem}
              updateSelectedItemsPosition={
                ctrlPressed ? updateSelectedItemsPosition : null
              }
            />
        ))}
      </div>

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
      />

      <Toolbar
        isCollapsed={isToolbarCollapsed}
        toggleCollapse={() => setToolbarCollapsed(!isToolbarCollapsed)}
          updateSelectedItemsStyle={(style) => {
            selectedItems.forEach((id) => updateItem(id, style));
          }}
        onExportToPDF={exportToPDF}
        onUndo={undo}
        onRedo={redo}
        setSelectionMode={setSelectionMode}
      />
    </div>
  );
};

export default Canvas;