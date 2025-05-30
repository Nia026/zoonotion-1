import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManajemenEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  // Ambil data dari tabel communities (karena event = communities)
  const fetchEvents = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/communities")
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F8" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "40px 5vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>Manajemen Event</h1>
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
              boxShadow: "0 2px 8px rgba(51,105,60,0.08)"
            }}
          >
            + Tambah Event
          </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : events.length === 0 ? (
          <div style={{ color: "#888", fontSize: 18 }}>Belum ada data event.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
            {events.map((event, i) => (
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
                  src={event.banner_komunitas ? (event.banner_komunitas.startsWith("http") ? event.banner_komunitas : `http://localhost:5000${event.banner_komunitas}`) : "/images/default-event.jpg"}
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
                  <button
                    style={{
                      background: "#33693C",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 0",
                      fontWeight: 500,
                      fontSize: 15,
                      cursor: "pointer",
                      width: "100%"
                    }}
                  >
                    Kelola
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
