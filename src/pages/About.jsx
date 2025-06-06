// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About Shankara Crystal Store</h1>
      <p style={styles.paragraph}>
        Welcome to Shankara Crystal Store, your trusted source for beautiful and authentic crystals, bracelets, rings, and more.
        We are passionate about bringing you the finest quality crystals that inspire healing, positivity, and style.
      </p>
      <p style={styles.paragraph}>
        Our mission is to provide unique and ethically sourced crystals to help you enhance your well-being and spiritual journey.
        Each piece is carefully selected and crafted to ensure you get the best experience possible.
      </p>
      <p style={styles.paragraph}>
        Thank you for choosing Shankara Crystal Store. We hope our products bring you joy and positive energy.
      </p>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    maxWidth: 800,
    margin: "0 auto",
    color: "#5c4a29", // darker beige/brown text
    backgroundColor: "#f5f1e9", // off-white/beige background
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(180, 140, 101, 0.3)", // subtle shadow
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    lineHeight: 1.6,
  },
  title: {
    color: "#b48c65",
    marginBottom: 24,
    fontWeight: "700",
    fontSize: 32,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 18,
    marginBottom: 16,
  },
};
