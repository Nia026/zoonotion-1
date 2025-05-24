import React, {useState, useEffect} from "react"; 
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './Tiket.css';
import { FiArrowRight } from 'react-icons/fi';

function Tiket(){
  const [zooList, setZooList] = useState([]);

  useEffect(() => {
    const defaultZooList = [
      // {
      //   id: 1,
      //   name: 'Kebun Binatang Surabaya',
      //   description: 'Kebun Binatang Surabaya (KBS) atau Surabaya Zoo adalah salah satu kebun binatang yang populer di Indonesia...',
      //   websiteUrl: 'https://www.surabayazoo.web.id/',
      //   ticketUrl: 'https://tiket.surabayazoo.web.id/',
      // },
      // {
      //   id: 2,
      //   name: 'Taman Safari Indonesia',
      //   description: 'Taman Safari Indonesia adalah taman hiburan satwa yang terletak di Cisarua, Prigen, dan Bali...',
      //   websiteUrl: 'https://tamansafari.com/',
      //   ticketUrl: 'https://tamansafari.com/tiket/',
      // },
      // {
      //   id: 3,
      //   name: 'Bandung Zoo',
      //   description: 'Kebun Binatang Bandung merupakan salah satu objek wisata alam flora dan fauna di Kota Bandung...',
      //   websiteUrl: 'https://bandungzoo.id/',
      //   ticketUrl: 'https://bandungzoo.id/beli-tiket/',
      // },
      // {
      //   id: 4,
      //   name: 'Gembira Loka Zoo',
      //   description: 'Kebun Raya dan Kebun Binatang Gembira Loka (Gembira Loka Zoo) adalah kebun binatang yang berada di Kota Yogyakarta...',
      //   websiteUrl: 'https://gembiralokazoo.com/',
      //   ticketUrl: 'https://gembiralokazoo.com/tiket/',
      // },
      // {
      //   id: 5,
      //   name: 'Batu Secret Zoo',
      //   description: 'Batu Secret Zoo merupakan tempat wisata dan kebun binatang modern yang terletak di Kota Batu, Jawa Timur...',
      //   websiteUrl: 'https://jatimpark.com/batu-secret-zoo/',
      //   ticketUrl: 'https://jatimpark.com/batu-secret-zoo/#tiket',
      // },
      // {
      //   id: 6,
      //   name: 'Ragunan Zoo',
      //   description: 'Taman Margasatwa Ragunan atau juga disebut Kebun Binatang Ragunan adalah sebuah kebun binatang yang terletak di daerah Ragunan, Pasar Minggu, Jakarta Selatan...',
      //   websiteUrl: 'https://ragunanzoo.jakarta.go.id/',
      //   ticketUrl: 'https://ragunanzoo.jakarta.go.id/informasi-tiket/',
      // },
    ];
    setZooList(defaultZooList);
  }, []);

  return (
    <div className="ticket-page">
      <div className="ticket-banner-container">
        <img src="/assets/bannerKupu.png"alt="Halaman Tiket" className="ticket-banner-image" />
        <h2 className="ticket-banner-text">Halaman Tiket</h2>
      </div>

      <Container className="py-5">
        <h2 className="text-center mb-4 section-title">Informasi Kebun Binatang</h2>
        <Row className="justify-content-center">
          {zooList.length > 0 ? (
            zooList.map((zoo) => (
              <Col md={6} lg={4} className="mb-4" key={zoo.id}>
                <Card className="zoo-card bg-green-dark text-white shadow">
                  <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Title className="text-center mb-3">{zoo.name}</Card.Title> {/* Tampilkan nama */}
                    <Card.Text className="text-center mb-3">{zoo.description}</Card.Text> {/* Tampilkan deskripsi */}
                    <div className="d-grid gap-2">
                      <Button
                        variant="outline-light"
                        size="sm"
                        as="a"
                        href={zoo.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="custom-button website-button"
                      >
                        Website Resmi <FiArrowRight className="arrow-icon" /> 
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        as="a"
                        href={zoo.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="custom-button ticket-button"
                      >
                        Beli Tiket <FiArrowRight className="arrow-icon" /> 
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col md={12}>
              <p className="text-center">Kebun binatang belum tersedia.</p>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default Tiket 