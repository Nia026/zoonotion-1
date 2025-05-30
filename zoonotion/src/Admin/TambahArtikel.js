import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TambahArtikel() {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [author, setAuthor] = useState("");
  const [gambar, setGambar] = useState("");
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesan("");
    try {
      await axios.post("http://localhost:5000/api/articles", {
        judul_artikel: judul,
        isi_artikel: isi,
        nama_author: author,
        gambar_artikel: gambar
      });
      setPesan("Artikel berhasil ditambahkan!");
      setTimeout(() => navigate("/admin/kelola-artikel"), 1200);
    } catch (err) {
      setPesan("Gagal menambah artikel.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F8" }}>
      <Sidebar />
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
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 600 }}>URL Gambar (opsional)</label>
            <input
              type="text"
              value={gambar}
              onChange={e => setGambar(e.target.value)}
              placeholder="https://..."
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginTop: 6
              }}
            />
          </div>
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
            <div style={{ marginTop: 18, color: pesan.includes("berhasil") ? "#33693C" : "#c00" }}>
              {pesan}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}