import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import Sidebar from "./Sidebar"; 

const API_BASE_URL = "http://localhost:5000"; // Pastikan ini sesuai dengan URL backend Anda

export default function EditZoo() {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();

  // State untuk data form
  const [nama_kebun_binatang, setNamaKebunBinatang] = useState("");
  const [deskripsi_kebun_binatang, setDeskripsiKebunBinatang] = useState("");
  const [link_web_resmi, setLinkWebResmi] = useState("");
  const [link_tiket, setLinkTiket] = useState("");
  const [gambar_zoo, setGambarZoo] = useState(null); // Untuk file gambar baru
  const [preview_gambar, setPreviewGambar] = useState(null); // Untuk menampilkan preview gambar

  // State untuk notifikasi dan loading
  const [loading, setLoading] = useState(true); // Mulai dengan loading true karena akan fetch data
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false); // State untuk status submit

  useEffect(() => {
    const fetchZooById = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/zoos/${id}`);
        const data = res.data;
        setNamaKebunBinatang(data.nama_kebun_binatang);
        setDeskripsiKebunBinatang(data.deskripsi_kebun_binatang);
        setLinkWebResmi(data.link_web_resmi);
        setLinkTiket(data.link_tiket);
        // Jika ada gambar zoo yang sudah ada, tampilkan sebagai preview
        if (data.gambar_zoo) {
          setPreviewGambar(`${API_BASE_URL}${data.gambar_zoo}`);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching zoo:", err);
        setError("Gagal memuat data kebun binatang. Pastikan ID benar dan server berjalan.");
        setLoading(false);
      }
    };

    fetchZooById();
  }, [id]); // id sebagai dependency agar useEffect dijalankan ulang jika ID berubah

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]; // Menggunakan optional chaining untuk keamanan
    setGambarZoo(file);
    if (file) {
      setPreviewGambar(URL.createObjectURL(file)); // Membuat URL preview dari file
    } else {
      // Jika tidak ada file baru dipilih, tidak perlu mengubah preview
      // Preview akan tetap menampilkan gambar lama jika sebelumnya sudah ada.
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("nama_kebun_binatang", nama_kebun_binatang);
    formData.append("deskripsi_kebun_binatang", deskripsi_kebun_binatang);
    formData.append("link_web_resmi", link_web_resmi);
    formData.append("link_tiket", link_tiket);
    if (gambar_zoo) {
      formData.append("gambar_zoo", gambar_zoo); // Hanya tambahkan jika ada file baru
    }

    try {
      const res = await axios.put(`${API_BASE_URL}/api/zoos/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Penting untuk mengirim file
        },
      });
      alert("Data kebun binatang berhasil diperbarui!");
      navigate("/admin/kelolaZoo"); // Kembali ke halaman kelola kebun binatang
    } catch (err) {
      console.error("Error updating zoo:", err);
      setError("Gagal memperbarui data kebun binatang: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" role="status" variant="success">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="ms-2 text-success">Memuat data kebun binatang...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div className="bg-white min-vh-100 py-5">
      <Container style={{ maxWidth: "900px" }}>
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h2 className="text-success fw-bold">Edit Kebun Binatang</h2>
            <Button variant="outline-success" onClick={() => navigate("/admin/kelolaZoo")}>
              ← Kembali
            </Button>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-success fw-semibold">Nama Kebun Binatang</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama kebun binatang"
                value={nama_kebun_binatang}
                onChange={(e) => setNamaKebunBinatang(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-success fw-semibold">Deskripsi Kebun Binatang</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Deskripsikan kebun binatang ini"
                value={deskripsi_kebun_binatang}
                onChange={(e) => setDeskripsiKebunBinatang(e.target.value)}
                rows={4}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-success fw-semibold">Link Web Resmi</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://www.kebunbinatang.com"
                value={link_web_resmi}
                onChange={(e) => setLinkWebResmi(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-success fw-semibold">Link Pembelian Tiket</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://tiket.kebunbinatang.com"
                value={link_tiket}
                onChange={(e) => setLinkTiket(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-success fw-semibold">Gambar Kebun Binatang (Opsional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {preview_gambar && (
                <div className="mt-3 text-center">
                  <p className="text-muted small mb-2">Preview Gambar:</p>
                  <img
                    src={preview_gambar}
                    alt="Preview Gambar Kebun Binatang"
                    className="img-thumbnail"
                    style={{ maxWidth: '250px', maxHeight: '150px', objectFit: 'cover' }}
                  />
                </div>
              )}
              {!preview_gambar && !gambar_zoo && (
                 <p className="text-muted small mt-2">Tidak ada gambar dipilih. Gambar lama akan dipertahankan jika tidak ada gambar baru diunggah.</p>
              )}
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="w-100 py-2 fw-semibold"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Memperbarui...
                </>
              ) : (
                "Perbarui Data Kebun Binatang"
              )}
            </Button>
            {error && <Alert variant="danger" className="mt-3 text-center">{error}</Alert>}
          </Form>
      </Container>
    </div>
  );
}