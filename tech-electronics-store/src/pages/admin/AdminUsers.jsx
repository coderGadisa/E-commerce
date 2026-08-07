import { useEffect, useState, useContext } from "react";
import { FiTrash2, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../../components/Loader/Loader";

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

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch] = useState("");
  const { user: currentUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      const raw = res.data;
      setUsers(Array.isArray(raw.data) ? raw.data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/admin/users/${confirmId}`);
      setConfirmId(null);
      await fetchUsers();
      toast.success("User deleted successfully.");
    } catch {
      setConfirmId(null);
      toast.error("Failed to delete user.");
    }
  };

  const displayed = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="admin-page-title">Manage Users</h1>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>All Users ({displayed.length})</h2>
          <input
            className="admin-search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ padding: 40 }}><Loader size="medium" /></div>
        ) : displayed.length === 0 ? (
          <p style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>No users found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: "50%",
                          background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                          color: "white", display: "flex", alignItems: "center",
                          justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0,
                        }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: "#475569" }}>{u.email}</td>
                    <td>
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                    </td>
                    <td style={{ color: "#64748b" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {/* Prevent admin from deleting themselves */}
                      {u._id !== currentUser?._id ? (
                        <button
                          className="admin-btn-icon danger"
                          onClick={() => setConfirmId(u._id)}
                          title="Delete user"
                        >
                          <FiTrash2 />
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>You</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmId && (
        <ConfirmDialog
          message="Delete this user? All their data will be permanently removed."
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}

export default AdminUsers;
