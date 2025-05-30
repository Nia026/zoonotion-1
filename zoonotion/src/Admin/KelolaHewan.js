import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function KelolaHewan() {
  const [hewan, setHewan] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/educations")
      .then(res => setHewan(res.data))
      .catch(() => setHewan([]));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F8" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "40px 5vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>Kelola Hewan</h1>
          <button
            onClick={() => navigate("/tambah-hewan")}
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
            + Tambah Hewan
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
          {hewan.length === 0 && (
            <div style={{ color: "#888", fontSize: 18 }}>Belum ada data hewan.</div>
          )}
          {hewan.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                width: 340,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: "1px solid #e5e7eb"
              }}
            >
              {item.gambar_hewan && (
                <img
                  src={item.gambar_hewan ? `http://localhost:5000${item.gambar_hewan}` : ""}
                  alt={item.nama_hewan}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />
              )}
              <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{item.nama_hewan}</h3>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>
                  Kategori: {item.kategori_hewan}
                </div>
                <p style={{ fontSize: 14, color: "#444", marginBottom: 16, flex: 1 }}>
                  {item.deskripsi_hewan ? item.deskripsi_hewan.substring(0, 100) + "..." : "-"}
                </p>
                <button
                  style={{
                    background: "#33693C",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 0",
                    fontWeight: 500,
                    fontSize: 15,
                    cursor: "pointer",
                    width: "100%"
                  }}
                  // onClick={() => navigate(`/detail-hewan/${item.id}`)}
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}