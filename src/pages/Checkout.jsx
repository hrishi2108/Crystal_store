// src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, firestoreRestUrl } from "../firebaseConfig";
import axios from "axios";

function parseFirestoreDoc(doc) {
  return {
    id: doc.name.split("/").pop(),
    name: doc.fields.name.stringValue,
    price: doc.fields.price?.stringValue || "",
    imageUrl: doc.fields.imageUrl.stringValue,
  };
}

export default function Checkout() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && productId) {
        await fetchProduct(firebaseUser, productId);
      }
    });
    return () => unsubscribe();
  }, [productId]);

  async function fetchProduct(firebaseUser, id) {
    try {
      setLoading(true);
      const idToken = await firebaseUser.getIdToken();
      const res = await axios.get(`${firestoreRestUrl}/products/${id}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.data) {
        setProduct(parseFirestoreDoc(res.data));
      } else {
        setProduct(null);
      }
    } catch (err) {
      console.error(err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }
    alert(`Order placed for ${product.name}!\nShipping to: ${address}`);
    // Here, you can add actual order logic (save to DB, payment etc)
    navigate("/user/home"); // Redirect after "order"
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 20, color: "red" }}>Product not found.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "#b48c65", marginBottom: 24 }}>Checkout: {product.name}</h1>
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{ width: 250, height: 250, objectFit: "cover", borderRadius: 16, marginBottom: 20 }}
      />
      <p style={{ fontSize: 20, marginBottom: 20 }}>Price: ₹{product.price}</p>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: "600" }}>
          Shipping Address:
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={4}
          style={{
            width: "70%",
            padding: 10,
            fontSize: 16,
            borderRadius: 8,
            borderColor: "#ccc",
            resize: "vertical",
          }}
          placeholder="Enter your address here..."
          required
        />
        <button
          type="submit"
           style={{
              backgroundColor: "#b48c65",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 18,
            }}
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
