import React, {useState, useEffect} from "react"; 
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from "react-router-dom"; 
import './Community.css'; 

function Community(){
  const [communityEvents, setCommunityEvents] = useState([]);
  const [userGalleries, setUserGalleries] = useState([]);

  useEffect(() => {
   
  }, []);

  return (
    <div className="community-page">
      <div className="community-banner-container">
        <img src="/assets/bannerKupu.png" alt="Halaman Komunitas" className="community-banner-image" />
        <h2 className="community-banner-text">Halaman Komunitas</h2>
      </div>

      <Container className="py-5">
        <Row>
          <Col md={6} className="mb-4">
            <div className="community-section event-section bg-brown rounded p-4 shadow">
              <div className="section-title-container bottom-curve">
                <h3 className="text-white text-center mb-0 section-title">Event Komunitas</h3>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Link to="/tambah-event" className="btn btn-light btn-sm add-button">+ Tambah Event</Link>
              </div>
              {communityEvents.length > 0 ? (
                communityEvents.map((event) => (
                  <Card key={event.id} className="bg-green-dark text-white shadow">
                    <Card.Body className="p-3">
                      <Card.Title className="text-center mb-2">{event.name}</Card.Title>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="text-white text-center mt-3">Event belum tersedia.</p>
              )}
            </div>
          </Col>
          <Col md={6} className="mb-4">
            <div className="community-section gallery-section bg-brown rounded p-4 shadow">
              <div className="section-title-container bottom-curve">
                <h3 className="text-white text-center mb-0 section-title">Galeri Pengguna</h3>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Link to="/tambah-galleri" className="btn btn-light btn-sm add-button">+ Tambah Galeri</Link>
              </div>
              {userGalleries.length > 0 ? (
                userGalleries.map((gallery) => (
                  <Card key={gallery.id} className="bg-green-dark text-white shadow">
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Card.Title>{gallery.name}</Card.Title>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="text-white text-center mt-3">Galeri belum tersedia.</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Community 