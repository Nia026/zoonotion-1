import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar"; // Sesuaikan path jika Sidebar berada di lokasi berbeda

const API_BASE_URL = "http://localhost:5000"; // Pastikan ini sesuai dengan URL backend Anda

export default function EditArtikel() {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();

  const [judul_artikel, setJudulArtikel] = useState("");
  const [isi_artikel, setIsiArtikel] = useState("");
  const [nama_author, setNamaAuthor] = useState("");
  const [gambar_artikel, setGambarArtikel] = useState(null); // Untuk file gambar baru
  const [preview_gambar, setPreviewGambar] = useState(null); // Untuk menampilkan preview gambar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false); // State untuk status submit

  useEffect(() => {
    const fetchArticleById = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/articles/${id}`);
        const data = res.data;
        setJudulArtikel(data.judul_artikel);
        setIsiArtikel(data.isi_artikel);
        setNamaAuthor(data.nama_author);
        if (data.gambar_artikel) {
          setPreviewGambar(`${API_BASE_URL}${data.gambar_artikel}`);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Gagal memuat data artikel. Pastikan ID benar dan server berjalan.");
        setLoading(false);
      }
    };

    fetchArticleById();
  }, [id]); // id sebagai dependency agar useEffect dijalankan ulang jika ID berubah

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setGambarArtikel(file);
    if (file) {
      setPreviewGambar(URL.createObjectURL(file)); // Membuat URL preview dari file
    } else {
      setPreviewGambar(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("judul_artikel", judul_artikel);
    formData.append("isi_artikel", isi_artikel);
    formData.append("nama_author", nama_author);
    if (gambar_artikel) {
      formData.append("gambar_artikel", gambar_artikel); // Hanya tambahkan jika ada file baru
    }

    try {
      const res = await axios.put(`${API_BASE_URL}/api/articles/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Penting untuk mengirim file
        },
      });
      alert("Artikel berhasil diperbarui!");
      navigate("/admin/kelola-artikel"); // Kembali ke halaman kelola artikel
    } catch (err) {
      console.error("Error updating article:", err);
      setError("Gagal memperbarui artikel: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0", color: "#33693C" }}>
        Memuat data artikel...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F8" }}>
      {/* Jika Anda memiliki komponen Sidebar, pastikan di sini */}
      {/* <Sidebar /> */}

      <main style={{ flex: 1, padding: "40px 5vw" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#222", marginBottom: 32 }}>Edit Artikel</h1>
        <div style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          padding: 30,
          maxWidth: 800,
          margin: "0 auto"
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="judul_artikel" style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>Judul Artikel:</label>
              <input
                type="text"
                id="judul_artikel"
                value={judul_artikel}
                onChange={(e) => setJudulArtikel(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="isi_artikel" style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>Isi Artikel:</label>
              <textarea
                id="isi_artikel"
                value={isi_artikel}
                onChange={(e) => setIsiArtikel(e.target.value)}
                required
                rows="8"
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="nama_author" style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>Nama Author:</label>
              <input
                type="text"
                id="nama_author"
                value={nama_author}
                onChange={(e) => setNamaAuthor(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="gambar_artikel" style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#333" }}>Gambar Artikel (Opsional):</label>
              <input
                type="file"
                id="gambar_artikel"
                accept="image/*"
                onChange={handleFileChange}
                style={{ ...inputStyle, border: "1px solid #ddd", padding: "10px" }}
              />
              {preview_gambar && (
                <div style={{ marginTop: 15, textAlign: "center" }}>
                  <p style={{ marginBottom: 10, fontSize: 14, color: "#555" }}>Preview Gambar:</p>
                  <img src={preview_gambar} alt="Preview" style={{ maxWidth: "100%", maxHeight: 250, borderRadius: 8, border: "1px solid #eee" }} />
                </div>
              )}
              {!preview_gambar && !gambar_artikel && (
                 <p style={{ fontSize: 13, color: "#888", marginTop: 5 }}>Tidak ada gambar yang dipilih. Gambar lama akan dipertahankan jika tidak ada gambar baru diunggah.</p>
              )}
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting ? "#6c757d" : "#33693C",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 28px",
                fontWeight: 600,
                fontSize: 18,
                cursor: submitting ? "not-allowed" : "pointer",
                width: "100%",
                transition: "background-color 0.2s ease",
                boxShadow: "0 2px 8px rgba(51,105,60,0.08)"
              }}
            >
              {submitting ? "Memperbarui..." : "Perbarui Artikel"}
            </button>
            {error && (
              <div style={{ color: "red", textAlign: "center", marginTop: 20 }}>
                {error}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  border: "1px solid #ccc",
  borderRadius: 8,
  fontSize: 16,
  boxSizing: "border-box", // Penting untuk padding
  transition: "border-color 0.2s ease",
};