import React from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Homepage.css';
import { Link } from "react-router-dom"; 

function Homepage() {
  return (
    <div className="home-page">
      <div className="banner-wrapper">
        <img src="/assets/bannerPuffins.png" alt="Let's learn about puffins" className="banner-image" />
      </div>

      <Container className="text-center mt-5">
        <h1 className="text-center mb-5 zoo-main-title">
          Zoonotion
        </h1>
        <p className="lead w-75 mx-auto">
          Zoonotion adalah platform edukasi hewan yang menyajikan metode pembelajaran hewan yang menarik. Ayooo teman teman mari kita bersama-sama mengenal berbagai macam satwa yang ada di alam yang luas ini 🙌
        </p>
        <hr className="my-4 w-50 mx-auto" />
      </Container>

      <Container className="py-4">
        <Row className="text-center justify-content-center g-4">
          {[
            { to: '/education', img: 'gambarEdukasi.png', label: 'Education' },
            { to: '#', img: 'gambarQuizz.png', label: 'Quizz' },
            { to: '/community', img: 'gambarKomunitas.png', label: 'Komunitas' },
            { to: '/article', img: 'gambarArtikel.png', label: 'Artikel' },
          ].map((item, index) => (
            <Col xs={6} md={3} key={index}>
              <Link to={item.to} className="text-decoration-none text-dark">
                <img
                  src={`/assets/${item.img}`}
                  alt={item.label}
                  className="mb-2 rounded"
                  style={{ width: '170px', height: '170px', objectFit: 'contain' }}
                />
                <p className="fw-semibold">{item.label}</p>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>

      <Container className="my-5">
        <Row className="gy-4 justify-content-center">
          <Col md={5}> 
            <Card className="vision-card text-white shadow-sm mb-2"> 
              <Card.Body>
                <h3>Visi Kami</h3>
                <p>Meningkatkan kesadaran dan kepedulian masyarakat terhadap kehidupan dan kesejahteraan hewan melalui pendidikan yang informatif, menyenangkan, dan bermakna.</p>
              </Card.Body>
            </Card>

            <Card className="contact-card text-white shadow-sm">
              <Card.Body>
                <h3>Kontak Kami</h3>
                <p><i className="bi bi-envelope me-2"></i> zoonotion@gmail.com</p>
                <p><i className="bi bi-telephone-fill me-2"></i> +62 08****</p>
                <p><i className="bi bi-instagram me-2"></i> @zoonotion</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5}>
            <Card className="mission-card text-white shadow-sm">
              <Card.Body>
                <h3>Misi Kami</h3>
                <ol>
                  <li>Menyediakan materi edukatif tentang keanekaragaman, habitat, dan peran penting hewan dalam ekosistem.</li>
                  <li>Mendorong sikap cinta, empati, dan tanggung jawab terhadap hewan sejak usia dini.</li>
                  <li>Menyelenggarakan program edukatif interaktif seperti kunjungan ke tempat penangkaran, kebun binatang, atau pusat konservasi.</li>
                  <li>Meningkatkan pemahaman masyarakat terhadap isu-isu satwa liar, konservasi, dan kesejahteraan hewan.</li>
                  <li>Berkolaborasi dengan sekolah, komunitas, dan lembaga dalam kampanye edukasi hewan berkelanjutan.</li>
                </ol>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Homepage;
