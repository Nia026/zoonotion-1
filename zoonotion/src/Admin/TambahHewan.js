import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Form } from "react-bootstrap";

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
    <div className="bg-white min-vh-100 py-5">
      <Container style={{ maxWidth: "900px" }}>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h2 className="text-success fw-bold">Tambah Hewan</h2>
          <Button variant="outline-success" onClick={() => navigate("/admin/kelola-hewan")}>
            ← Kembali
          </Button>
        </div>

        <Form onSubmit={handleSubmit} encType="multipart/form-data">
        
          <Form.Group className="mb-3">
            <Form.Label className="text-success fw-semibold">Nama Hewan</Form.Label>
            <Form.Control
              type="text"
              value={nama}
              onChange={e => setNama(e.target.value)}
              required
              placeholder="Masukkan nama hewan" 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-success fw-semibold">Kategori Hewan</Form.Label>
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
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-success fw-semibold">Deskripsi Hewan</Form.Label>
            <Form.Control
              type="text"
              as={"textarea"}
              value={deskripsi}
              onChange={e => setDeskripsi(e.target.value)}
              required
              rows={4}
              placeholder= "Deskripsikan hewan ini"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-success fw-semibold">Gambar Hewan</Form.Label>
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
          </Form.Group>
          
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
        </Form>
      </Container>
    </div>
  );
}