import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa';
import './EducationAves.css';

const API_BASE_URL = "http://localhost:5000";

// Data statis penjelasan umum Aves
const AVES_GENERAL_EXPLANATION_DATA = {
  id: 'aves-general-static',
  nama_hewan: "Aves (Burung)",
  gambar_hewan: "/assets/gambarAves.webp",
  penjelasan_umum: `Aves adalah nama ilmiah (dalam taksonomi) untuk kelas burung. Dalam sistem klasifikasi makhluk hidup, Aves mencakup semua jenis burung yang memiliki ciri-ciri umum sebagai berikut: Mereka adalah vertebrata berdarah panas yang ditandai dengan bulu, paruh tanpa gigi, menetas dari telur berkulit keras, laju metabolisme yang tinggi, jantung beruang empat, dan rangka yang ringan namun kuat. Mayoritas burung memiliki sayap dan mampu terbang, meskipun ada beberapa spesies yang tidak bisa terbang. Burung tersebar di seluruh dunia, dari kutub hingga khatulistiwa, mendiami berbagai habitat dan menunjukkan keanekaragaman bentuk, ukuran, dan perilaku yang luar biasa.`,
  ciri_ciri: [
    "Memiliki bulu yang menutupi tubuh.",
    "Memiliki paruh dan tidak bergigi.",
    "Bereproduksi dengan cara bertelur (ovipar) dengan telur berkulit keras.",
    "Berada dalam kelompok hewan berdarah panas (homeotermik) atau endotermik.",
    "Sistem pernapasan efisien dengan kantung udara.",
    "Memiliki sayap, meskipun tidak semua spesies mampu terbang.",
    "Tulang-ulang berongga yang ringan untuk adaptasi terbang.",
    "Jantung beruang empat untuk efisiensi peredaran darah."
  ]
};

function Aves() {
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
        item.kategori_hewan === 'Aves' &&
        !(item.nama_hewan && item.nama_hewan.toLowerCase().includes('aves (burung)'))
      );
      setEducations(filteredData);
    } catch (err) {
      setError("Gagal memuat data hewan Aves. Silakan coba lagi.");
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
          <h1 className="fw-bold">AVES</h1>
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
              <p>Belum ada data hewan Aves yang tersedia.</p>
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

export default Aves;
