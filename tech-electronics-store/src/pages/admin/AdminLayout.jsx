import { NavLink, Outlet } from "react-router-dom";
import { FiHome, FiPackage, FiUsers, FiShoppingBag } from "react-icons/fi";
import "./Admin.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3 className="admin-sidebar-title">Dashboard</h3>
        <NavLink to="/admin" end className="admin-sidebar-link">
          <FiHome /> Overview
        </NavLink>

        <h3 className="admin-sidebar-title">Manage</h3>
        <NavLink to="/admin/products" className="admin-sidebar-link">
          <FiPackage /> Products
        </NavLink>
        <NavLink to="/admin/orders" className="admin-sidebar-link">
          <FiShoppingBag /> Orders
        </NavLink>
        <NavLink to="/admin/users" className="admin-sidebar-link">
          <FiUsers /> Users
        </NavLink>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
