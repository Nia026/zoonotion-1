import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa';
import './EducationAves.css'; // Tetap gunakan CSS yang sama

const API_BASE_URL = "http://localhost:5000";

// --- DATA PENJELASAN PISCES UMUM (HARDCODED) ---
const AVES_GENERAL_EXPLANATION_DATA = {
  id: 'pisces-general-static',
  nama_hewan: "Pisces (Ikan)",
  gambar_hewan: "/assets/gambarPisces.jpg", // Pastikan gambar ini ada di public/assets/
  penjelasan_umum: `Pisces adalah kelompok hewan vertebrata akuatik yang bernapas menggunakan insang dan umumnya berenang menggunakan sirip. Mereka adalah kelompok yang sangat beragam, mencakup berbagai bentuk dan ukuran, dari ikan air tawar hingga ikan air laut dalam. Ikan memiliki garis lateral yang sensitif terhadap getaran air, membantu mereka mendeteksi mangsa dan predator. Sebagian besar ikan berdarah dingin dan bereproduksi dengan bertelur.`,
  ciri_ciri: [
    "Hidup sepenuhnya di air.",
    "Bernapas dengan insang.",
    "Berdarah dingin (ektotermik).",
    "Bergerak menggunakan sirip.",
    "Tubuh umumnya ditutupi sisik, beberapa tidak.",
    "Memiliki gurat sisi (linea lateralis) untuk merasakan getaran.",
    "Umumnya bereproduksi dengan bertelur (ovipar)."
  ]
};
// --- AKHIR DATA PENJELASAN PISCES UMUM ---

function Pisces() {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAvesModal, setShowAvesModal] = useState(false);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [currentAnimalDetail, setCurrentAnimalDetail] = useState(null);

  useEffect(() => {
    fetchAvesData();
  }, []);

  const fetchAvesData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/educations`);
      const filteredData = response.data.filter(item =>
        item.kategori_hewan === 'Pisces' &&
        !(item.nama_hewan && item.nama_hewan.toLowerCase().includes('Pisces'))
      );
      setEducations(filteredData);
    } catch (err) {
      setError("Gagal memuat data hewan Pisces. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowAvesModal = () => setShowAvesModal(true);
  const handleCloseAvesModal = () => setShowAvesModal(false);
  const handleShowAnimalModal = (animal) => {
    setCurrentAnimalDetail(animal);
    setShowAnimalModal(true);
  };
  const handleCloseAnimalModal = () => {
    setShowAnimalModal(false);
    setCurrentAnimalDetail(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="education-category-page">
      <div className="main-header">
        <div
          className="category-header-bg"
          style={{ backgroundImage: `url(${AVES_GENERAL_EXPLANATION_DATA.gambar_hewan})` }}
          onClick={handleShowAvesModal}
        >
          <h1 className="text-center mb-5 zoo-main-title text-white">PISCES</h1>
        </div>
      </div>
  
      <Container className="py-4">
        <Row className="g-3">
          {educations.length > 0 ? (
            educations.map(animal => (
              <Col key={animal.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="animal-card-simple" onClick={() => handleShowAnimalModal(animal)}>
                  <Card.Img
                    variant="top"
                    src={
                      animal.gambar_hewan
                        ? `${API_BASE_URL}${animal.gambar_hewan}`
                        : `${process.env.PUBLIC_URL}/placeholder-animal.png`
                    }
                    alt={animal.nama_hewan}
                  />
                  <Card.Body className="text-center">
                    <Card.Title>{animal.nama_hewan}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <p>Belum ada data hewan Pisces yang tersedia.</p>
            </Col>
          )}
        </Row>
      </Container>
  
      {/* Modal Umum Aves */}
      <Modal show={showAvesModal} onHide={handleCloseAvesModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{AVES_GENERAL_EXPLANATION_DATA.nama_hewan}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{AVES_GENERAL_EXPLANATION_DATA.penjelasan_umum}</p>
          <ul>
            {AVES_GENERAL_EXPLANATION_DATA.ciri_ciri.map((ciri, index) => (
              <li key={index}>{ciri}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAvesModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
  
      {/* Modal Detail Hewan */}
      <Modal show={showAnimalModal} onHide={handleCloseAnimalModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentAnimalDetail?.nama_hewan}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentAnimalDetail && (
            <img
              src={
                currentAnimalDetail.gambar_hewan
                  ? `${API_BASE_URL}${currentAnimalDetail.gambar_hewan}`
                  : `${process.env.PUBLIC_URL}/placeholder-animal.png`
              }
              alt={currentAnimalDetail.nama_hewan}
              className="img-fluid mb-3"
            />
          )}
          <p>{currentAnimalDetail?.deskripsi_hewan}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAnimalModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
  
}

export default Pisces;