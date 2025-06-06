// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  function removeFromCart(productId) {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  function proceedToCheckout() {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    // For now, navigate to checkout page of the first product
    navigate(`/user/checkout/${cart[0].id}`);
  }

  if (cart.length === 0)
    return <p style={{ padding: 20, fontSize: 18 }}>Your cart is empty.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "#b48c65", marginBottom: 24 }}>Your Cart</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {cart.map((product) => (
          <li
            key={product.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 12,
              borderBottom: "1px solid #ddd",
            }}
          >
            <div>
              <strong>{product.name}</strong> — ₹{product.price}
            </div>
            <button
              style={{
                backgroundColor: "#b48c65",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => removeFromCart(product.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <p style={{ fontSize: 20, fontWeight: "700", marginTop: 20 }}>
        Total: ₹{totalPrice}
      </p>

      <button
        style={{
          marginTop: 24,
          backgroundColor: "#b48c65",
          color: "white",
          border: "none",
          borderRadius: 8,
          padding: "12px 24px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: 18,
        }}
        onClick={proceedToCheckout}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
