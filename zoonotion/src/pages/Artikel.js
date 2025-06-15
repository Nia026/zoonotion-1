import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi'; 
import axios from 'axios'; 

import './Artikel.css';

const API_BASE_URL = "http://localhost:5000";

function Artikel() {
  const [articleList, setArticleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/articles`);
      const formattedArticles = response.data.map(article => ({
        id: article.id,
        title: article.judul_artikel,
        imageUrl: `${API_BASE_URL}${article.gambar_artikel}`, 
        description: article.isi_artikel,
      }));
      setArticleList(formattedArticles);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Gagal memuat artikel. Pastikan server backend berjalan.");
      setLoading(false);
    }
  };

  return (
    <div className="article-page">
      <div className="article-banner-container">
        <img src={`${process.env.PUBLIC_URL}/assets/bannerKupu.png`} alt="Halaman Artikel" className="article-banner-image" />
        <h2 className="article-banner-text">Halaman Artikel</h2>
      </div>

      <Container className="py-5">
        <h2 className="text-center mb-4 section-title">Daftar Artikel</h2>
        <Row className="justify-content-center">
          {loading ? (
            <Col md={12} className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-success mt-2">Memuat artikel...</p>
            </Col>
          ) : error ? (
            <Col md={12} className="text-center py-5">
              <p className="text-danger">{error}</p>
            </Col>
          ) : articleList.length > 0 ? (
            articleList.map((article) => (
              <Col md={6} className="mb-4" key={article.id}>
                <Card className="article-card bg-green-dark text-white shadow">
                  <Card.Img variant="top" src={article.imageUrl} alt={article.title} className="article-image" />
                  <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Title className="text-center mb-3">{article.title}</Card.Title>
                    <Card.Text className="text-center mb-3">{article.description.substring(0, 150)}...</Card.Text>
                    <Button
                      variant="outline-light"
                      size="sm"
                      as={Link}
                      to={`/detail-artikel/${article.id}`}
                      className="custom-button read-more-button"
                    >
                      Lihat Selengkapnya <FiArrowRight className="arrow-icon" />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col md={12}>
              <p className="text-center text-muted py-5">Belum ada artikel yang tersedia.</p>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default Artikel;