import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
      <Container className="py-5">
        <h1 className="text-center mb-5 zoo-main-title">
            Halaman Artikel 
        </h1>
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
              <Col md={4} className="mb-4" key={article.id}>
                <Card className="custom-article-card h-100 shadow border-0">
                  <Card.Img
                    variant="top"
                    src={article.imageUrl}
                    alt={article.title}
                    className="article-thumbnail"
                  />
                  <Card.Body className="bg-dark-green text-white d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title className="fw-semibold">{article.title}</Card.Title>
                      <Card.Text className="mb-3">
                        {article.description.substring(0, 70)}...
                      </Card.Text>
                    </div>
                    <Button
                      variant="light"
                      as={Link}
                      to={`/detail-artikel/${article.id}`}
                      className="fw-semibold"
                    >
                      Detail Artikel
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
