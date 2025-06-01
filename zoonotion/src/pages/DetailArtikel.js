import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios'; // Import axios

import './Artikel.css'; // Mempertahankan styling yang sudah ada

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
    <div className="bg-brown-light py-5">
      <Container className="py-5 mt-5"> {/* Menambahkan mt-5 untuk space dari navbar */}
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="bg-green-dark text-white rounded p-4 shadow">
              <h1 className="text-center mb-3 fw-bold" style={{ fontSize: '32px' }}>{article.title}</h1>
              <p className="text-center text-secondary mb-3" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7) !important' }}>
                Ditulis oleh: {article.author} | Dirilis tahun: {article.publishDate}
              </p>
              <hr className="my-4 border-light" />
              <div className="text-center mb-4">
                <img src={article.imageUrl} alt={article.title} className="img-fluid rounded" style={{ maxWidth: '600px', height: 'auto' }} />
              </div>
              <div className="text-justify" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                {/* Mengganti split('\n') dengan innerHTML jika deskripsi berisi HTML */}
                {/* Jika isi_artikel API berupa plain text dan mengandung '\n' untuk paragraf: */}
                {article.fullDescription.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                ))}
                {/* Jika isi_artikel API bisa berisi HTML (misal dari rich text editor), gunakan dangerouslySetInnerHTML: */}
                {/* <div dangerouslySetInnerHTML={{ __html: article.fullDescription }}></div> */}
              </div>

              <Button
                variant="outline-light"
                size="sm"
                as={Link}
                to={`/article`}
                className="custom-button read-more-button mt-4" // Tambah margin top
              >
                <FiArrowLeft className="arrow-icon" /> Kembali
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DetailArtikel;