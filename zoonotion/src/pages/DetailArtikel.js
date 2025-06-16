import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios'; // Import axios

import './Artikel.css'; 

// Base URL untuk API dan gambar
const API_BASE_URL = "http://localhost:5000";

function DetailArtikel() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticleDetail();
  }, [id]); // Dependensi `id` agar data diperbarui jika ID di URL berubah

  const fetchArticleDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/articles/${id}`);
      const apiArticle = response.data;

      // Format tanggal dari ISO string ke tahun
      const publishYear = apiArticle.publish_date ? new Date(apiArticle.publish_date).getFullYear() : 'Tidak Diketahui';

      const formattedArticle = {
        id: apiArticle.id,
        title: apiArticle.judul_artikel,
        imageUrl: `${API_BASE_URL}${apiArticle.gambar_artikel}`,
        fullDescription: apiArticle.isi_artikel,
        author: apiArticle.nama_author || 'Anonim', // Asumsi ada properti author di API, jika tidak ada default ke 'Anonim'
        publishDate: publishYear // Menggunakan tahun dari publish_date
      };
      setArticle(formattedArticle);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching article detail:", err);
      setError("Artikel tidak ditemukan atau terjadi kesalahan saat memuat.");
      setLoading(false);
    }
  };

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="bg-brown-light py-5 text-center text-white min-vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-success mt-2">Memuat artikel...</p>
        </Container>
      </div>
    );
  }

  // Tampilkan error state
  if (error) {
    return (
      <div className="bg-brown-light py-5 text-center text-white min-vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <h2 className="text-danger">{error}</h2>
          <Button as={Link} to="/article" variant="outline-light" className="mt-3">
            <FiArrowLeft className="arrow-icon" /> Kembali ke Daftar Artikel
          </Button>
        </Container>
      </div>
    );
  }

  // Jika artikel tidak ditemukan setelah loading (misal API mengembalikan 404 atau null)
  if (!article) {
    return (
      <div className="bg-brown-light py-5 text-center text-white min-vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <h2>Artikel tidak ditemukan.</h2>
          <Button as={Link} to="/article" variant="outline-light" className="mt-3">
            <FiArrowLeft className="arrow-icon" /> Kembali ke Daftar Artikel
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="article-detail-wrapper py-5">
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col  style={{ maxWidth: '90%' }}>
            <div className="bg-white p-4 p-md-5 rounded shadow article-card-custom">
              <div className="text-center mb-4">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="img-fluid rounded" 
                  style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }} 
                />
              </div>
              <h2 className="text-center fw-bold mb-3" style={{ fontSize: '28px' }}>
                {article.title}
              </h2>
              <p className="text-center text-muted mb-4">
                Ditulis oleh: {article.author} | Dirilis tahun: {article.publishDate}
              </p>

              <div className="article-body" style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                {article.fullDescription.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                ))}
              </div>

              <div className="text-center mt-4">
                <Button
                  as={Link}
                  to="/article"
                  variant="outline-success"
                  className="px-4"
                >
                  <FiArrowLeft className="me-2" />
                  Kembali ke Daftar Artikel
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DetailArtikel;