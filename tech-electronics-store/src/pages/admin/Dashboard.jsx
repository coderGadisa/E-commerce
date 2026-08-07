import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiShoppingBag, FiPackage, FiClock } from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/Loader/Loader";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="admin-page-title">Dashboard Overview</h1>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{stats?.totalUsers ?? 0}</div>
          <Link to="/admin/users" className="stat-sub">View all →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{stats?.totalOrders ?? 0}</div>
          <Link to="/admin/orders" className="stat-sub">View all →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">ETB {Number(stats?.totalRevenue ?? 0).toLocaleString()}</div>
          <div className="stat-sub">All-time earnings</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Pending Orders</div>
          <div className="stat-value">{stats?.pendingOrders ?? 0}</div>
          <div className="stat-sub">Awaiting shipment</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{stats?.completedOrders ?? 0}</div>
          <div className="stat-sub">Successfully delivered</div>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1e293b" }}>
          Quick Actions
        </h2>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link to="/admin/products" className="admin-btn btn-primary">
            <FiPackage /> Manage Products
          </Link>
          <Link to="/admin/orders" className="admin-btn btn-primary">
            <FiClock /> View Orders
          </Link>
          <Link to="/admin/users" className="admin-btn btn-primary">
            <FiUsers /> View Users
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
