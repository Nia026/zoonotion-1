import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar" style={{
      width: "220px",
      background: "#222",
      color: "#fff",
      padding: "32px 0 0 0",
      minHeight: "100vh"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "32px", fontSize: "1.3rem" }}>ADMIN MENU</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ padding: "16px 32px", cursor: "pointer" }} onClick={() => navigate("/admin/manajemen-event")}>MANAJEMEN EVENT</li>
        <li style={{ padding: "16px 32px", cursor: "pointer" }} onClick={() => navigate("/admin/manajemen-community")}>MANAJEMEN COMMUNITY</li>
        <li style={{ padding: "16px 32px", cursor: "pointer" }} onClick={() => navigate("/admin/manajemen-galeri")}>MANAJEMEN GALERI</li>
        <li style={{ padding: "16px 32px", cursor: "pointer" }} onClick={() => navigate("/admin/manajemen-zoo")}>MANAJEMEN ZOO</li>
        <li style={{ padding: "16px 32px", cursor: "pointer" }} onClick={() => navigate("/admin/kelola-hewan")}>KELOLA HEWAN</li>
        <li style={{ padding: "16px 32px", cursor: "pointer" }} onClick={() => navigate("/admin/kelola-artikel")}>KELOLA ARTIKEL</li>
        <li style={{ padding: "16px 32px", cursor: "pointer" }} onClick={() => navigate("/admin/informasi")}>INFORMASI</li>

      </ul>
    </div>
  );
};

export default Sidebar;