import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Courses from './components/Courses/Courses';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Footer from './components/Layout/Footer/Footer';
import Header from './components/Layout/Header/Header';
import Register from './components/Auth/Register';
import ForgetPassword from './components/Auth/ForgetPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Contact from './components/Contact/Contact';
import Request from './components/Request/Request';
import About from './components/About/About';
import Subscribe from './components/Payments/Subscribe';
import NotFound from './components/Layout/NotFound/NotFound';
import PaymentSuccess from './components/Payments/PaymentSuccess';
import PaymentFail from './components/Payments/PaymentFail';
import CoursePage from './components/CoursePage/CoursePage';

function App() {
  window.addEventListener('contextmenu', e => {
    e.preventDefault();
  });

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/request" element={<Request />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-fail" element={<PaymentFail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
