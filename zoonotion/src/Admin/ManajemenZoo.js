import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ManajemenZoo() {
  // State untuk data form
  const [namaKebunBinatang, setNamaKebunBinatang] = useState("");
  const [deskripsiKebunBinatang, setDeskripsiKebunBinatang] = useState("");
  const [linkWebResmi, setLinkWebResmi] = useState("");
  const [linkTiket, setLinkTiket] = useState("");
  const [gambarZoo, setGambarZoo] = useState(null);
  const [gambarZooPreview, setGambarZooPreview] = useState(null); // Untuk preview gambar

  // State untuk notifikasi dan loading
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  // Handle perubahan file gambar
  const handleGambarZooChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambarZoo(file);
      setGambarZooPreview(URL.createObjectURL(file)); // Buat URL untuk preview
    } else {
      setGambarZoo(null);
      setGambarZooPreview(null);
    }
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("nama_kebun_binatang", namaKebunBinatang);
    formData.append("deskripsi_kebun_binatang", deskripsiKebunBinatang);
    formData.append("link_web_resmi", linkWebResmi);
    formData.append("link_tiket", linkTiket);
    if (gambarZoo) {
      formData.append("gambar_zoo", gambarZoo); // Nama field harus 'gambar_zoo' sesuai konfigurasi Multer di backend
    }

    try {
      const response = await axios.post("http://localhost:5000/api/zoos", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Penting untuk FormData
        },
      });
      setSuccessMessage(response.data.message); 

      setNamaKebunBinatang("");
      setDeskripsiKebunBinatang("");
      setLinkWebResmi("");
      setLinkTiket("");
      setGambarZoo(null);
      setGambarZooPreview(null);

      navigate("/admin/kelolaZoo");
    } catch (error) {
      console.error("Error adding zoo:", error.response ? error.response.data : error.message);
      setErrorMessage(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Gagal menambah kebun binatang. Terjadi kesalahan jaringan atau server."
      );
    } finally {
      setLoading(false);
      // Hilangkan notifikasi setelah beberapa detik
      setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="bg-white min-vh-100 py-5">
      <Container style={{ maxWidth: "900px" }}>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h2 className="text-success fw-bold">Tambah Kebun Binatang</h2>
          <Button variant="outline-success" onClick={() => navigate("/admin/kelolaZoo")}>
            ← Kembali
          </Button>
        </div>

        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-success fw-semibold">Nama Kebun Binatang</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukkan nama kebun binatang"
              value={namaKebunBinatang}
              onChange={(e) => setNamaKebunBinatang(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-success fw-semibold">Deskripsi Kebun Binatang</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Deskripsikan kebun binatang ini"
              value={deskripsiKebunBinatang}
              onChange={(e) => setDeskripsiKebunBinatang(e.target.value)}
              rows={4}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-success fw-semibold">Link Web Resmi</Form.Label>
            <Form.Control
              type="url" // Ganti ke "url" untuk validasi browser
              placeholder="https://www.kebunbinatang.com"
              value={linkWebResmi}
              onChange={(e) => setLinkWebResmi(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-success fw-semibold">Link Pembelian Tiket</Form.Label>
            <Form.Control
              type="url" // Ganti ke "url"
              placeholder="https://tiket.kebunbinatang.com"
              value={linkTiket}
              onChange={(e) => setLinkTiket(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-success fw-semibold">Gambar Kebun Binatang</Form.Label>
            <Form.Control
              type="file"
              accept="image/*" // Hanya izinkan file gambar
              onChange={handleGambarZooChange}
            />
            {gambarZooPreview && (
              <div className="mt-3 text-center">
                <img
                  src={gambarZooPreview}
                  alt="Preview Gambar Kebun Binatang"
                  className="img-thumbnail"
                  style={{ maxWidth: '250px', maxHeight: '150px', objectFit: 'cover' }}
                />
              </div>
              )}
          </Form.Group>

          <Button
            variant="success" // Tombol hijau
            type="submit"
            className="w-100 py-2 fw-semibold"
            disabled={loading} // Nonaktifkan tombol saat loading
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Memproses...
               </>
            ) : (
              "Simpan Kebun Binatang"
            )}
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default ManajemenZoo;