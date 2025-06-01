import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import StaticNavbar from "./StaticNavbar";
import Footer from "./Footer";

function AdminLayout({ children }) {
  return (
    <div className="vh-100 d-flex flex-column">
      <StaticNavbar />

      <div className="d-flex flex-grow-1">
        <aside className="bg-light p-3" style={{ width: '200px' }}>
          <h4>Admin Panel</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/manajemen-event" className="nav-link">Manajemen Event</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/manajemen-zoo" className="nav-link">Manajemen Zoo</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/kelola-hewan" className="nav-link">Kelola Hewan</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/kelola-artikel" className="nav-link">Kelola Artikel</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/informasi" className="nav-link">Informasi</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">LOGOUT</Link>
            </li>
          </ul>
        </aside>
        <main className="flex-grow-1 p-3">{children}</main>
      </div>

      <Footer />
    </div>
  );
}

export default AdminLayout;