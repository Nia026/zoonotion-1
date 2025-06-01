// src/pages/EducationAves.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa'; // Untuk ikon panah
import './EducationAves.css'; // File CSS untuk styling kustom

const API_BASE_URL = "http://localhost:5000";

function Aves() {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAvesModal, setShowAvesModal] = useState(false);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [currentAvesExplanation, setCurrentAvesExplanation] = useState(null);
  const [currentAnimalDetail, setCurrentAnimalDetail] = useState(null);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/educations`);
      // Filter hanya untuk kategori Aves
      const avesData = response.data.filter(item => item.kategori_hewan === 'Aves');
      setEducations(avesData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching educations:", err);
      setError("Gagal memuat data edukasi. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const handleShowAvesModal = (avesData) => {
    setCurrentAvesExplanation(avesData);
    setShowAvesModal(true);
  };

  const handleCloseAvesModal = () => {
    setShowAvesModal(false);
    setCurrentAvesExplanation(null);
  };

  const handleShowAnimalModal = (animalData) => {
    setCurrentAnimalDetail(animalData);
    setShowAnimalModal(true);
  };

  const handleCloseAnimalModal = () => {
    setShowAnimalModal(false);
    setCurrentAnimalDetail(null);
  };

  // Cari objek penjelasan umum Aves
  const avesGeneralExplanation = educations.find(edu =>
    edu.nama_hewan && edu.nama_hewan.toLowerCase().includes('aves (burung)')
  );

  const avesAnimals = educations.filter(edu =>
    edu.nama_hewan && !edu.nama_hewan.toLowerCase().includes('aves (burung)')
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
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
    <div className="education-aves-page">
      <div className="header-aves-bg">
        <div className="overlay"></div>
        <Container className="py-5 text-white position-relative header-content">
          <Row className="justify-content-center align-items-center">
            <Col md={8} lg={7} className="text-center text-md-start">
              <h1 className="display-4 fw-bold">AVES</h1>
            </Col>
            <Col md={4} lg={5} className="mt-4 mt-md-0 d-flex justify-content-center justify-content-md-end">
              {avesGeneralExplanation && (
                <Card className="aves-explanation-card" onClick={() => handleShowAvesModal(avesGeneralExplanation)}>
                  <Card.Body className="d-flex flex-column align-items-center text-center">
                    <img src={avesGeneralExplanation.gambar_hewan ? `${API_BASE_URL}${avesGeneralExplanation.gambar_hewan}` : `${process.env.PUBLIC_URL}/placeholder-animal.png`} alt="Aves (Burung)" className="aves-general-img mb-3" />
                    <Card.Text className="text-dark fw-semibold">
                      {avesGeneralExplanation.nama_hewan}
                    </Card.Text>
                    <div className="mt-auto">
                      <Button variant="link" className="text-decoration-none fw-bold learn-more-btn">
                        Penjelasan Aves <FaArrowRight className="ms-2" />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="animal-grid-section py-5">
        <Row>
          {avesAnimals.length > 0 ? (
            avesAnimals.map(animal => (
              <Col key={animal.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="animal-card" onClick={() => handleShowAnimalModal(animal)}>
                  <Card.Body className="d-flex flex-column align-items-center text-center">
                    <img src={animal.gambar_hewan ? `${API_BASE_URL}${animal.gambar_hewan}` : `${process.env.PUBLIC_URL}/placeholder-animal.png`} alt={animal.nama_hewan} className="animal-img mb-3" />
                    <Card.Title className="animal-name mb-0">{animal.nama_hewan}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <p>Belum ada data hewan Aves yang tersedia selain penjelasan umum.</p>
            </Col>
          )}
        </Row>
      </Container>

      {/* Modal untuk Penjelasan Umum Aves */}
      <Modal show={showAvesModal} onHide={handleCloseAvesModal} centered size="lg">
        <Modal.Header closeButton className="aves-modal-header">
          <Modal.Title className="w-100 text-center">Dunia Binatang</Modal.Title>
        </Modal.Header>
        <Modal.Body className="aves-modal-body">
          {currentAvesExplanation && (
            <div className="text-center mb-4">
              <img src={currentAvesExplanation.gambar_hewan ? `${API_BASE_URL}${currentAvesExplanation.gambar_hewan}` : `${process.env.PUBLIC_URL}/placeholder-animal.png`} alt="Aves (Burung)" className="img-fluid aves-modal-img" />
              <h4 className="mt-3">{currentAvesExplanation.nama_hewan}</h4>
            </div>
          )}
          <p className="aves-explanation-text">{currentAvesExplanation?.penjelasan_umum}</p>
          {currentAvesExplanation?.ciri_ciri && currentAvesExplanation.ciri_ciri.length > 0 && (
            <>
              <h5 className="mt-4">Ciri-ciri utama kelas Aves:</h5>
              <ul>
                {currentAvesExplanation.ciri_ciri.map((ciri, index) => (
                  <li key={index}>{ciri}</li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAvesModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal untuk Detail Hewan */}
      <Modal show={showAnimalModal} onHide={handleCloseAnimalModal} centered size="lg">
        <Modal.Header closeButton className="animal-modal-header">
          <Modal.Title className="w-100 text-center">{currentAnimalDetail?.nama_hewan}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="animal-modal-body">
          {currentAnimalDetail && (
            <div className="text-center mb-4">
              <img src={currentAnimalDetail.gambar_hewan ? `${API_BASE_URL}${currentAnimalDetail.gambar_hewan}` : `${process.env.PUBLIC_URL}/placeholder-animal.png`} alt={currentAnimalDetail.nama_hewan} className="img-fluid animal-modal-img" />
            </div>
          )}
          <p className="animal-description-text">{currentAnimalDetail?.deskripsi_hewan}</p>
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

export default Aves;