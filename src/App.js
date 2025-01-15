import React from 'react';
import Canvas from './Components/Canvas';
import Sidebar from './Components/Sidebar';
import AuthProvider from './Components/AuthContext';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App = () => {
  return (
    <AuthProvider>
      <Canvas />
    </AuthProvider>
  );
};

export default App;
