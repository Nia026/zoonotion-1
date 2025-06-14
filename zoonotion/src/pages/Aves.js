import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa'; // Untuk ikon panah
import './EducationAves.css'; 

const API_BASE_URL = "http://localhost:5000";

// --- DATA PENJELASAN AVES UMUM (HARDCODED) ---
const AVES_GENERAL_EXPLANATION_DATA = {
  id: 'aves-general-static', // ID unik untuk identifikasi
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
// --- AKHIR DATA PENJELASAN AVES UMUM ---

function Aves() { // Nama komponen diubah dari Aves menjadi EducationAves untuk konsistensi
  const [educations, setEducations] = useState([]); // Hanya akan menyimpan data hewan Aves spesifik dari API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAvesModal, setShowAvesModal] = useState(false);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  // currentAvesExplanation sekarang tidak digunakan lagi karena data hardcoded
  const [currentAnimalDetail, setCurrentAnimalDetail] = useState(null);

  useEffect(() => {
    fetchAvesAnimals(); // Hanya ambil data hewan Aves spesifik
  }, []);

  const fetchAvesAnimals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/educations`);
      // Filter hanya untuk kategori Aves DAN BUKAN entri penjelasan umum (jika ada di API)
      const avesAnimalsData = response.data.filter(item =>
        item.kategori_hewan === 'Aves' &&
        !(item.nama_hewan && item.nama_hewan.toLowerCase().includes('aves (burung)')) // Filter keluar jika ada di backend
      );
      setEducations(avesAnimalsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching educations:", err);
      setError("Gagal memuat data hewan Aves. Silakan coba lagi.");
      setLoading(false);
    }
  };

  // handleShowAvesModal sekarang akan langsung menggunakan data hardcoded
  const handleShowAvesModal = () => {
    setShowAvesModal(true);
  };

  const handleCloseAvesModal = () => {
    setShowAvesModal(false);
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
    <div className="education-aves-page education-category-page"> {/* Tambah class umum untuk kategori */}
      <div className="header-aves-bg category-header-bg"> {/* Tambah class umum */}
        <div className="overlay"></div>
        <Container className="py-5 text-white position-relative header-content">
          <Row className="justify-content-center align-items-center">
            <Col md={8} lg={7} className="text-center text-md-start">
              <h1 className="display-4 fw-bold category-title">AVES</h1>
            </Col>
            <Col md={4} lg={5} className="mt-4 mt-md-0 d-flex justify-content-center justify-content-md-end">
              {/* Card untuk penjelasan umum Aves - menggunakan data hardcoded */}
              <Card className="category-explanation-card" onClick={handleShowAvesModal}>
                <Card.Body className="d-flex flex-column align-items-center text-center">
                  <img
                    src={AVES_GENERAL_EXPLANATION_DATA.gambar_hewan}
                    alt="Aves (Burung)"
                    className="category-general-img mb-3"
                  />
                  <Card.Text className="text-dark fw-semibold category-name">
                    {AVES_GENERAL_EXPLANATION_DATA.nama_hewan}
                  </Card.Text>
                  <div className="mt-auto">
                    <Button variant="link" className="text-decoration-none fw-bold learn-more-btn">
                      Penjelasan Aves <FaArrowRight className="ms-2" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="animal-grid-section py-5">
        <Row className="g-4"> {/* Tambah g-4 untuk gap antar kolom */}
          {educations.length > 0 ? (
            educations.map(animal => (
              <Col key={animal.id} xs={12} sm={6} md={4} lg={3}> {/* Hapus mb-4 karena ada g-4 */}
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
              <p className="no-data-message">Belum ada data hewan Aves yang tersedia.</p>
            </Col>
          )}
        </Row>
      </Container>

      {/* Modal untuk Penjelasan Umum Aves - Menggunakan data hardcoded */}
      <Modal show={showAvesModal} onHide={handleCloseAvesModal} centered size="lg">
        <Modal.Header closeButton className="category-modal-header aves-modal-header"> {/* Tambah class umum */}
          <Modal.Title className="w-100 text-center modal-title-custom">Dunia Binatang</Modal.Title>
        </Modal.Header>
        <Modal.Body className="category-modal-body aves-modal-body"> {/* Tambah class umum */}
          <div className="text-center mb-4">
            <img
              src={AVES_GENERAL_EXPLANATION_DATA.gambar_hewan}
              alt="Aves (Burung)"
              className="img-fluid category-modal-img"
            />
            <h4 className="mt-3 modal-animal-name">{AVES_GENERAL_EXPLANATION_DATA.nama_hewan}</h4>
          </div>
          <p className="category-explanation-text">{AVES_GENERAL_EXPLANATION_DATA.penjelasan_umum}</p>
          {AVES_GENERAL_EXPLANATION_DATA.ciri_ciri && AVES_GENERAL_EXPLANATION_DATA.ciri_ciri.length > 0 && (
            <>
              <h5 className="mt-4 modal-subtitle">Ciri-ciri utama kelas Aves:</h5>
              <ul className="modal-feature-list">
                {AVES_GENERAL_EXPLANATION_DATA.ciri_ciri.map((ciri, index) => (
                  <li key={index}>{ciri}</li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="secondary" onClick={handleCloseAvesModal} className="btn-close-modal">
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal untuk Detail Hewan (TETAP DARI API) */}
      <Modal show={showAnimalModal} onHide={handleCloseAnimalModal} centered size="lg">
        <Modal.Header closeButton className="animal-modal-header modal-header-custom"> {/* Tambah class umum */}
          <Modal.Title className="w-100 text-center modal-title-custom">{currentAnimalDetail?.nama_hewan}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="animal-modal-body modal-body-custom"> {/* Tambah class umum */}
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

export default Aves;