import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa';
import './EducationAves.css'; // Tetap gunakan CSS yang sama

const API_BASE_URL = "http://localhost:5000";

// --- DATA PENJELASAN MAMALIA UMUM (HARDCODED) ---
const MAMALIA_GENERAL_EXPLANATION_DATA = {
  id: 'mamalia-general-static',
  nama_hewan: "Mamalia",
  gambar_hewan: "/assets/gambarMamalia.jpg", // Pastikan gambar ini ada di public/assets/
  penjelasan_umum: `Mamalia adalah kelompok hewan vertebrata berdarah panas yang dicirikan oleh adanya kelenjar susu pada betina untuk menyusui anaknya, rambut atau bulu di tubuh, dan sistem pernapasan menggunakan paru-paru. Mereka ditemukan di berbagai habitat, dari darat hingga air, dan menunjukkan tingkat kecerdasan yang tinggi. Mamalia berkembang biak secara vivipar (melahirkan), kecuali monotremata.`,
  ciri_ciri: [
    "Berdarah panas (endotermik).",
    "Memiliki kelenjar susu (menyusui anaknya).",
    "Tubuh ditutupi rambut atau bulu.",
    "Bernapas dengan paru-paru.",
    "Umumnya melahirkan (vivipar), kecuali monotremata.",
    "Memiliki diafragma untuk membantu pernapasan.",
    "Gigi bervariasi sesuai jenis makanan."
  ]
};
// --- AKHIR DATA PENJELASAN MAMALIA UMUM ---

function Mamalia() {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showMamaliaModal, setShowMamaliaModal] = useState(false); // Untuk modal penjelasan umum Mamalia
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [currentAnimalDetail, setCurrentAnimalDetail] = useState(null);

  useEffect(() => {
    fetchMamaliaAnimals();
  }, []);

  const fetchMamaliaAnimals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/educations`);
      const mamaliaAnimalsData = response.data.filter(item =>
        item.kategori_hewan === 'Mamalia' &&
        !(item.nama_hewan && item.nama_hewan.toLowerCase().includes('mamalia'))
      );
      setEducations(mamaliaAnimalsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching educations:", err);
      setError("Gagal memuat data hewan Mamalia. Silakan coba lagi.");
      setLoading(false);
    }
  };

  const handleShowMamaliaModal = () => {
    setShowMamaliaModal(true);
  };

  const handleCloseMamaliaModal = () => {
    setShowMamaliaModal(false);
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
    <div className="education-mamalia-page education-category-page">
      <div className="header-mamalia-bg category-header-bg">
        <div className="overlay"></div>
        <Container className="py-5 text-white position-relative header-content">
          <Row className="justify-content-center align-items-center">
            <Col md={8} lg={7} className="text-center text-md-start">
              <h1 className="display-4 fw-bold category-title">MAMALIA</h1>
            </Col>
            <Col md={4} lg={5} className="mt-4 mt-md-0 d-flex justify-content-center justify-content-md-end">
              <Card className="category-explanation-card" onClick={handleShowMamaliaModal}>
                <Card.Body className="d-flex flex-column align-items-center text-center">
                  <img
                    src={MAMALIA_GENERAL_EXPLANATION_DATA.gambar_hewan}
                    alt="Mamalia"
                    className="category-general-img mb-3"
                  />
                  <Card.Text className="text-dark fw-semibold category-name">
                    {MAMALIA_GENERAL_EXPLANATION_DATA.nama_hewan}
                  </Card.Text>
                  <div className="mt-auto">
                    <Button variant="link" className="text-decoration-none fw-bold learn-more-btn">
                      Penjelasan Mamalia <FaArrowRight className="ms-2" />
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
              <p className="no-data-message">Belum ada data hewan Mamalia yang tersedia.</p>
            </Col>
          )}
        </Row>
      </Container>

      {/* Modal untuk Penjelasan Umum Mamalia */}
      <Modal show={showMamaliaModal} onHide={handleCloseMamaliaModal} centered size="lg">
        <Modal.Header closeButton className="category-modal-header mamalia-modal-header">
          <Modal.Title className="w-100 text-center modal-title-custom">Dunia Binatang</Modal.Title>
        </Modal.Header>
        <Modal.Body className="category-modal-body mamalia-modal-body">
          <div className="text-center mb-4">
            <img
              src={MAMALIA_GENERAL_EXPLANATION_DATA.gambar_hewan}
              alt="Mamalia"
              className="img-fluid category-modal-img"
            />
            <h4 className="mt-3 modal-animal-name">{MAMALIA_GENERAL_EXPLANATION_DATA.nama_hewan}</h4>
          </div>
          <p className="category-explanation-text">{MAMALIA_GENERAL_EXPLANATION_DATA.penjelasan_umum}</p>
          {MAMALIA_GENERAL_EXPLANATION_DATA.ciri_ciri && MAMALIA_GENERAL_EXPLANATION_DATA.ciri_ciri.length > 0 && (
            <>
              <h5 className="mt-4 modal-subtitle">Ciri-ciri utama kelas Mamalia:</h5>
              <ul className="modal-feature-list">
                {MAMALIA_GENERAL_EXPLANATION_DATA.ciri_ciri.map((ciri, index) => (
                  <li key={index}>{ciri}</li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="secondary" onClick={handleCloseMamaliaModal} className="btn-close-modal">
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

export default Mamalia;