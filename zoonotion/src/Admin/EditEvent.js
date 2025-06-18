import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Alert, Spinner, Card, Row, Col, Container } from "react-bootstrap";

const API_BASE_URL = "http://localhost:5000";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nama_komunitas, setNamaKomunitas] = useState("");
  const [deskripsi_komunitas, setDeskripsiKomunitas] = useState("");
  const [nama_penyelenggara, setNamaPenyelenggara] = useState("");
  const [tahun_penyelenggara, setTahunPenyelenggara] = useState("");
  const [banner_komunitas, setBannerKomunitas] = useState(null);
  const [preview_banner, setPreviewBanner] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [newGalleryDescriptions, setNewGalleryDescriptions] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

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
        setGalleries(data.galleries || []);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat data event. Pastikan ID benar dan server berjalan.");
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    setBannerKomunitas(file);
    if (file) {
      setPreviewBanner(URL.createObjectURL(file));
    }
  };

  const handleNewGalleryFilesChange = (e) => {
    setNewGalleryFiles(Array.from(e.target.files));
  };

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
      await axios.put(`${API_BASE_URL}/api/communities/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Data event berhasil diperbarui!");
    } catch (err) {
      setError("Gagal memperbarui data event: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

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
    formData.append("deskripsi_gambar", newGalleryDescriptions);
    try {
      await axios.post(`${API_BASE_URL}/api/communities/${id}/galleries`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Galeri baru berhasil ditambahkan!");
      setNewGalleryFiles([]);
      setNewGalleryDescriptions("");
      document.getElementById('newGalleryFileInput').value = null;
      const updatedEvent = await axios.get(`${API_BASE_URL}/api/communities/${id}`);
      setGalleries(updatedEvent.data.galleries || []);
    } catch (err) {
      setError("Gagal menambahkan galeri: " + (err.response?.data?.message || err.message));
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGalleryItem = async (galleryId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus gambar galeri ini?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/galleries/${galleryId}`);
        alert("Gambar galeri berhasil dihapus!");
        setGalleries(galleries.filter((item) => item.id !== galleryId));
      } catch (err) {
        setError("Gagal menghapus gambar galeri: " + (err.response?.data?.message || err.message));
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger" className="m-4">{error}</Alert>;
  }

  return (
    <div className="bg-white min-vh-100 py-5">
      <Container style={{maxWidth: "900px"}}> 
        <div className="mb-4 d-flex justify-content-between align-items-center">
            <h2 className="text-success fw-bold">Edit Event</h2>
            <Button variant="outline-success" onClick={() => navigate("/admin/manajemen-event")}>
              ← Kembali
            </Button>
          </div>

        <Form onSubmit={handleSubmitEvent} className="bg-light p-4 rounded border mb-5">
          <h4 className="text-success fw-bold mb-4">Edit Komunitas</h4>
          <Form.Group className="mb-3">
            <Form.Label>Nama Komunitas</Form.Label>
            <Form.Control type="text" value={nama_komunitas} onChange={(e) => setNamaKomunitas(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Deskripsi Komunitas</Form.Label>
            <Form.Control as="textarea" rows={3} value={deskripsi_komunitas} onChange={(e) => setDeskripsiKomunitas(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nama Penyelenggara</Form.Label>
            <Form.Control type="text" value={nama_penyelenggara} onChange={(e) => setNamaPenyelenggara(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tahun Penyelenggara</Form.Label>
            <Form.Control type="number" value={tahun_penyelenggara} onChange={(e) => setTahunPenyelenggara(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Banner Komunitas</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleBannerChange} />
            {preview_banner && <img src={preview_banner} alt="preview" className="img-fluid mt-2" style={{ maxHeight: "200px" }} />}
          </Form.Group>
          <Button type="submit" variant="success" className="w-100">{submitting ? 'Memperbarui...' : 'Perbarui Event'}</Button>
        </Form>

        <Form onSubmit={handleAddGallery} className="bg-light p-4 rounded border mb-4">
          <h4 className="text-success fw-bold mb-4">Edit Galleri</h4>
          <Form.Group className="mb-3">
            <Form.Label>Gambar Galeri Baru</Form.Label>
            <Form.Control id="newGalleryFileInput" type="file" multiple accept="image/*" onChange={handleNewGalleryFilesChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Deskripsi Galeri</Form.Label>
            <Form.Control type="text" value={newGalleryDescriptions} onChange={(e) => setNewGalleryDescriptions(e.target.value)} />
          </Form.Group>
          <Button type="submit" variant="primary" disabled={uploadingGallery} className="w-100">{uploadingGallery ? 'Mengunggah...' : 'Tambah Galeri'}</Button>
        </Form>

        <Row xs={1} md={2} lg={3} className="g-4">
          {galleries.map((gallery) => (
            <Col key={gallery.id}>
              <Card className="h-100">
                <Card.Img variant="top" src={`${API_BASE_URL}${gallery.gambar_galeri}`} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Text>{gallery.deskripsi_gambar || 'Tidak ada deskripsi'}</Card.Text>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteGalleryItem(gallery.id)}>Hapus</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
