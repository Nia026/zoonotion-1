import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Impor file CSS
import './Tiket.css';

// Base URL untuk API dan gambar
const API_BASE_URL = "http://localhost:5000";

function Zoo() {
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
      setLoading(false);
    } catch (err) {
      console.error("Error fetching zoos:", err);
      setError("Gagal memuat data kebun binatang. Pastikan server backend berjalan.");
      setLoading(false);
    }
  };

  return (
    <div className="zoo-page-background">
      <Container className="py-5">
        <h1 className="text-center mb-5 zoo-main-title">
          Informasi Kebun Binatang
        </h1>

        {loading ? (
          <div className="text-center text-success py-5">Loading informasi kebun binatang...</div>
        ) : error ? (
          <div className="text-center text-danger py-5">{error}</div>
        ) : zoos.length === 0 ? (
          <div className="text-center text-muted py-5">Belum ada informasi kebun binatang yang tersedia.</div>
        ) : (
          <div className="zoo-grid-container">
            {zoos.map((zoo) => (
              <Card key={zoo.id} className="zoo-card">
                {/* Mengubah struktur di dalam Card sesuai desain */}
                <div className="zoo-card-img-wrapper"> {/* Wrapper baru untuk gambar dan overlay */}
                  {zoo.gambar_zoo && (
                    <Card.Img
                      src={`${API_BASE_URL}${zoo.gambar_zoo}`}
                      alt={zoo.nama_kebun_binatang}
                      className="zoo-card-img"
                    />
                  )}
                </div>

                <Card.Body className="zoo-card-body"> {/* Menggunakan Card.Body bawaan Bootstrap */}
                  <Card.Title className="zoo-card-title">{zoo.nama_kebun_binatang}</Card.Title>
                  <Card.Text className="zoo-card-description">
                    {zoo.deskripsi_kebun_binatang ? zoo.deskripsi_kebun_binatang.substring(0, 150) + '...' : '-'} {/* Batasi deskripsi */}
                  </Card.Text>
                  <div className="zoo-card-buttons">
                    <Button
                      as="a"
                      href={zoo.link_web_resmi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-zoo-action btn-green"
                    >
                      Website Resmi
                    </Button>
                    {zoo.link_tiket && ( // Hanya tampilkan tombol tiket jika linknya ada
                      <Button
                        as="a"
                        href={zoo.link_tiket}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-zoo-action btn-orange"
                      >
                        Pembelian Tiket
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default Zoo;