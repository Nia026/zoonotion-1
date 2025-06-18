import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Form, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export default function TambahEvent() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [namaKomunitas, setNamaKomunitas] = useState("");
  const [penyelenggara, setPenyelenggara] = useState("");
  const [tahun, setTahun] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [selectedCommunityId, setSelectedCommunityId] = useState("");
  const [namaGaleri, setNamaGaleri] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:5000/api/communities")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Gagal memuat daftar event. Pastikan server backend berjalan.");
        setLoading(false);
      });
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setBanner(null);
      setBannerPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(false);

    const formData = new FormData();
    formData.append("nama_komunitas", namaKomunitas);
    formData.append("nama_penyelenggara", penyelenggara);
    formData.append("tahun_penyelenggara", tahun);
    formData.append("deskripsi_komunitas", deskripsi);
    if (banner) formData.append("banner_komunitas", banner);

    try {
      await axios.post("http://localhost:5000/api/communities", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNamaKomunitas("");
      setPenyelenggara("");
      setTahun("");
      setDeskripsi("");
      setBanner(null);
      setBannerPreview(null);
      fetchEvents();
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Error submitting event:", err);
      setSubmitError(true);
      setTimeout(() => setSubmitError(false), 3000);
    }
  };

  const handleGalleryFilesChange = (e) => {
    setGalleryFiles(Array.from(e.target.files));
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!selectedCommunityId || galleryFiles.length === 0) {
      alert("Pastikan memilih event dan upload gambar galeri.");
      return;
    }

    const formData = new FormData();
    formData.append("nama_galeri", namaGaleri);
    galleryFiles.forEach((file) => {
      formData.append("gambar_galeri", file);
    });

    try {
      await axios.post(
        `http://localhost:5000/api/communities/${selectedCommunityId}/galleries`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setNamaGaleri("");
      setGalleryFiles([]);
      setSelectedCommunityId("");

      alert("Galeri berhasil ditambahkan!");
      fetchEvents();
    } catch (err) {
      console.error("Error submitting gallery:", err);
      alert("Gagal menambahkan galeri.");
    }
  };

  return (
    <div className="bg-white min-vh-100 py-5">
      <Container style={{ maxWidth: "900px" }}>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h2 className="text-success fw-bold">Tambah Event Baru</h2>
          <Button variant="outline-success" onClick={() => navigate("/admin/manajemen-event")}>
            ← Kembali
          </Button>
        </div>

        {submitSuccess && <Alert variant="success">Event berhasil ditambahkan!</Alert>}
        {submitError && <Alert variant="danger">Gagal menambah event.</Alert>}

        <Form onSubmit={handleSubmit} className="mb-5">
          <Form.Group className="mb-3">
            <Form.Label>Nama Event</Form.Label>
            <Form.Control 
              type="text" 
              value={namaKomunitas} 
              onChange={(e) => setNamaKomunitas(e.target.value)} required
              placeholder="Masukkan nama event" 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nama Penyelenggara</Form.Label>
            <Form.Control 
              type="text" 
              value={penyelenggara} 
              onChange={(e) => setPenyelenggara(e.target.value)}
              placeholder="Masukkan nama penyelenggara"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tahun Penyelenggara</Form.Label>
            <Form.Control type="number" value={tahun} onChange={(e) => setTahun(e.target.value)} min="1900" max="2100" placeholder="Masukkan tahun penyelenggara"/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Deskripsi Event</Form.Label>
            <Form.Control as="textarea" rows={4} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required placeholder="Deskripsikan event ini"/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Banner Event</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleBannerChange} />
            {bannerPreview && (
              <div className="mt-3 text-center">
                <img
                  src={bannerPreview}
                  alt="Banner Preview"
                  className="img-thumbnail"
                  style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'cover' }}
                />
              </div>
            )}
          </Form.Group>
          <Button type="submit" variant="success" className="w-100 fw-semibold">
            Simpan Event
          </Button>
        </Form>

        <Form onSubmit={handleGallerySubmit} className="mb-5">
          <h4 className="text-success fw-bold mb-3">Tambah Galeri ke Event</h4>
          <Form.Group className="mb-3">
            <Form.Label>Pilih Event</Form.Label>
            <Form.Select value={selectedCommunityId} onChange={(e) => setSelectedCommunityId(e.target.value)} required>
              <option value="">-- Pilih Event --</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.nama_komunitas}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nama Galeri</Form.Label>
            <Form.Control type="text" value={namaGaleri} onChange={(e) => setNamaGaleri(e.target.value)} required placeholder="Masukkan nama geleri"/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Upload Gambar Galeri</Form.Label>
            <Form.Control type="file" multiple accept="image/*" onChange={handleGalleryFilesChange} required />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100 fw-semibold">
            Simpan Galeri
          </Button>
        </Form>

        <div className="mt-5">
          <h4 className="text-success fw-bold mb-3">Daftar Event</h4>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="success" />
              <p>Memuat daftar event...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : events.length === 0 ? (
            <div className="text-center text-muted">Belum ada event.</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr className="bg-light text-center">
                  <th>ID</th>
                  <th>Nama Event</th>
                  <th>Penyelenggara</th>
                  <th>Tahun</th>
                  <th>Deskripsi</th>
                  <th>Banner</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.id}</td>
                    <td>{ev.nama_komunitas}</td>
                    <td>{ev.nama_penyelenggara || "-"}</td>
                    <td>{ev.tahun_penyelenggara || "-"}</td>
                    <td>{ev.deskripsi_komunitas || "-"}</td>
                    <td>
                      {ev.banner_komunitas ? (
                        <img
                          src={
                            ev.banner_komunitas.startsWith("http")
                              ? ev.banner_komunitas
                              : `http://localhost:5000${ev.banner_komunitas}`
                          }
                          alt="banner"
                          className="img-thumbnail"
                          style={{ width: 80, height: 40, objectFit: "cover", borderRadius: 6 }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Container>
    </div>
  );
}
