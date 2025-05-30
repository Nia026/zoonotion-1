import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function KelolaArtikel() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/articles")
      .then(res => setArticles(res.data))
      .catch(() => setArticles([]));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F8" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "40px 5vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>Kelola Artikel</h1>
          <button
            onClick={() => navigate("/tambah-artikel")}
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
            + Tambah Artikel
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
          {articles.length === 0 && (
            <div style={{ color: "#888", fontSize: 18 }}>Belum ada artikel.</div>
          )}
          {articles.map((artikel) => (
            <div
              key={artikel.id}
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
              {artikel.gambar_artikel && (
                <img
                  src={artikel.gambar_artikel}
                  alt={artikel.judul_artikel}
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
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{artikel.judul_artikel}</h3>
                <p style={{ fontSize: 14, color: "#444", marginBottom: 8, flex: 1, minHeight: 40 }}>
                  {artikel.isi_artikel ? artikel.isi_artikel.substring(0, 100) + "..." : "-"}
                </p>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
                  Author: {artikel.nama_author}
                </div>
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
                  onClick={() => navigate(`/detail-artikel/${artikel.id}`)}
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