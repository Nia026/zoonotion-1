import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";

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
    <div className="bg-white min-vh-100 py-5">
      <Container style={{ maxWidth: "900px" }}>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h2 className="text-success fw-bold">Tambah Artikel</h2>
          <Button variant="outline-success" onClick={() => navigate("/admin/kelola-artikel")}>
            ← Kembali
          </Button>
        </div>

        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label className="text-success fw-semibold">Judul Artikel</Form.Label>
            <Form.Control
              type="text"
              value={judul}
              onChange={e => setJudul(e.target.value)}
              required
              placeholder="Masukkan judul artikel"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-success fw-semibold">Isi Artikel</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={isi}
              onChange={e => setIsi(e.target.value)}
              required
              placeholder="Masukkan isi artikel"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-success fw-semibold">Nama Author</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
              placeholder="Masukkan nama author"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-success fw-semibold">Gambar Artikel</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleGambarChange}
            />
            {gambarPreview && (
              <div className="mt-3 text-center">
                <img
                  src={gambarPreview}
                  alt="Pratinjau Gambar Artikel"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '120px',
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #ddd'
                  }}
                />
              </div>
            )}
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Tambah Artikel"}
          </Button>

          {pesan && (
            <div
              style={{
                marginTop: 18,
                color: pesan.includes("berhasil") ? "#33693C" : "#c00",
                textAlign: "center"
              }}
            >
              {pesan}
            </div>
          )}
        </Form>
      </Container>
    </div>
  );
}

