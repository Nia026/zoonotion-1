import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import Sidebar from "./Sidebar"; // Sesuaikan path jika Anda menggunakan Sidebar

const API_BASE_URL = "http://localhost:5000"; // Pastikan ini sesuai dengan URL backend Anda

function KelolaZoo() {
  const [zoos, setZoos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchZoos();
  }, []);

  const fetchZoos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/zoos`);
      setZoos(response.data);
    } catch (err) {
      console.error("Error fetching zoos:", err);
      setError("Gagal memuat data kebun binatang. Pastikan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZoo = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kebun binatang ini?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/zoos/${id}`);
        alert("Kebun binatang berhasil dihapus!");
        fetchZoos(); // Refresh daftar setelah penghapusan
      } catch (err) {
        console.error("Error deleting zoo:", err);
        alert("Gagal menghapus kebun binatang: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#F4F6F8" }}>

      <Container fluid className="py-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
          <h1 className="h3 fw-bold text-dark">Kelola Kebun Binatang</h1>
          <Button variant="success" onClick={() => navigate("/admin/manajemen-zoo")}>
            + Tambah Kebun Binatang
          </Button>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
            <Spinner animation="border" role="status" variant="success">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="ms-2 text-success">Memuat data kebun binatang...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="mx-3">{error}</Alert>
        ) : zoos.length === 0 ? (
          <Alert variant="info" className="text-center mx-3">Belum ada data kebun binatang.</Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4 px-3">
            {zoos.map((zoo) => (
              <Col key={zoo.id}>
                <Card className="h-100 shadow-sm border-0 rounded-3">
                  {zoo.gambar_zoo && (
                    <Card.Img
                      variant="top"
                      src={`${API_BASE_URL}${zoo.gambar_zoo}`}
                      alt={zoo.nama_kebun_binatang}
                      style={{ height: "200px", objectFit: "cover", borderTopLeftRadius: "0.75rem", borderTopRightRadius: "0.75rem" }}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold text-success">{zoo.nama_kebun_binatang}</Card.Title>
                    <Card.Text className="text-muted small mb-2">
                      {zoo.deskripsi_kebun_binatang ? zoo.deskripsi_kebun_binatang.substring(0, 150) + "..." : "Tidak ada deskripsi."}
                    </Card.Text>
                    {zoo.link_web_resmi && (
                        <Card.Text className="small mb-1">
                            <a href={zoo.link_web_resmi} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-info">
                                <i className="bi bi-globe me-1"></i>Web Resmi
                            </a>
                        </Card.Text>
                    )}
                     {zoo.link_tiket && (
                        <Card.Text className="small mb-3">
                            <a href={zoo.link_tiket} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-info">
                                <i className="bi bi-ticket-perforated me-1"></i>Beli Tiket
                            </a>
                        </Card.Text>
                    )}
                    <div className="mt-auto d-flex gap-2">
                      <Button
                        variant="primary" // Warna biru untuk edit
                        className="flex-grow-1"
                        onClick={() => navigate(`/edit-zoo/${zoo.id}`)}
                      >
                        Kelola
                      </Button>
                      <Button
                        variant="danger" // Warna merah untuk delete
                        className="flex-grow-1"
                        onClick={() => handleDeleteZoo(zoo.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default KelolaZoo;