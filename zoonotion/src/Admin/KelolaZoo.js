import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import Sidebar from "./Sidebar"; // Sesuaikan path jika Anda menggunakan Sidebar

const API_BASE_URL = "http://localhost:5000"; // Pastikan ini sesuai dengan URL backend Anda

function KelolaZoo() {
  const [zoos, setZoos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchZoos();
  }, []);

  const fetchZoos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/zoos`);
      setZoos(response.data);
    } catch (err) {
      console.error("Error fetching zoos:", err);
      setError("Gagal memuat data kebun binatang. Pastikan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZoo = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kebun binatang ini?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/zoos/${id}`);
        alert("Kebun binatang berhasil dihapus!");
        fetchZoos(); // Refresh daftar setelah penghapusan
      } catch (err) {
        console.error("Error deleting zoo:", err);
        alert("Gagal menghapus kebun binatang: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div style={{minHeight: "100vh", padding: "40px 5vw" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 className="mb-5 zoo-main-title">
          Kelola Kebun Binatang 
        </h1> 
        <button
          onClick={() => navigate("/admin/manajemen-zoo")}
          style={{
            background: "#33693C",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 28px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(51,105,60,0.1)"
          }}
        >
          + Tambah Kebun Binatang
        </button>
      </div>
  
      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Spinner animation="border" role="status" variant="success">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="ms-2 text-success">Memuat data kebun binatang...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : zoos.length === 0 ? (
        <div className="alert alert-info text-center">Belum ada data kebun binatang.</div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {zoos.map((zoo) => (
            <div
              key={zoo.id}
              className="d-flex gap-3 p-3 bg-white rounded shadow-sm border"
              style={{ alignItems: "start" }}
            >
              {zoo.gambar_zoo && (
                <img
                  src={`${API_BASE_URL}${zoo.gambar_zoo}`}
                  alt={zoo.nama_kebun_binatang}
                  style={{
                    width: 150,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8
                  }}
                />
              )}
              <div className="flex-grow-1">
                <h5 className="mb-1 fw-bold text-success">{zoo.nama_kebun_binatang}</h5>
                <p className="mb-1 text-muted" style={{ fontSize: 14 }}>
                  {zoo.deskripsi_kebun_binatang
                    ? zoo.deskripsi_kebun_binatang.substring(0, 150) + "..."
                    : "Tidak ada deskripsi."}
                </p>
  
                {zoo.link_web_resmi && (
                  <p className="mb-1 small">
                    <a href={zoo.link_web_resmi} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-info">
                      <i className="bi bi-globe me-1"></i>Web Resmi
                    </a>
                  </p>
                )}
                {zoo.link_tiket && (
                  <p className="mb-2 small">
                    <a href={zoo.link_tiket} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-info">
                      <i className="bi bi-ticket-perforated me-1"></i>Beli Tiket
                    </a>
                  </p>
                )}
  
                <div className="d-flex gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/edit-zoo/${zoo.id}`)}
                    className="btn btn-success btn-sm px-3"
                  >
                    Kelola
                  </button>
                  <button
                    onClick={() => handleDeleteZoo(zoo.id)}
                    className="btn btn-danger btn-sm px-3"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );  
}

export default KelolaZoo;