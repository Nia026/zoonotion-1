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
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F8" }}>
      {/* <Sidebar />  Uncomment if you are using a sidebar component */}
      <main style={{ flex: 1, padding: "40px 5vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>Manajemen Event</h1>
          <button
            onClick={() => navigate("/tambah-event")} // Adjusted path for clarity
            style={{
              background: "#33693C",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 28px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(51,105,60,0.08)"
            }}
          >
            + Tambah Event
          </button>
        </div>

        {error && <Alert variant="danger" className="mb-4">{error}</Alert>} {/* Display error */}

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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
            {events.map((event) => (
              <div
                key={event.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  width: 340,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  border: "1px solid #e5e7eb"
                }}
              >
                <img
                  src={event.banner_komunitas ? (event.banner_komunitas.startsWith("http") ? event.banner_komunitas : `${API_BASE_URL}${event.banner_komunitas}`) : "/images/default-event.jpg"}
                  alt={event.nama_komunitas}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />
                <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{event.nama_komunitas}</h3>
                  <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>
                    Penyelenggara: {event.nama_penyelenggara || "-"}
                  </div>
                  <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>
                    Tahun: {event.tahun_penyelenggara || "-"}
                  </div>
                  <p style={{ fontSize: 14, color: "#444", marginBottom: 16, flex: 1 }}>
                    {event.deskripsi_komunitas ? event.deskripsi_komunitas.substring(0, 100) + "..." : "-"}
                  </p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}> {/* Use flexbox for buttons */}
                    <button
                      onClick={() => navigate(`/edit-event/${event.id}`)} // Navigate to edit page
                      style={{
                        background: "#007bff", // Blue color for kelola
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 0",
                        fontWeight: 500,
                        fontSize: 15,
                        cursor: "pointer",
                        flex: 1 // Make buttons take equal width
                      }}
                    >
                      Kelola
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      style={{
                        background: "#dc3545", // Red color for delete
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 0",
                        fontWeight: 500,
                        fontSize: 15,
                        cursor: "pointer",
                        flex: 1 // Make buttons take equal width
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}