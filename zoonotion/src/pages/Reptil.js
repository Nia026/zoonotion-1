// src/pages/EducationReptil.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa'; // Untuk ikon panah
import './EducationAves.css'; 

const API_BASE_URL = "http://localhost:5000";

// --- DATA PENJELASAN REPTIL UMUM (HARDCODED) ---
const REPTIL_GENERAL_EXPLANATION_DATA = {
  id: 'reptil-general-static', // ID unik
  nama_hewan: "Reptil",
  gambar_hewan: "/assets/gambarReptil.jpg",
  penjelasan_umum: `Reptil adalah kelompok hewan vertebrata yang berdarah dingin (ektotermik) dan memiliki kulit bersisik kering. Mereka bernapas menggunakan paru-paru dan umumnya bereproduksi dengan bertelur. Reptil mencakup berbagai hewan seperti ular, kadal, buaya, dan kura-kura. Mereka ditemukan di berbagai habitat di seluruh dunia, kecuali di daerah kutub yang sangat dingin. Adaptasi mereka terhadap kehidupan di darat sangat baik, termasuk kemampuan untuk mengatur suhu tubuh mereka melalui perilaku (berjemur di bawah sinar matahari atau mencari tempat teduh).`,
  ciri_ciri: [
    "Bersisik dan kulit kering.",
    "Berdarah dingin (ektotermik), suhu tubuh tergantung lingkungan.",
    "Bernapas dengan paru-paru.",
    "Umumnya bereproduksi dengan bertelur (ovipar), beberapa vivipar/ovovivipar.",
    "Berkembang biak di darat.",
    "Sebagian besar memiliki empat kaki, kecuali ular yang tidak berkaki.",
    "Memiliki cakar pada jari-jari (bagi yang berkaki)."
  ]
};
// --- AKHIR DATA PENJELASAN REPTIL UMUM ---

function Reptil() {
  const [educations, setEducations] = useState([]); // Hanya akan menyimpan data hewan Reptil spesifik dari API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showReptilModal, setShowReptilModal] = useState(false); // Untuk modal penjelasan umum Reptil
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [currentAnimalDetail, setCurrentAnimalDetail] = useState(null);

  useEffect(() => {
    fetchReptilAnimals(); // Hanya ambil data hewan Reptil spesifik
  }, []);

  const fetchReptilAnimals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/educations`);
      // Filter hanya untuk kategori Reptil DAN BUKAN entri penjelasan umum (jika ada di API)
      const reptilAnimalsData = response.data.filter(item =>
        item.kategori_hewan === 'Reptil' &&
        !(item.nama_hewan && item.nama_hewan.toLowerCase().includes('reptil')) // Filter keluar jika ada di backend
      );
      setEducations(reptilAnimalsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching educations:", err);
      setError("Gagal memuat data hewan Reptil. Silakan coba lagi.");
      setLoading(false);
    }
  };

  // handleShowReptilModal sekarang akan langsung menggunakan data hardcoded
  const handleShowReptilModal = () => {
    setShowReptilModal(true);
  };

  const handleCloseReptilModal = () => {
    setShowReptilModal(false);
  };

  const handleShowAnimalModal = (animalData) => {
    setCurrentAnimalDetail(animalData);
    setShowAnimalModal(true);
  };

  const handleCloseAnimalModal = () => {
    setShowAnimalModal(false);
    setCurrentAnimalDetail(null);
  };

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
    <div className="education-reptil-page education-category-page"> {/* Menggunakan class yang sama */}
      <div className="header-reptil-bg category-header-bg"> {/* Class baru untuk background khusus Reptil */}
        <div className="overlay"></div>
        <Container className="py-5 text-white position-relative header-content">
          <Row className="justify-content-center align-items-center">
            <Col md={8} lg={7} className="text-center text-md-start">
              <h1 className="display-4 fw-bold category-title">REPTIL</h1>
            </Col>
            <Col md={4} lg={5} className="mt-4 mt-md-0 d-flex justify-content-center justify-content-md-end">
              {/* Card untuk penjelasan umum Reptil - menggunakan data hardcoded */}
              <Card className="category-explanation-card" onClick={handleShowReptilModal}>
                <Card.Body className="d-flex flex-column align-items-center text-center">
                  <img
                    src={REPTIL_GENERAL_EXPLANATION_DATA.gambar_hewan}
                    alt="Reptil"
                    className="category-general-img mb-3"
                  />
                  <Card.Text className="text-dark fw-semibold category-name">
                    {REPTIL_GENERAL_EXPLANATION_DATA.nama_hewan}
                  </Card.Text>
                  <div className="mt-auto">
                    <Button variant="link" className="text-decoration-none fw-bold learn-more-btn">
                      Penjelasan Reptil <FaArrowRight className="ms-2" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="animal-grid-section py-5">
        <Row className="g-4">
          {educations.length > 0 ? (
            educations.map(animal => (
              <Col key={animal.id} xs={12} sm={6} md={4} lg={3}>
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
              <p className="no-data-message">Belum ada data hewan Reptil yang tersedia.</p>
            </Col>
          )}
        </Row>
      </Container>

      {/* Modal untuk Penjelasan Umum Reptil - Menggunakan data hardcoded */}
      <Modal show={showReptilModal} onHide={handleCloseReptilModal} centered size="lg">
        <Modal.Header closeButton className="category-modal-header reptil-modal-header"> {/* Class baru untuk background khusus Reptil */}
          <Modal.Title className="w-100 text-center modal-title-custom">Dunia Binatang</Modal.Title>
        </Modal.Header>
        <Modal.Body className="category-modal-body reptil-modal-body"> {/* Class baru untuk background khusus Reptil */}
          <div className="text-center mb-4">
            <img
              src={REPTIL_GENERAL_EXPLANATION_DATA.gambar_hewan}
              alt="Reptil"
              className="img-fluid category-modal-img"
            />
            <h4 className="mt-3 modal-animal-name">{REPTIL_GENERAL_EXPLANATION_DATA.nama_hewan}</h4>
          </div>
          <p className="category-explanation-text">{REPTIL_GENERAL_EXPLANATION_DATA.penjelasan_umum}</p>
          {REPTIL_GENERAL_EXPLANATION_DATA.ciri_ciri && REPTIL_GENERAL_EXPLANATION_DATA.ciri_ciri.length > 0 && (
            <>
              <h5 className="mt-4 modal-subtitle">Ciri-ciri utama kelas Reptil:</h5>
              <ul className="modal-feature-list">
                {REPTIL_GENERAL_EXPLANATION_DATA.ciri_ciri.map((ciri, index) => (
                  <li key={index}>{ciri}</li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="secondary" onClick={handleCloseReptilModal} className="btn-close-modal">
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal untuk Detail Hewan (TETAP DARI API) */}
      <Modal show={showAnimalModal} onHide={handleCloseAnimalModal} centered size="lg">
        <Modal.Header closeButton className="animal-modal-header modal-header-custom">
          <Modal.Title className="w-100 text-center modal-title-custom">{currentAnimalDetail?.nama_hewan}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="animal-modal-body modal-body-custom">
          {currentAnimalDetail && (
            <div className="text-center mb-4">
              <img src={currentAnimalDetail.gambar_hewan ? `${API_BASE_URL}${currentAnimalDetail.gambar_hewan}` : `${process.env.PUBLIC_URL}/placeholder-animal.png`} alt={currentAnimalDetail.nama_hewan} className="img-fluid animal-modal-img" />
            </div>
          )}
          <p className="animal-description-text">{currentAnimalDetail?.deskripsi_hewan}</p>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="secondary" onClick={handleCloseAnimalModal} className="btn-close-modal">
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Reptil;