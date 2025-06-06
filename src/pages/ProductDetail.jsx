import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth, firestoreRestUrl } from "../firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";

function parseFirestoreDoc(doc) {
  return {
    id: doc.name.split("/").pop(),
    name: doc.fields.name.stringValue,
    type: doc.fields.type.stringValue,
    detail: doc.fields.detail.stringValue,
    price: doc.fields.price?.stringValue || "",
    imageUrl: doc.fields.imageUrl.stringValue,
  };
}

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && productId) {
        fetchProduct(firebaseUser, productId);
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
        const prod = parseFirestoreDoc(res.data);
        setProduct(prod);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Error loading product detail:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  function addToCart() {
    // Read cart from localStorage or create empty array
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Check if product already in cart
    const exists = cart.find((item) => item.id === product.id);
    if (!exists) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.name} added to cart!`);
    } else {
      alert(`${product.name} is already in the cart.`);
    }
  }

  function buyNow() {
    navigate(`/user/checkout/${product.id}`);
  }

  if (loading) return <p style={{ padding: 20 }}>Loading product details...</p>;
  if (!product) return <p style={{ padding: 20, color: "red" }}>Product not found.</p>;

  return (
    <div style={styles.container}>
      <h1 style={{ color: "#b48c65", marginBottom: 24 }}>{product.name}</h1>
      <div style={styles.content}>
        <img src={product.imageUrl} alt={product.name} style={styles.image} />
        <div style={styles.details}>
          <p style={styles.type}>Category: {product.type}</p>
          <p style={styles.detail}>{product.detail}</p>
          <p style={styles.price}>Price: ₹{product.price}</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={styles.cartButton} onClick={addToCart}>
              Add to Cart
            </button>
            <button style={styles.buyButton} onClick={buyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 20 },
  content: { display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" },
  image: {
    width: 350,
    height: 350,
    objectFit: "cover",
    borderRadius: 16,
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
  details: { flex: 1, minWidth: 280 },
  type: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#b48c65" },
  detail: { fontSize: 16, marginBottom: 24 },
  price: { fontSize: 22, fontWeight: "700", marginBottom: 24 },
  cartButton: {
    backgroundColor: "#7a5f3a",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "12px 24px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
  },
  buyButton: {
    backgroundColor: "#7a5f3a",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "12px 24px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
  },
};
