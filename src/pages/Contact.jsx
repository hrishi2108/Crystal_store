// src/pages/Contact.jsx
import React from "react";

export default function Contact() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Contact Us</h1>
      <p style={styles.text}>
        We'd love to hear from you! Whether you have questions, feedback, or
        just want to say hello, feel free to reach out at:
      </p>

      <p style={styles.contactInfo}>
        <strong>Email:</strong> support@shankara.com
        <br />
        <strong>Phone:</strong> +91 98765 43210
        <br />
        <strong>Address:</strong> 123 Crystal Lane, Varanasi , Uttar Pradesh, India
      </p>

      <p style={styles.text}>
        You can also message us on our social media channels or visit our store
        during business hours.
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: "60px auto",
    padding: 30,
    backgroundColor: "#f5f1e9",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(180, 140, 101, 0.3)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#5c4a29",
    lineHeight: 1.6,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#b48c65",
    marginBottom: 24,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  contactInfo: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
    color: "#6f5e3b",
    whiteSpace: "pre-line",
  },
};
