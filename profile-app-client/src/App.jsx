import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Signup from './components/SignUpPage';
import Login from './components/LoginPage';
import Profile from './pages/ProfilePage';

import IsPrivate from './components/IsPrivate';
import IsAnon from './components/IsAnon';

import './App.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={
            <IsAnon>
              <Signup />
            </IsAnon>
          }
        />
        <Route
          path="/login"
          element={
            <IsAnon>
              <Login />
            </IsAnon>
          }
        />
        <Route
          path="/profile"
          element={
            <IsPrivate>
              <Profile />
            </IsPrivate>
          }
        />
      </Routes>
    </div>
  );
}

export default App;