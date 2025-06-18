import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

export default function KelolaHewan() {
  const [hewan, setHewan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kategoriAktif, setKategoriAktif] = useState("Aves"); // 🌟 Tambahan
  const navigate = useNavigate();

  const kategoriList = ["Aves", "Mamalia", "Pisces", "Amfibi", "Reptil"]; // 🌟 Tambahan

  useEffect(() => {
    fetchHewan();
  }, []);

  const fetchHewan = () => {
    setLoading(true);
    setError(null);
    axios.get(`${API_BASE_URL}/api/educations`)
      .then(res => {
        setHewan(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching educations:", err);
        setError("Gagal memuat data hewan. Pastikan server backend berjalan.");
        setLoading(false);
        setHewan([]);
      });
  };

  const handleDeleteHewan = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data hewan ini?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/educations/${id}`);
        alert("Data hewan berhasil dihapus!");
        fetchHewan();
      } catch (err) {
        console.error("Error deleting education:", err);
        alert("Gagal menghapus data hewan: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // 🌟 Filter hewan berdasarkan kategori aktif
  const filteredHewan = hewan.filter(h => h.kategori_hewan === kategoriAktif);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
      <main style={{ flex: 1, padding: "40px 5vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <h1 className="mb-5 zoo-main-title">Manajemen Hewan</h1>
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
              boxShadow: "0 2px 8px rgba(51,105,60,0.1)"
            }}
          >
            TAMBAHKAN HEWAN &nbsp;+
          </button>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {kategoriList.map((kategori, idx) => (
            <button
              key={idx}
              onClick={() => setKategoriAktif(kategori)}
              style={{
                borderRadius: 20,
                padding: "6px 18px",
                border: kategori === kategoriAktif ? "none" : "1px solid #ccc",
                backgroundColor: kategori === kategoriAktif ? "#B1906E" : "#fff",
                color: kategori === kategoriAktif ? "#fff" : "#333",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer"
              }}
            >
              {kategori}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#33693C" }}>
            Memuat data hewan...
          </div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", padding: 20 }}>{error}</div>
        ) : filteredHewan.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", padding: 40 }}>
            Tidak ada hewan dalam kategori <strong>{kategoriAktif}</strong>.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <th style={{ padding: "10px 0", textAlign: "left" }}>Gambar</th>
                <th style={{ padding: "10px 0", textAlign: "left" }}>Nama</th>
                <th style={{ padding: "10px 0", textAlign: "left" }}>Kategori</th>
                <th style={{ padding: "10px 0", textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHewan.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "16px 0" }}>
                    {item.gambar_hewan && (
                      <img
                        src={`${API_BASE_URL}${item.gambar_hewan}`}
                        alt={item.nama_hewan}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                    )}
                  </td>
                  <td style={{ fontSize: 16, fontWeight: 500 }}>{item.nama_hewan}</td>
                  <td>
                    <span
                      style={{
                        fontSize: 13,
                        backgroundColor: "#EEE6D9",
                        padding: "4px 12px",
                        borderRadius: 12,
                        color: "#6B4E37",
                        fontWeight: 500
                      }}
                    >
                      {item.kategori_hewan}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span
                        onClick={() => navigate(`/edit-hewan/${item.id}`)}
                        style={{
                          cursor: "pointer",
                          color: "#4CAF50",
                          fontSize: 18
                        }}
                      >
                        ✏️
                      </span>
                      <span
                        onClick={() => handleDeleteHewan(item.id)}
                        style={{
                          cursor: "pointer",
                          color: "#DC3545",
                          fontSize: 18
                        }}
                      >
                        🗑️
                      </span>
                    </div>
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
