import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Courses from './components/Courses/Courses';
import Home from './components/Home/Home';
import Header from './components/Layout/Header/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
