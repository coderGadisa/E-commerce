import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "./Profile.css";

function Profile() {
  useDocumentTitle("My Profile");
  const { user, logout } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "",
    street: "", city: "", state: "", zipCode: "", country: "",
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
        country: user.address?.country || "",
        currentPassword: "", newPassword: "", confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCancel = () => {
    setEditing(false);
    // reset back to current user data
    setForm({
      name: user.name || "", email: user.email || "",
      street: user.address?.street || "", city: user.address?.city || "",
      state: user.address?.state || "", zipCode: user.address?.zipCode || "",
      country: user.address?.country || "",
      currentPassword: "", newPassword: "", confirmPassword: "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        name: form.name,
        email: form.email,
        address: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, country: form.country },
      };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      await api.put("/users/profile", payload);
      // Refresh user data in localStorage
      const res = await api.get("/users/profile");
      const updated = res.data.data;
      localStorage.setItem("user", JSON.stringify({ ...user, ...updated }));
      toast.success("Profile updated successfully!");
      setEditing(false);
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span className="profile-role">{user?.role}</span>
          </div>
        </div>

        {!editing ? (
          <>
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-info-grid">
                <div><strong>Name:</strong> {form.name}</div>
                <div><strong>Email:</strong> {form.email}</div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Shipping Address</h3>
              <div className="profile-info-grid">
                <div><strong>Street:</strong> {form.street || "—"}</div>
                <div><strong>City:</strong> {form.city || "—"}</div>
                <div><strong>State:</strong> {form.state || "—"}</div>
                <div><strong>ZIP:</strong> {form.zipCode || "—"}</div>
                <div><strong>Country:</strong> {form.country || "—"}</div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn-edit" onClick={() => setEditing(true)}>Edit Profile</button>
              <button className="btn-logout" onClick={logout}>Logout</button>
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="profile-form" noValidate>
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} />
              </div>
            </div>

            <div className="profile-section">
              <h3>Shipping Address</h3>
              <div className="form-group">
                <label>Street</label>
                <input name="street" value={form.street} onChange={handleChange} />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={form.state} onChange={handleChange} />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input name="country" value={form.country} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Change Password (Optional)</h3>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
