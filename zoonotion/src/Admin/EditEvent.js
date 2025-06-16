import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner, Card, Row, Col } from "react-bootstrap";
// import Sidebar from "./Sidebar"; // Uncomment if you are using a sidebar component

const API_BASE_URL = "http://localhost:5000"; // Pastikan ini sesuai dengan URL backend Anda

export default function EditEvent() {
  const { id } = useParams(); // Mengambil ID event dari URL
  const navigate = useNavigate();

  // State untuk data form event
  const [nama_komunitas, setNamaKomunitas] = useState("");
  const [deskripsi_komunitas, setDeskripsiKomunitas] = useState("");
  const [nama_penyelenggara, setNamaPenyelenggara] = useState("");
  const [tahun_penyelenggara, setTahunPenyelenggara] = useState("");
  const [banner_komunitas, setBannerKomunitas] = useState(null); 
  const [preview_banner, setPreviewBanner] = useState(null); 

  const [galleries, setGalleries] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]); 
  const [newGalleryDescriptions, setNewGalleryDescriptions] = useState(""); 

  // State untuk notifikasi dan loading
  const [loading, setLoading] = useState(true); // Mulai dengan loading true karena akan fetch data
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false); // State untuk status submit event
  const [uploadingGallery, setUploadingGallery] = useState(false); // State untuk status upload galeri

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/communities/${id}`);
        const data = res.data;
        setNamaKomunitas(data.nama_komunitas || "");
        setDeskripsiKomunitas(data.deskripsi_komunitas || "");
        setNamaPenyelenggara(data.nama_penyelenggara || "");
        setTahunPenyelenggara(data.tahun_penyelenggara || "");
        
        if (data.banner_komunitas) {
          setPreviewBanner(`${API_BASE_URL}${data.banner_komunitas}`);
        }
        setGalleries(data.galleries || []); // Set galeri yang sudah ada
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Gagal memuat data event. Pastikan ID benar dan server berjalan.");
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]); // id sebagai dependency

  // Handle perubahan file banner
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    setBannerKomunitas(file);
    if (file) {
      setPreviewBanner(URL.createObjectURL(file));
    }
  };

  // Handle perubahan file galeri baru
  const handleNewGalleryFilesChange = (e) => {
    setNewGalleryFiles(Array.from(e.target.files));
  };

  // Handle submit form event (untuk update nama, deskripsi, dll.)
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("nama_komunitas", nama_komunitas);
    formData.append("deskripsi_komunitas", deskripsi_komunitas);
    formData.append("nama_penyelenggara", nama_penyelenggara);
    formData.append("tahun_penyelenggara", tahun_penyelenggara);
    if (banner_komunitas) {
      formData.append("banner_komunitas", banner_komunitas);
    }

    try {
      const res = await axios.put(`${API_BASE_URL}/api/communities/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Data event berhasil diperbarui!");

    } catch (err) {
      console.error("Error updating event:", err);
      setError("Gagal memperbarui data event: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle submit untuk menambahkan gambar galeri baru
  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (newGalleryFiles.length === 0) {
      setError("Pilih setidaknya satu gambar untuk galeri.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setUploadingGallery(true);
    setError(null);

    const formData = new FormData();
    newGalleryFiles.forEach((file) => {
      formData.append("gambar_galeri", file);
    });
    formData.append("deskripsi_gambar", newGalleryDescriptions); // Deskripsi untuk semua gambar baru

    try {
      const res = await axios.post(`${API_BASE_URL}/api/communities/${id}/galleries`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Galeri baru berhasil ditambahkan!");
      setNewGalleryFiles([]); // Clear new files
      setNewGalleryDescriptions(""); // Clear new description
      // Clear file input visual
      document.getElementById('newGalleryFileInput').value = null;

      // Refresh galeri setelah upload
      const updatedEvent = await axios.get(`${API_BASE_URL}/api/communities/${id}`);
      setGalleries(updatedEvent.data.galleries || []);
    } catch (err) {
      console.error("Error adding gallery:", err);
      setError("Gagal menambahkan galeri: " + (err.response?.data?.message || err.message));
    } finally {
      setUploadingGallery(false);
    }
  };

  // Handle hapus gambar galeri individual
  const handleDeleteGalleryItem = async (galleryId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus gambar galeri ini?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/galleries/${galleryId}`);
        alert("Gambar galeri berhasil dihapus!");
        setGalleries(galleries.filter((item) => item.id !== galleryId)); // Hapus dari state
      } catch (err) {
        console.error("Error deleting gallery item:", err);
        setError("Gagal menghapus gambar galeri: " + (err.response?.data?.message || err.message));
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" role="status" variant="success">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="ms-2 text-success">Memuat data event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {error}
          <Button variant="link" onClick={() => navigate("/admin/manajemen-event")}>Kembali</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#F4F6F8" }}>
      {/* <Sidebar /> */}
      <Container fluid className="py-5 flex-grow-1">
        <div className="bg-white shadow p-4 p-md-5 rounded-3 border mx-auto" style={{ maxWidth: "900px" }}>
          <h1 className="text-center mb-4 text-success fw-bold">
            <span className="border-bottom border-success border-4 pb-1">
              Edit Event: {nama_komunitas}
            </span>
          </h1>
          <Button variant="secondary" onClick={() => navigate("/admin/manajemen-event")} className="mb-4">
            &larr; Kembali ke Daftar Event
          </Button>

          {/* Form Edit Detail Event */}
          <h2 className="mb-3 text-dark fs-4">Detail Event</h2>
          <Form onSubmit={handleSubmitEvent} className="mb-5 p-4 border rounded bg-light">
            <Form.Group className="mb-3">
              <Form.Label className="text-success fw-semibold">Nama Komunitas <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={nama_komunitas}
                onChange={(e) => setNamaKomunitas(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-success fw-semibold">Deskripsi Komunitas</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={deskripsi_komunitas}
                onChange={(e) => setDeskripsiKomunitas(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-success fw-semibold">Nama Penyelenggara</Form.Label>
              <Form.Control
                type="text"
                value={nama_penyelenggara}
                onChange={(e) => setNamaPenyelenggara(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-success fw-semibold">Tahun Penyelenggara</Form.Label>
              <Form.Control
                type="number" // Use type number
                value={tahun_penyelenggara}
                onChange={(e) => setTahunPenyelenggara(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-success fw-semibold">Banner Komunitas (Opsional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
              />
              {preview_banner && (
                <div className="mt-3 text-center">
                  <p className="text-muted small mb-2">Preview Banner:</p>
                  <img
                    src={preview_banner}
                    alt="Preview Banner Komunitas"
                    className="img-thumbnail"
                    style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'cover' }}
                  />
                </div>
              )}
              {!preview_banner && !banner_komunitas && (
                 <p className="text-muted small mt-2">Tidak ada banner dipilih. Banner lama akan dipertahankan jika tidak ada banner baru diunggah.</p>
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
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Memperbarui Event...
                </>
              ) : (
                "Perbarui Detail Event"
              )}
            </Button>
          </Form>

          {/* Bagian Manajemen Galeri */}
          <h2 className="mb-3 text-dark fs-4">Galeri Event</h2>

          {/* Form Tambah Galeri Baru */}
          <div className="mb-5 p-4 border rounded bg-light">
            <h3 className="fs-5 text-success mb-3">Tambah Gambar Galeri Baru</h3>
            <Form onSubmit={handleAddGallery}>
              <Form.Group controlId="newGalleryFileInput" className="mb-3">
                <Form.Label>Pilih Gambar (Maks. 10)</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewGalleryFilesChange}
                />
                {newGalleryFiles.length > 0 && (
                  <p className="text-muted small mt-2">{newGalleryFiles.length} file dipilih.</p>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Deskripsi Gambar (Opsional, untuk semua gambar baru)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Contoh: Suasana event 2023"
                  value={newGalleryDescriptions}
                  onChange={(e) => setNewGalleryDescriptions(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={newGalleryFiles.length === 0 || uploadingGallery}
                className="w-100 py-2"
              >
                {uploadingGallery ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Mengunggah Galeri...
                  </>
                ) : (
                  "Unggah Galeri Baru"
                )}
              </Button>
            </Form>
          </div>

          {/* Daftar Galeri yang Sudah Ada */}
          <h3 className="fs-5 text-dark mb-3">Galeri yang Sudah Ada</h3>
          {galleries.length === 0 ? (
            <Alert variant="info" className="text-center">Belum ada gambar di galeri ini.</Alert>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {galleries.map((gallery) => (
                <Col key={gallery.id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={`${API_BASE_URL}${gallery.gambar_galeri}`}
                      alt={gallery.deskripsi_gambar || "Galeri"}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Text className="small text-muted flex-grow-1">
                        {gallery.deskripsi_gambar || "Tidak ada deskripsi."}
                      </Card.Text>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteGalleryItem(gallery.id)}
                        className="mt-2"
                      >
                        Hapus Gambar
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
    </div>
  );
}