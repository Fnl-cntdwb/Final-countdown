import React, { useState, useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import Toolbar from "./Toolbar";
import DraggableField from "./DraggableField";
import Sidebar from "./Sidebar";
import { jsPDF } from "jspdf";
import { useAuth } from './AuthContext'; 
import axios from "axios";

const Canvas = () => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [cvId, setCvId] = useState();
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
    const fetchCVId = async () => {
        if (!currentUser || !currentUser.username) return;

        try {
            const response = await axios.get(`http://localhost:8080/cv-data/username`, {
                params: { username: currentUser.username },
            });

            if (response.data && response.data.cvId) {
                setCvId(response.data.cvId);
            } else {
                console.error('CV data does not contain an ID');
                setCvId(null);
            }
        } catch (error) {
            console.error('Failed to fetch CV data:', error);
            setCvId(null);
        }
    };

    fetchCVId();
}, [currentUser]);

  useEffect(() => {
    const saveCanvasData = async () => {
        if (!cvId) return;
        try {
            const response = await fetch(`http://localhost:8080/cv-data/${cvId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ canvasData: JSON.stringify(items) }),
            });
            if (!response.ok) {
                console.error("Failed to save canvas data");
            }
        } catch (error) {
            console.error("Error saving canvas data", error);
        }
    };

    if (cvId) {
        const interval = setInterval(saveCanvasData, 10000); // Save every 10 seconds
        return () => clearInterval(interval);
    }
}, [items, cvId]);


useEffect(() => {
  const fetchCanvasData = async () => {
      if (!cvId) return;
      try {
          const response = await fetch(`http://localhost:8080/cv-data/${cvId}`);
          if (response.ok) {
              const data = await response.json();
              if (data.canvasData) {
                  setItems(JSON.parse(data.canvasData));
              }
          } else {
              console.error("Failed to fetch canvas data");
          }
      } catch (error) {
          console.error("Error fetching canvas data", error);
      }
  };

  if (cvId) fetchCanvasData();
}, [cvId]);


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

        items.forEach((item) => {
            const itemX = item.x / 3.7795275591; // Conversion from px to mm
            const itemY = item.y / 3.7795275591;
            const itemWidth = item.width / 3.7795275591;

            // Render text
            if (item.type === "text") {
                const fontStyle = (item.fontWeight === "bold" ? "bold" : "normal") +
                                  (item.fontStyle === "italic" ? "italic" : "");
                doc.setFont(item.fontFamily || "Arial", fontStyle.trim());
                doc.setFontSize(item.fontSize || 16);
                doc.setTextColor(item.color || "#000000");

                if (item.textAlign === "center") {
                    const centerX = itemX + (itemWidth / 2);
                    doc.text(item.content || "", centerX, itemY, { align: "center" });
                } else if (item.textAlign === "right") {
                    const rightX = itemX + itemWidth;
                    doc.text(item.content || "", rightX, itemY, { align: "right" });
                } else {
                    doc.text(item.content || "", itemX, itemY, { align: "left" });
                }
            }

            // Render image
            if (item.type === "photo" && item.image) {
                try {
                    doc.addImage(item.image, "JPEG", itemX, itemY, itemWidth, item.height / 3.7795275591);
                } catch (e) {
                    console.error("Error adding image:", e);
                }
            }

            // Render list
            if (item.type === "list") {
                let currentY = itemY;

                if (item.title && item.title.trim() !== "") {
                    // Font and style for the title
                    doc.setFont(item.fontFamily || "Arial", "bold"); // Explicitly setting bold here
                    doc.setFontSize((item.fontSize || 16) + 4); // Optionally increase the size
                    doc.setTextColor(item.color || "#000000");

                    const titleX =
                        item.textAlign === "center"
                            ? itemX + itemWidth / 2
                            : item.textAlign === "right"
                            ? itemX + itemWidth
                            : itemX;

                    doc.text(item.title, titleX, currentY, { align: item.textAlign || "left" });
                    currentY += 10;
                }

                if (item.description && item.description.trim() !== "") {
                    const descriptionFontStyle = (item.fontWeight === "bold" ? "bold" : "normal") +
                                                 (item.fontStyle === "italic" ? "italic" : "");
                    doc.setFont(item.fontFamily || "Arial", descriptionFontStyle.trim());
                    doc.setFontSize(item.fontSize || 16);
                    doc.setTextColor(item.color || "#555555");

                    const descriptionX =
                        item.textAlign === "center"
                            ? itemX + itemWidth / 2
                            : item.textAlign === "right"
                            ? itemX + itemWidth
                            : itemX;

                    doc.text(item.description, descriptionX, currentY, { align: item.textAlign || "left" });
                    currentY += 10;
                }

                if (Array.isArray(item.subFields) && item.subFields.length > 0) {
                    const subFieldFontStyle = (item.fontWeight === "bold" ? "bold" : "normal") +
                                              (item.fontStyle === "italic" ? "italic" : "");
                    doc.setFont(item.fontFamily || "Arial", subFieldFontStyle.trim());
                    doc.setFontSize(item.fontSize || 14);
                    doc.setTextColor(item.color || "#000000");

                    item.subFields.forEach((subField, index) => {
                        const bullet = `${index + 1}. `;
                        const content = `${bullet}${subField.name || ""} - ${
                            subField.description || ""
                        }`;

                        const listItemX =
                            item.textAlign === "center"
                                ? itemX + itemWidth / 2
                                : item.textAlign === "right"
                                ? itemX + itemWidth
                                : itemX;

                        doc.text(content, listItemX, currentY, { align: item.textAlign || "left" });
                        currentY += 7;
                    });
                }
            }
        });

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