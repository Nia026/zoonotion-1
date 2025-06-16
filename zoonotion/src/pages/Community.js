import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Modal, Tabs, Tab, Image } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Impor file CSS
import './Community.css';

// Base URL untuk API dan gambar
const API_BASE_URL = "http://localhost:5000";

function Community() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [key, setKey] = useState('event'); // State untuk tab aktif di modal

  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/communities`);
      setCommunities(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching communities:", err);
      setError("Gagal memuat data komunitas. Pastikan server backend berjalan.");
      setLoading(false);
    }
  };

  const handleShowModal = (community) => {
    setSelectedCommunity(community);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCommunity(null);
    setKey('event'); // Reset tab ke 'event' saat modal ditutup
  };

  return (
    <div className="community-page-background">
      <Container className="py-5">
        {/* Safari Adventure Banner */}
        <div className="text-center mb-5">
          <img
            src="/assets/bannerKomunitas1.png"  
            alt="Safari Adventure"
            className="community-header-banner"
          />
        </div>

        <h1 className="text-center mb-5 zoo-main-title">
          Jelajahi Komunitas Kami 
        </h1>

        {loading ? (
          <div className="text-center text-success py-5">Loading komunitas...</div>
        ) : error ? (
          <div className="text-center text-danger py-5">{error}</div>
        ) : communities.length === 0 ? (
          <div className="text-center text-muted py-5">Belum ada komunitas yang tersedia.</div>
        ) : (
          <div className="community-grid-container">
            {communities.map((community) => (
              <Card key={community.id} className="community-card h-100">
                <Card.Img
                  variant="top"
                  src={`${API_BASE_URL}${community.banner_komunitas}`}
                  alt={community.nama_komunitas}
                  className="community-card-img"
                />
                <Card.Body className="community-card-body">
                  <Card.Title className="community-card-title">{community.nama_komunitas}</Card.Title>
                  <Card.Subtitle className="community-card-subtitle mb-2">
                    <div>Diselenggara oleh: <strong>{community.nama_penyelenggara}</strong></div>
                    <div>Tahun Event: <strong>{community.tahun_penyelenggara}</strong></div>
                  </Card.Subtitle>
                  <Card.Text className="community-card-description">
                    {community.deskripsi_komunitas ? community.deskripsi_komunitas.substring(0, 100) + '...' : '-'}
                  </Card.Text>
                  <Button
                    onClick={() => handleShowModal(community)}
                    className="btn-about-event mt-auto" // mt-auto untuk push ke bawah
                  >
                    About This Event
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Container>

      {/* Modal Detail Komunitas */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title className="modal-title-custom">
            {selectedCommunity?.nama_komunitas}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <h5 className="mb-3">Detail Komunitas</h5>
          <Tabs
            id="community-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3 modal-body-tabs"
            justify
          >
            <Tab eventKey="event" title="Event">
              <div className="detail-event-section">
                <p><strong>Nama Komunitas:</strong> {selectedCommunity?.nama_komunitas}</p>
                <p><strong>Penyelenggara:</strong> {selectedCommunity?.nama_penyelenggara}</p>
                <p><strong>Tahun Event:</strong> {selectedCommunity?.tahun_penyelenggara}</p>
                <p><strong>Deskripsi:</strong> {selectedCommunity?.deskripsi_komunitas}</p>
              </div>
            </Tab>
            <Tab eventKey="gallery" title="Galeri">
              {selectedCommunity?.galleries && selectedCommunity.galleries.length > 0 ? (
                <div className="gallery-grid">
                  {selectedCommunity.galleries.map((gallery) => (
                    <Image
                      key={gallery.id}
                      src={`${API_BASE_URL}${gallery.gambar_galeri}`}
                      alt={gallery.deskripsi_gambar || `Galeri ${selectedCommunity.nama_komunitas}`}
                      className="gallery-item"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted mt-3">Tidak ada gambar di galeri.</p>
              )}
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Community;