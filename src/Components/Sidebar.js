import React, { useContext, useState } from "react";
import DraggableItem from "./DraggableItem"
import { AuthContext } from './AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const [authMode, setAuthMode] = useState(null); // 'login' or 'signup'
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
          <button onClick={toggleCollapse} style={{ marginBottom: '10px' }}>
            {isCollapsed ? '>' : '<'}
          </button>

          <div style={{ marginTop: '20px' }}>
            {currentUser ? (
              <>
                <p className="greeting">
                    Hello, <span className="username">{currentUser.login}</span>
                  </p>
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthMode('login')}>Log In</button>
                <button onClick={() => setAuthMode('signup')}>Sign Up</button>
              </>
            )}
          </div>

          {authMode === 'login' && <LoginForm onClose={() => setAuthMode(null)} />}
          {authMode === 'signup' && <SignupForm onClose={() => setAuthMode(null)} />}
      <div style={{ marginTop: "20px" }}>
        <h3>Elements</h3>
         <DraggableItem type="photo" label="Photo" />
         <DraggableItem type="text" label="First Name" />
         <DraggableItem type="text" label="Last Name" />
         <DraggableItem type="text" label="Phone" />
         <DraggableItem type="text" label="Email" />
         <DraggableItem type="text" label="About me" />
         <DraggableItem type="list" label="Education" />
         <DraggableItem type="list" label="Hard skills" />
         <DraggableItem type="list" label="Soft skills" />
      </div>
    </div>
  );
};

export default Sidebar;
