import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiX, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader/Loader";
import { getImageSrc } from "../../utils/constants";

const CATEGORIES = ["Laptop", "Phone", "Accessories", "Monitor", "Smart Watch", "Other"];

const emptyForm = { name: "", category: "", description: "", price: "", stock: "", image: "" };

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
          <FiAlertTriangle size={40} color="#ef4444" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 16, color: "#1e293b", margin: 0 }}>{message}</p>
        </div>
        <div className="modal-actions">
          <button className="admin-btn" style={{ background: "#f1f5f9", color: "#475569" }} onClick={onCancel}>
            Cancel
          </button>
          <button className="admin-btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formError, setFormError] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products?limit=200");
      const raw = res.data;
      setProducts(Array.isArray(raw.data) ? raw.data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openModal = (product = null) => {
    setFormError("");
    setImageFile(null);
    if (product) {
      setEditingId(product._id);
      setForm({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
      });
      setImagePreview(getImageSrc(product.image));
    } else {
      setEditingId(null);
      setForm(emptyForm);
      setImagePreview("");
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError("");
    setImageFile(null);
    setImagePreview("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.description || !form.price || !form.stock) {
      setFormError("Please fill in all required fields.");
      return;
    }
    if (!editingId && !imageFile) {
      setFormError("Please upload a product image.");
      return;
    }
    try {
      setSaving(true);
      const data = new FormData();
      data.append("name", form.name);
      data.append("category", form.category);
      data.append("description", form.description);
      data.append("price", Number(form.price));
      data.append("stock", Number(form.stock));
      if (imageFile) {
        data.append("image", imageFile);
      } else if (editingId && form.image) {
        data.append("image", form.image);
      }

      if (editingId) {
        await api.put(`/admin/products/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully.");
      } else {
        await api.post("/admin/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created successfully.");
      }
      await fetchProducts();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/admin/products/${confirmId}`);
      setConfirmId(null);
      await fetchProducts();
      toast.success("Product deleted.");
    } catch (err) {
      setConfirmId(null);
      toast.error(err.response?.data?.message || "Failed to delete product.");
    }
  };

  const displayed = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="admin-page-title">Manage Products</h1>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Products ({displayed.length})</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              className="admin-search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="admin-btn btn-primary" onClick={() => openModal()}>
              <FiPlus /> Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40 }}><Loader size="medium" /></div>
        ) : displayed.length === 0 ? (
          <p style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
            No products found.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price (ETB)</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img src={getImageSrc(p.image)} alt={p.name} className="admin-thumb" />
                    </td>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.category}</td>
                    <td>{p.price?.toLocaleString()}</td>
                    <td>
                      <span style={{ color: p.stock === 0 ? "#ef4444" : p.stock < 5 ? "#f59e0b" : "#16a34a", fontWeight: 600 }}>
                        {p.stock}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button className="admin-btn-icon" onClick={() => openModal(p)} title="Edit">
                        <FiEdit />
                      </button>
                      <button
                        className="admin-btn-icon danger"
                        onClick={() => setConfirmId(p._id)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Close">
                <FiX />
              </button>
            </div>

            {formError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 14, marginBottom: 16 }}>
                {formError}
              </div>
            )}

            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. HP Pavilion Laptop" />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select category...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the product..."
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Price (ETB) *</label>
                  <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="0" />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image {!editingId && "*"}</label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
                  />
                )}
                <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange} />
                {editingId && (
                  <small style={{ color: "#64748b", fontSize: 12 }}>
                    Leave empty to keep existing image.
                  </small>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="admin-btn" style={{ background: "#f1f5f9", color: "#475569" }} onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmId && (
        <ConfirmDialog
          message="Are you sure you want to delete this product? This cannot be undone."
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}

export default AdminProducts;
