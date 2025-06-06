// src/components/UserLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div>
      <nav style={styles.nav}>
        <div style={styles.logo}>Shankara</div>
        <ul style={styles.navLinks}>
          <li><Link to="/user/home" style={styles.link}>Home</Link></li>
          <li><Link to="/user/about" style={styles.link}>About</Link></li>
          <li><Link to="/user/contact" style={styles.link}>Contact</Link></li>
          <li><Link to="/user/cart" style={styles.link}>Cart</Link></li>
        </ul>
      </nav>
      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f1eb",
    padding: "10px 30px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#b48c65",
    fontFamily: "'Segoe UI', sans-serif",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    gap: 20,
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
};
