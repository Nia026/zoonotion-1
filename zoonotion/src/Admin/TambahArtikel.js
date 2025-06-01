import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TambahArtikel() {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [author, setAuthor] = useState("");
  const [gambar, setGambar] = useState(null); // Ubah dari string menjadi null (untuk file)
  const [gambarPreview, setGambarPreview] = useState(null); // State untuk pratinjau gambar
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");
  const navigate = useNavigate();

  // Handle perubahan file gambar
  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambar(file);
      setGambarPreview(URL.createObjectURL(file)); // Buat URL untuk pratinjau
    } else {
      setGambar(null);
      setGambarPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesan("");

    const formData = new FormData(); // Gunakan FormData untuk mengirim file
    formData.append("judul_artikel", judul);
    formData.append("isi_artikel", isi);
    formData.append("nama_author", author);
    if (gambar) {
      formData.append("gambar_artikel", gambar); // Append file jika ada. Nama field "gambar_artikel" harus sesuai dengan Multer di backend.
    }

    try {
      // Ubah cara mengirim data: gunakan formData dan set header Content-Type
      const response = await axios.post("http://localhost:5000/api/articles", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Penting untuk mengirim FormData
        },
      });
      setPesan(response.data.message || "Artikel berhasil ditambahkan!"); // Ambil pesan dari backend
      // Reset form
      setJudul("");
      setIsi("");
      setAuthor("");
      setGambar(null);
      setGambarPreview(null);
      setTimeout(() => navigate("/admin/kelola-artikel"), 1200);
    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.message
                           ? err.response.data.message
                           : "Gagal menambah artikel. Terjadi kesalahan jaringan atau server.";
      setPesan(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F8" }}>
      <main style={{ flex: 1, padding: "40px 5vw" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#222", marginBottom: 32 }}>
          Tambah Artikel
        </h1>
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            padding: 32,
            maxWidth: 520,
            margin: "0 auto"
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600 }}>Judul Artikel</label>
            <input
              type="text"
              value={judul}
              onChange={e => setJudul(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginTop: 6
              }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600 }}>Isi Artikel</label>
            <textarea
              value={isi}
              onChange={e => setIsi(e.target.value)}
              required
              rows={6}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginTop: 6,
                resize: "vertical"
              }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600 }}>Nama Author</label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginTop: 6
              }}
            />
          </div>
          {/* Bagian Input Gambar yang Diubah */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>Gambar Artikel</label>
            <input
              type="file" // Ubah type menjadi "file"
              accept="image/*" // Hanya izinkan file gambar
              onChange={handleGambarChange} // Gunakan handler baru
              style={{
                width: "100%",
                padding: '10px 0', // Sesuaikan padding karena type file
                borderRadius: 6,
                border: "1px solid #ccc", // Input type file tidak selalu mendukung border di semua browser
                marginTop: 6,
                boxSizing: 'border-box' // Penting untuk padding dan border
              }}
            />
            {gambarPreview && (
              <div style={{ marginTop: 15, textAlign: 'center' }}>
                <img
                  src={gambarPreview}
                  alt="Pratinjau Gambar Artikel"
                  style={{
                    maxWidth: '200px', // Batasi lebar pratinjau
                    maxHeight: '120px', // Batasi tinggi pratinjau
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #ddd'
                  }}
                />
              </div>
            )}
          </div>
          {/* End Bagian Input Gambar yang Diubah */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#33693C",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              fontWeight: 600,
              fontSize: 16,
              width: "100%",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Menyimpan..." : "Tambah Artikel"}
          </button>
          {pesan && (
            <div style={{
              marginTop: 18,
              color: pesan.includes("berhasil") ? "#33693C" : "#c00",
              textAlign: "center" // Agar pesan di tengah
            }}>
              {pesan}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}