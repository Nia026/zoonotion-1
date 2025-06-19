import React from "react";
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import StaticNavbar from "./StaticNavbar";
import Footer from "./Footer";

function AdminLayout({ children }) {
  return (
    <div className="d-flex flex-column vh-100 overflow-hidden">
      <StaticNavbar />

      <div className="d-flex flex-grow-1" style={{ overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside
          className="bg-white shadow-sm border-end"
          style={{
            width: '240px',
            padding: '24px 16px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <h5 className="fw-bold text-success mb-4 px-2">Admin Panel</h5>
          <ul className="nav flex-column gap-2">
            {[
              { to: "/admin/dashboard", label: "Dashboard" },
              { to: "/admin/manajemen-event", label: "Manajemen Event" },
              { to: "/admin/kelolaZoo", label: "Manajemen Zoo" },
              { to: "/admin/kelola-hewan", label: "Kelola Hewan" },
              { to: "/admin/kelola-artikel", label: "Kelola Artikel" },
              // { to: "/admin/informasi", label: "Informasi" },
              { to: "/login", label: "LOGOUT" },
            ].map((item, index) => (
              <li className="nav-item" key={index}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded text-dark fw-medium transition-all ${
                      isActive ? 'bg-success text-white' : 'hover-bg'
                    }`
                  }
                  style={{ transition: 'all 0.2s ease' }}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1 overflow-auto p-4 bg-light">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default AdminLayout;
