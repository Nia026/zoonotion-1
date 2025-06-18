import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, Alert } from "react-bootstrap"; // Import Bootstrap components for better loading/error states

const API_BASE_URL = "http://localhost:5000"; // Define your API base URL

export default function ManajemenEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => { // Make it async
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await axios.get(`${API_BASE_URL}/api/communities`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Gagal memuat data event. Pastikan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus event ini beserta semua galerinya?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/communities/${eventId}`);
        alert("Event dan galerinya berhasil dihapus!");
        fetchEvents(); // Refresh the list after deletion
      } catch (err) {
        console.error("Error deleting event:", err);
        setError("Gagal menghapus event: " + (err.response?.data?.message || err.message));
        setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px 5vw" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 className="mb-5 zoo-main-title">
          Manajemen Event 
        </h1>
        <button
          onClick={() => navigate("/tambah-event")}
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
          + Tambah Event
        </button>
      </div>
  
      {/* Error */}
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
  
      {/* Loading */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Spinner animation="border" role="status" variant="success">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="ms-2 text-success">Memuat data event...</p>
        </div>
      ) : events.length === 0 ? (
        <div style={{ color: "#888", fontSize: 18, textAlign: "center", marginTop: "50px" }}>Belum ada data event.</div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="d-flex gap-3 p-3 bg-white rounded shadow-sm border"
              style={{ alignItems: "start" }}
            >
              <img
                src={event.banner_komunitas ? 
                  (event.banner_komunitas.startsWith("http") ? event.banner_komunitas : `${API_BASE_URL}${event.banner_komunitas}`)
                  : "/images/default-event.jpg"}
                alt={event.nama_komunitas}
                style={{
                  width: 150,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 8
                }}
              />
              <div className="flex-grow-1">
                <h5 className="mb-1 fw-bold">{event.nama_komunitas}</h5>
                <p className="mb-1 text-muted" style={{ fontSize: 14 }}>
                  {event.deskripsi_komunitas ? event.deskripsi_komunitas.substring(0, 150) + "..." : "-"}
                </p>
                <div className="d-flex gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/edit-event/${event.id}`)}
                    className="btn btn-success btn-sm px-3"
                  >
                    Kelola
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
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