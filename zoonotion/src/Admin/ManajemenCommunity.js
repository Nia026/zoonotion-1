import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ManajemenCommunity() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/communities")
      .then(res => {
        setCommunities(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F8" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "40px 5vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>Manajemen Community</h1>
          <button
            onClick={() => navigate("/tambah-community")}
            style={{
              background: "#33693C",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 28px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(51,105,60,0.08)"
            }}
          >
            + Tambah Community
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : communities.length === 0 ? (
          <div style={{ color: "#888", fontSize: 18 }}>Belum ada data komunitas.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden" }}>
            <thead>
              <tr style={{ background: "#f4f6f8" }}>
                <th style={{ padding: 12, border: "1px solid #eee" }}>ID</th>
                <th style={{ padding: 12, border: "1px solid #eee" }}>Nama Komunitas</th>
                <th style={{ padding: 12, border: "1px solid #eee" }}>Penyelenggara</th>
                <th style={{ padding: 12, border: "1px solid #eee" }}>Tahun</th>
                <th style={{ padding: 12, border: "1px solid #eee" }}>Deskripsi</th>
                <th style={{ padding: 12, border: "1px solid #eee" }}>Banner</th>
              </tr>
            </thead>
            <tbody>
              {communities.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>{item.id}</td>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>{item.nama_komunitas}</td>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>{item.nama_penyelenggara || "-"}</td>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>{item.tahun_penyelenggara || "-"}</td>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>{item.deskripsi_komunitas || "-"}</td>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>
                    {item.banner_komunitas ? (
                      <img
                        src={item.banner_komunitas.startsWith("http") ? item.banner_komunitas : `http://localhost:5000${item.banner_komunitas}`}
                        alt="banner komunitas"
                        style={{ width: 80, height: 40, objectFit: "cover", borderRadius: 6 }}
                      />
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}