import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";


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
    <div className="bg-white min-vh-100 py-5">
      <Container style={{ maxWidth: "900px" }}>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h2 className="text-success fw-bold">Edit Artikel</h2>
          <Button variant="outline-success" onClick={() => navigate("/admin/kelola-artikel")}>
            ← Kembali
          </Button>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="judul_artikel" className="text-success fw-semibold">
              Judul Artikel:
            </Form.Label>
            <Form.Control
              type="text"
              id="judul_artikel"
              value={judul_artikel}
              onChange={(e) => setJudulArtikel(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="isi_artikel" className="text-success fw-semibold">
              Isi Artikel:
            </Form.Label>
            <Form.Control
              as="textarea"
              id="isi_artikel"
              rows={8}
              value={isi_artikel}
              onChange={(e) => setIsiArtikel(e.target.value)}
              required
              style={{ resize: "vertical" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="nama_author" className="text-success fw-semibold">
              Nama Author:
            </Form.Label>
            <Form.Control
              type="text"
              id="nama_author"
              value={nama_author}
              onChange={(e) => setNamaAuthor(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="gambar_artikel" className="text-success fw-semibold">
              Gambar Artikel (Opsional):
            </Form.Label>
            <Form.Control
              type="file"
              id="gambar_artikel"
              accept="image/*"
              onChange={handleFileChange}
              style={{ padding: "10px", border: "1px solid #ddd" }}
            />
            {preview_gambar && (
              <div className="mt-3 text-center">
                <p className="text-muted" style={{ fontSize: 14 }}>Preview Gambar:</p>
                <img
                  src={preview_gambar}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 250,
                    borderRadius: 8,
                    border: "1px solid #eee"
                  }}
                />
              </div>
            )}
            {!preview_gambar && !gambar_artikel && (
              <p style={{ fontSize: 13, color: "#888", marginTop: 5 }}>
                Tidak ada gambar yang dipilih. Gambar lama akan dipertahankan jika tidak ada gambar baru diunggah.
              </p>
            )}
          </Form.Group>

          <Button
            type="submit"
            disabled={submitting}
            variant="success"
            className="w-100 fw-semibold"
            style={{
              padding: "12px 0",
              fontSize: 16
            }}
          >
            {submitting ? "Memperbarui..." : "Perbarui Artikel"}
          </Button>

          {error && (
            <div style={{ color: "red", textAlign: "center", marginTop: 20 }}>
              {error}
            </div>
          )}
        </Form>
      </Container>
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