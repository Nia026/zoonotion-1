import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export default function KelolaArtikel() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); // Tambahkan state loading
  const [error, setError] = useState(null);    // Tambahkan state error
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    setLoading(true); // Mulai loading
    setError(null);    // Reset error
    axios.get(`${API_BASE_URL}/api/articles`) // Gunakan API_BASE_URL
      .then(res => {
        setArticles(res.data);
        setLoading(false); // Selesai loading
      })
      .catch(err => {
        console.error("Error fetching articles:", err);
        setError("Gagal memuat artikel. Pastikan server backend berjalan."); // Set pesan error
        setLoading(false); // Selesai loading (dengan error)
        setArticles([]); // Kosongkan artikel jika ada error
      });
  };

  // --- NEW: Fungsi untuk menangani penghapusan artikel ---
  const handleDeleteArticle = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/articles/${id}`);
        alert("Artikel berhasil dihapus!");
        fetchArticles(); // Refresh daftar artikel setelah penghapusan
      } catch (err) {
        console.error("Error deleting article:", err);
        alert("Gagal menghapus artikel: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh"}}>
      <main style={{ flex: 1, padding: "40px 5vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 className="mb-5 zoo-main-title">Manajemen Artikel</h1>
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
              boxShadow: "0 2px 8px rgba(51,105,60,0.1)"
            }}
          >
            + Tambah Artikel
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0", color: "#33693C" }}>
            Loading artikel...
          </div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div style={{ color: "#888", fontSize: 18, textAlign: "center", padding: "50px 0" }}>Belum ada artikel.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {articles.map((artikel) => (
              <div
                key={artikel.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  display: "flex",
                  padding: 16,
                  gap: 20,
                  alignItems: "flex-start",
                  border: "1px solid #e5e7eb"
                }}
              >
                {/* Gambar Artikel */}
                {artikel.gambar_artikel && (
                  <img
                    src={`${API_BASE_URL}${artikel.gambar_artikel}`}
                    alt={artikel.judul_artikel}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 8
                    }}
                  />
                )}

                {/* Konten Artikel */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{artikel.judul_artikel}</h3>
                  <p style={{ fontSize: 14, color: "#444", marginBottom: 8 }}>
                    {artikel.isi_artikel ? artikel.isi_artikel.substring(0, 140) + "..." : "-"}
                  </p>
                  <div style={{ display: "flex", justifyContent: "flex-start", gap: 12 }}>
                    <button
                      onClick={() => navigate(`/edit-artikel/${artikel.id}`)}
                      style={{
                        background: "#1E824C",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 20px",
                        fontWeight: 500,
                        fontSize: 14,
                        cursor: "pointer"
                      }}
                    >
                      Kelola
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(artikel.id)}
                      style={{
                        background: "#D63031",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 20px",
                        fontWeight: 500,
                        fontSize: 14,
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}