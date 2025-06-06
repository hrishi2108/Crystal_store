import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Admin and Auth Components
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";

// User Layout and Pages
import UserLayout from "./components/UserLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";  // <-- new import

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth & Admin Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* User Pages inside Layout */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />

          {/* Product Detail inside user layout */}
          <Route path="product/:productId" element={<ProductDetail />} />

          {/* Checkout page route */}
          <Route path="checkout/:productId" element={<Checkout />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
