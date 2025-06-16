import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000"; // Pastikan ini sesuai dengan URL backend Anda

export default function KelolaHewan() {
  const [hewan, setHewan] = useState([]);
  const [loading, setLoading] = useState(true); // Tambahkan state loading
  const [error, setError] = useState(null);    // Tambahkan state error
  const navigate = useNavigate();

  useEffect(() => {
    fetchHewan();
  }, []);

  const fetchHewan = () => {
    setLoading(true); // Mulai loading
    setError(null);    // Reset error
    axios.get(`${API_BASE_URL}/api/educations`) // Gunakan API_BASE_URL
      .then(res => {
        setHewan(res.data);
        setLoading(false); // Selesai loading
      })
      .catch(err => {
        console.error("Error fetching educations:", err);
        setError("Gagal memuat data hewan. Pastikan server backend berjalan."); // Set pesan error
        setLoading(false); // Selesai loading (dengan error)
        setHewan([]); // Kosongkan data jika ada error
      });
  };

  // --- NEW: Fungsi untuk menangani penghapusan data hewan ---
  const handleDeleteHewan = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data hewan ini?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/educations/${id}`);
        alert("Data hewan berhasil dihapus!");
        fetchHewan(); // Refresh daftar hewan setelah penghapusan
      } catch (err) {
        console.error("Error deleting education:", err);
        alert("Gagal menghapus data hewan: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F8" }}>
      {/* Jika Anda memiliki komponen Sidebar, pastikan di sini */}
      {/* <Sidebar /> */}

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

        {/* Tambahkan kondisi loading dan error */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0", color: "#33693C" }}>
            Loading data hewan... {/* Anda bisa menambahkan spinner di sini */}
          </div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
            {error}
          </div>
        ) : hewan.length === 0 ? (
          <div style={{ color: "#888", fontSize: 18, textAlign: "center", padding: "50px 0" }}>Belum ada data hewan.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
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
                    src={`${API_BASE_URL}${item.gambar_hewan}`} 
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
                  <div style={{ display: "flex", gap: 10, marginTop: "auto" }}> {/* Container untuk tombol */}
                    {/* --- MODIFIED: Tombol Kelola (Edit) --- */}
                    <button
                      style={{
                        background: "#007bff", // Warna biru untuk edit
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 0",
                        fontWeight: 500,
                        fontSize: 15,
                        cursor: "pointer",
                        flex: 1 // Agar tombol mengisi ruang yang tersedia
                      }}
                      onClick={() => navigate(`/edit-hewan/${item.id}`)}
                    >
                      Kelola
                    </button>
                    {/* --- NEW: Tombol Delete --- */}
                    <button
                      style={{
                        background: "#dc3545", // Warna merah untuk delete
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 0",
                        fontWeight: 500,
                        fontSize: 15,
                        cursor: "pointer",
                        flex: 1
                      }}
                      onClick={() => handleDeleteHewan(item.id)}
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