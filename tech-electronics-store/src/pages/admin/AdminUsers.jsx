import { useEffect, useState, useContext } from "react";
import { FiTrash2, FiAlertTriangle, FiShield, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../../components/Loader/Loader";

function ConfirmDialog({ message, onConfirm, onCancel, confirmLabel = "Delete", danger = true }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
          <FiAlertTriangle size={40} color={danger ? "#ef4444" : "#f59e0b"} style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 16, color: "#1e293b", margin: 0 }}>{message}</p>
        </div>
        <div className="modal-actions">
          <button className="admin-btn" style={{ background: "#f1f5f9", color: "#475569" }} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="admin-btn"
            style={{ background: danger ? "#ef4444" : "#f59e0b", color: "white" }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);   // userId to delete
  const [confirmRole, setConfirmRole] = useState(null);     // { id, name, newRole }
  const [search, setSearch] = useState("");
  const { user: currentUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/admin/users/${confirmDelete}`);
      setConfirmDelete(null);
      await fetchUsers();
      toast.success("User deleted successfully.");
    } catch (err) {
      setConfirmDelete(null);
      toast.error(err?.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleRoleConfirmed = async () => {
    const { id, newRole } = confirmRole;
    setConfirmRole(null);
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole });
      await fetchUsers();
      toast.success(`Role updated to ${newRole}.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update role.");
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
                          background: u.role === "admin"
                            ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                            : "linear-gradient(135deg,#3b82f6,#2563eb)",
                          color: "white", display: "flex", alignItems: "center",
                          justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0,
                        }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <strong>{u.name}</strong>
                        {u._id === currentUser?._id && (
                          <span style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>(you)</span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: "#475569" }}>{u.email}</td>
                    <td>
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                    </td>
                    <td style={{ color: "#64748b" }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {/* Role toggle — available for all users except self */}
                        {u._id !== currentUser?._id && (
                          <button
                            className="admin-btn-icon"
                            style={{
                              background: u.role === "admin" ? "#f3f4f6" : "#ede9fe",
                              color: u.role === "admin" ? "#6b7280" : "#7c3aed",
                              border: "none",
                              borderRadius: 6,
                              padding: "5px 10px",
                              fontSize: 12,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                            title={u.role === "admin" ? "Demote to customer" : "Promote to admin"}
                            onClick={() => setConfirmRole({
                              id: u._id,
                              name: u.name,
                              newRole: u.role === "admin" ? "customer" : "admin",
                            })}
                          >
                            {u.role === "admin"
                              ? <><FiUser size={13} /> Make Customer</>
                              : <><FiShield size={13} /> Make Admin</>
                            }
                          </button>
                        )}

                        {/* Delete — not available for self */}
                        {u._id !== currentUser?._id ? (
                          <button
                            className="admin-btn-icon danger"
                            onClick={() => setConfirmDelete(u._id)}
                            title="Delete user"
                          >
                            <FiTrash2 />
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <ConfirmDialog
          message="Delete this user? All their data will be permanently removed."
          confirmLabel="Delete"
          danger
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Role change confirmation */}
      {confirmRole && (
        <ConfirmDialog
          message={`Change ${confirmRole.name}'s role to "${confirmRole.newRole}"?`}
          confirmLabel="Confirm"
          danger={false}
          onConfirm={handleRoleConfirmed}
          onCancel={() => setConfirmRole(null)}
        />
      )}
    </div>
  );
}

export default AdminUsers;
