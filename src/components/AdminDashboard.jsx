import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth, firestoreRestUrl } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const productTypes = ["Bracelet", "Ring", "Pendant", "Stone", "Earring", "Candle"];

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: productTypes[0],
    detail: "",
    price: "",
    imageUrl: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 🔐 Watch for login status
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) fetchProducts(firebaseUser);
    });
    return () => unsub();
  }, []);

  // 🔐 Get headers with Firebase ID token
  async function getAuthHeaders() {
    if (!user) throw new Error("User not authenticated");
    const idToken = await user.getIdToken();
    return {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
  }

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

  async function fetchProducts(firebaseUser = user) {
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await axios.get(`${firestoreRestUrl}/products`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (res.data.documents) {
        setProducts(res.data.documents.map(parseFirestoreDoc));
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const productData = {
      fields: {
        name: { stringValue: form.name },
        type: { stringValue: form.type },
        detail: { stringValue: form.detail },
        price: { stringValue: form.price },
        imageUrl: { stringValue: form.imageUrl },
      },
    };

    try {
      if (!user) throw new Error("User not authenticated");

      const headers = await getAuthHeaders();

      if (editId) {
        await axios.patch(`${firestoreRestUrl}/products/${editId}`, productData, headers);
      } else {
        await axios.post(`${firestoreRestUrl}/products`, productData, headers);
      }

      await fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      name: "",
      type: productTypes[0],
      detail: "",
      price: "",
      imageUrl: "",
    });
    setEditId(null);
  }

  function handleEdit(product) {
    setForm({
      name: product.name,
      type: product.type,
      detail: product.detail,
      price: product.price || "",
      imageUrl: product.imageUrl,
    });
    setEditId(product.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure to delete this product?")) return;
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${firestoreRestUrl}/products/${id}`, headers);
      await fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard - Products</h1>

      {!user ? (
        <p>Please login to manage products.</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required style={styles.input} />

            <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
              {productTypes.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>

            <textarea name="detail" placeholder="Detailed Description" value={form.detail} onChange={handleChange} rows={4} style={styles.textarea} />

            <input type="text" name="price" placeholder="Price (e.g., 25.99)" value={form.price} onChange={handleChange} style={styles.input} required />

            <input type="text" name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} style={styles.input} required />

            {form.imageUrl && <img src={form.imageUrl} alt="Preview" style={styles.imagePreview} onError={(e) => (e.target.style.display = "none")} />}

            <button type="submit" disabled={loading} style={styles.button}>
              {editId ? (loading ? "Updating..." : "Update Product") : loading ? "Adding..." : "Add Product"}
            </button>

            {editId && (
              <button type="button" onClick={resetForm} style={styles.cancelButton}>
                Cancel Edit
              </button>
            )}
          </form>

          <hr style={{ margin: "20px 0" }} />

          <h2 style={{ marginBottom: 12 }}>Product List</h2>
          {products.length === 0 && <p>No products found</p>}
          <ul style={styles.productList}>
            {products.map((prod) => (
              <li key={prod.id} style={styles.productItem}>
                <img src={prod.imageUrl} alt={prod.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }} />
                <div style={{ flex: 1, marginLeft: 12 }}>
                  <strong>{prod.name}</strong> <br />
                  <em>Type: {prod.type}</em> <br />
                  <em>Price: ${prod.price}</em> <br />
                  <p style={{ marginTop: 6 }}>{prod.detail}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <button onClick={() => handleEdit(prod)} style={styles.editButton}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(prod.id)} style={styles.deleteButton}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "auto",
    backgroundColor: "#f5f1eb",
    padding: 20,
    borderRadius: 8,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 20,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  textarea: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
    resize: "vertical",
  },
  imagePreview: {
    width: 150,
    height: 150,
    objectFit: "cover",
    borderRadius: 6,
    marginTop: 10,
  },
 button: {
  padding: "12px 20px",
  backgroundColor: "#b48c65", 
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#fff",
  fontSize: "16px",
  transition: "background-color 0.3s ease",
},
  cancelButton: {
    padding: 10,
    backgroundColor: "#aaa",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    color: "#fff",
  },
  productList: {
    listStyle: "none",
    padding: 0,
  },
  productItem: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
  },
  editButton: {
    backgroundColor: "#f0ad4e",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
};
