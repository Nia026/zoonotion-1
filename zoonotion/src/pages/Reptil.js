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
    <div className="education-reptil-page education-category-page">
      <div className="main-header">
        <div className="category-header-bg" style={{ backgroundImage: `url(${REPTIL_GENERAL_EXPLANATION_DATA.gambar_hewan})` }} onClick={handleShowReptilModal}>
          <h1 className="fw-bold">REPTIL</h1>
        </div>
      </div>

      <Container className="py-4">
        <Row className="g-3">
          {educations.length > 0 ? (
            educations.map(animal => (
              <Col key={animal.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="animal-card-simple" onClick={() => handleShowAnimalModal(animal)}>
                  <Card.Img variant="top" src={animal.gambar_hewan ? `${API_BASE_URL}${animal.gambar_hewan}` : `${process.env.PUBLIC_URL}/placeholder-animal.png`} alt={animal.nama_hewan} className="animal-img" />
                  <Card.Body className="text-center">
                    <Card.Title className="animal-name">{animal.nama_hewan}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <p>Belum ada data hewan Reptil yang tersedia.</p>
            </Col>
          )}
        </Row>
      </Container>

      {/* Modal Reptil (penjelasan umum) */}
      <Modal show={showReptilModal} onHide={handleCloseReptilModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{REPTIL_GENERAL_EXPLANATION_DATA.nama_hewan}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{REPTIL_GENERAL_EXPLANATION_DATA.penjelasan_umum}</p>
          <ul className="modal-feature-list">
            {REPTIL_GENERAL_EXPLANATION_DATA.ciri_ciri.map((ciri, index) => (
              <li key={index}>{ciri}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReptilModal}>Tutup</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal detail hewan */}
      <Modal show={showAnimalModal} onHide={handleCloseAnimalModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentAnimalDetail?.nama_hewan}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentAnimalDetail && (
            <img src={currentAnimalDetail.gambar_hewan ? `${API_BASE_URL}${currentAnimalDetail.gambar_hewan}` : `${process.env.PUBLIC_URL}/placeholder-animal.png`} alt={currentAnimalDetail.nama_hewan} className="img-fluid modal-animal-img mb-3" />
          )}
          <p>{currentAnimalDetail?.deskripsi_hewan}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAnimalModal}>Tutup</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Reptil;