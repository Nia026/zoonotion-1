import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TambahHewan() {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("Aves");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState(null);
  const [pesan, setPesan] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_hewan", nama);
    formData.append("kategori_hewan", kategori);
    formData.append("deskripsi_hewan", deskripsi);
    if (gambar) formData.append("gambar_hewan", gambar);

    try {
      await axios.post("http://localhost:5000/api/educations", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setPesan("Data hewan berhasil ditambahkan!");
      setTimeout(() => navigate("/admin/kelola-hewan"), 1200);
    } catch {
      setPesan("Gagal menambah data hewan.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F8" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "40px 5vw" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#222", marginBottom: 32 }}>
          Tambah Hewan
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
          encType="multipart/form-data"
        >
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600 }}>Nama Hewan</label>
            <input
              type="text"
              value={nama}
              onChange={e => setNama(e.target.value)}
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
            <label style={{ fontWeight: 600 }}>Kategori Hewan</label>
            <select
              value={kategori}
              onChange={e => setKategori(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginTop: 6
              }}
            >
              <option value="Aves">Aves</option>
              <option value="Mamalia">Mamalia</option>
              <option value="Pisces">Pisces</option>
              <option value="Amfibi">Amfibi</option>
              <option value="Reptil">Reptil</option>
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600 }}>Deskripsi Hewan</label>
            <textarea
              value={deskripsi}
              onChange={e => setDeskripsi(e.target.value)}
              required
              rows={4}
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
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 600 }}>Gambar Hewan</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setGambar(e.target.files[0])}
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
            style={{
              background: "#33693C",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              fontWeight: 600,
              fontSize: 16,
              width: "100%",
              cursor: "pointer"
            }}
          >
            Tambah Hewan
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