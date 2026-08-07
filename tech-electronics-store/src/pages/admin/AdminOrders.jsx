import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader/Loader";

const STATUS_OPTIONS = ["processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS = {
  processing: { bg: "#fef9c3", color: "#92400e" },
  shipped:    { bg: "#dbeafe", color: "#1e40af" },
  delivered:  { bg: "#dcfce7", color: "#166534" },
  cancelled:  { bg: "#fee2e2", color: "#991b1b" },
  pending:    { bg: "#fef9c3", color: "#92400e" },
  paid:       { bg: "#dcfce7", color: "#166534" },
  failed:     { bg: "#fee2e2", color: "#991b1b" },
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null); // orderId being updated

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/orders");
      const raw = res.data;
      setOrders(Array.isArray(raw.data) ? raw.data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await api.put(`/admin/orders/${orderId}`, { orderStatus: newStatus });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                orderStatus: newStatus,
                paymentStatus: newStatus === "delivered" ? "paid" : o.paymentStatus,
              }
            : o
        )
      );
      toast.success(`Order status updated to "${newStatus}".`);
    } catch {
      toast.error("Failed to update order status.");
      await fetchOrders();
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter((o) => {
    const statusMatch = filter === "all" || o.orderStatus === filter;
    const searchMatch =
      !search ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  const Badge = ({ value }) => {
    const s = STATUS_COLORS[value] ?? { bg: "#f1f5f9", color: "#475569" };
    return (
      <span
        className="badge"
        style={{ background: s.bg, color: s.color, textTransform: "capitalize" }}
      >
        {value}
      </span>
    );
  };

  return (
    <div>
      <h1 className="admin-page-title">Manage Orders</h1>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Orders ({filtered.length})</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              className="admin-search"
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="admin-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40 }}><Loader size="medium" /></div>
        ) : filtered.length === 0 ? (
          <p style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
            No orders found.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Order Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o._id}>
                    <td>
                      <strong style={{ fontFamily: "monospace" }}>
                        #{o._id.slice(-8).toUpperCase()}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{o.user?.name ?? "—"}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{o.user?.email ?? ""}</div>
                    </td>
                    <td style={{ color: "#475569" }}>{o.items?.length ?? 0} item(s)</td>
                    <td style={{ fontWeight: 700 }}>ETB {o.totalPrice?.toLocaleString()}</td>
                    <td><Badge value={o.orderStatus} /></td>
                    <td><Badge value={o.paymentStatus} /></td>
                    <td style={{ color: "#64748b", fontSize: 13 }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        value={o.orderStatus}
                        onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                        disabled={updating === o._id || o.orderStatus === "delivered"}
                        style={{ fontSize: 12, padding: "5px 8px", opacity: updating === o._id ? 0.5 : 1 }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
