import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth, firestoreRestUrl } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
const productTypes = ["Bracelet", "Ring", "Pendant", "Stone", "Earring", "Candle"];

function parseFirestoreDoc(doc) {
  return {
    id: doc.name.split("/").pop(),
    name: doc.fields.name.stringValue,
    type: doc.fields.type.stringValue,
    detail: doc.fields.detail.stringValue,
    price: parseFloat(doc.fields.price?.stringValue || "0"),
    imageUrl: doc.fields.imageUrl.stringValue,
  };
}

export default function Home() {
  const navigate = useNavigate();
  const [productsByType, setProductsByType] = useState({});
  const [filteredProductsByType, setFilteredProductsByType] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Search and sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none"); // 'asc', 'desc', or 'none'

  useEffect(() => {
    // Listen for auth user to get token
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) fetchProducts(firebaseUser);
      else setProductsByType({});
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Filter and sort products whenever productsByType, searchTerm or sortOrder change
    if (!productsByType) return;

    const filtered = {};
    productTypes.forEach((type) => {
      let products = productsByType[type] || [];

      // Search filter
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        products = products.filter((p) => p.name.toLowerCase().includes(term));
      }

      // Sorting
      if (sortOrder === "asc") {
        products = [...products].sort((a, b) => a.price - b.price);
      } else if (sortOrder === "desc") {
        products = [...products].sort((a, b) => b.price - a.price);
      }

      filtered[type] = products;
    });

    setFilteredProductsByType(filtered);
  }, [productsByType, searchTerm, sortOrder]);

  async function fetchProducts(firebaseUser) {
    try {
      setLoading(true);
      const idToken = await firebaseUser.getIdToken();
      const res = await axios.get(`${firestoreRestUrl}/products`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.data.documents) {
        const products = res.data.documents.map(parseFirestoreDoc);
        const grouped = {};
        productTypes.forEach((type) => {
          grouped[type] = products.filter((p) => p.type === type);
        });
        setProductsByType(grouped);
      } else {
        setProductsByType({});
      }
    } catch (err) {
      console.error("Error loading products", err);
      setProductsByType({});
    } finally {
      setLoading(false);
    }
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (loading) return <p style={{ padding: 20 }}>Loading products...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ color: "#b48c65", marginBottom: 12 }}>
        Welcome to Shankara Crystal Store
      </h1>

      {/* Search and Sort Controls */}
      <div style={styles.controlsContainer}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={styles.sortSelect}
        >
          <option value="none">Sort by Price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* NAVBAR BELOW THE HEADING */}
      <nav style={styles.navbar}>
        {productTypes.map((type) => (
          <button
            key={type}
            onClick={() => scrollToSection(type)}
            style={styles.navButton}
          >
            {type}s
          </button>
        ))}
      </nav>

      {/* Product sections */}
      {productTypes.map((type) => (
        <section
          key={type}
          id={type}
          style={{ marginBottom: 36, marginTop: 24 }}
        >
          <h2 style={{ color: "#b48c65", marginBottom: 12 }}>{type}s</h2>
          <div style={styles.productScroll}>
            {filteredProductsByType[type] && filteredProductsByType[type].length > 0 ? (
              filteredProductsByType[type].map((prod) => (
                <div key={prod.id} style={styles.productCard}>
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    style={styles.productImage}
                  />
                  <p style={styles.productName}>{prod.name}</p>
                  <p style={styles.productPrice}>₹{prod.price.toFixed(2)}</p>
                  <button
                    style={styles.viewButton}
                    onClick={() => navigate(`/user/product/${prod.id}`)}
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: "#999" }}>No products available</p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

const styles = {
  controlsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  searchInput: {
    padding: "8px 12px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    minWidth: 220,
    flexGrow: 1,
    maxWidth: 400,
  },
  sortSelect: {
  padding: "8px 12px",
  fontSize: 16,
  borderRadius: 8,
  border: "1px solid #ccc",
  minWidth: 120,
  maxWidth: 140,
},

  navbar: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
    overflowX: "auto",
    paddingBottom: 8,
  },
  navButton: {
    backgroundColor: "#b48c65",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 14,
    whiteSpace: "nowrap",
  },
 productScroll: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 24,
},
  productCard: {
    flex: "0 0 auto",
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
    padding: 14,
    textAlign: "center",
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    objectFit: "cover",
    marginBottom: 12,
  },
  productName: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#6f5e3b",
  },
  viewButton: {
    backgroundColor: "#b48c65",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
  },
};
