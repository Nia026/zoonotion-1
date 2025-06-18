import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Form } from "react-bootstrap";

const API_BASE_URL = "http://localhost:5000"; // Pastikan ini sesuai dengan URL backend Anda

export default function EditHewan() {
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();

  const [nama_hewan, setNamaHewan] = useState("");
  const [kategori_hewan, setKategoriHewan] = useState("");
  const [deskripsi_hewan, setDeskripsiHewan] = useState("");
  const [gambar_hewan, setGambarHewan] = useState(null); // Untuk file gambar baru
  const [preview_gambar, setPreviewGambar] = useState(null); // Untuk menampilkan preview gambar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false); // State untuk status submit

  useEffect(() => {
    // Fungsi untuk mengambil data artikel berdasarkan ID
    const fetchHewanById = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/educations/${id}`);
        const data = res.data;
        setNamaHewan(data.nama_hewan);
        setKategoriHewan(data.kategori_hewan);
        setDeskripsiHewan(data.deskripsi_hewan);
        // Jika ada gambar hewan yang sudah ada, tampilkan sebagai preview
        if (data.gambar_hewan) {
          setPreviewGambar(`${API_BASE_URL}${data.gambar_hewan}`);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching education:", err);
        setError("Gagal memuat data hewan. Pastikan ID benar dan server berjalan.");
        setLoading(false);
      }
    };

    fetchHewanById();
  }, [id]); // id sebagai dependency agar useEffect dijalankan ulang jika ID berubah

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]; // Menggunakan optional chaining untuk keamanan
    setGambarHewan(file);
    if (file) {
      setPreviewGambar(URL.createObjectURL(file)); // Membuat URL preview dari file
    } else {
      // Jika tidak ada file baru dipilih, preview akan kembali ke gambar lama jika ada,
      // atau null jika tidak ada gambar sama sekali. URL.revokeObjectURL bisa ditambahkan
      // jika Anda ingin membersihkan URL objek lama, tapi seringkali tidak kritis.
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("nama_hewan", nama_hewan);
    formData.append("kategori_hewan", kategori_hewan);
    formData.append("deskripsi_hewan", deskripsi_hewan);
    if (gambar_hewan) {
      formData.append("gambar_hewan", gambar_hewan); // Hanya tambahkan jika ada file baru
    }

    try {
      const res = await axios.put(`${API_BASE_URL}/api/educations/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Penting untuk mengirim file
        },
      });
      alert("Data hewan berhasil diperbarui!");
      navigate("/admin/kelola-hewan"); // Kembali ke halaman kelola hewan
    } catch (err) {
      console.error("Error updating education:", err);
      setError("Gagal memperbarui data hewan: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={loadingStyle}>Memuat data hewan...</div>
    );
  }

  if (error) {
    return (
      <div style={errorStyle}>
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100 py-5">
      <Container style={{ maxWidth: "900px" }}>
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h2 className="text-success fw-bold">Edit Hewan</h2>
          <Button variant="outline-success" onClick={() => navigate("/admin/kelola-hewan")}>
            ← Kembali
          </Button>
        </div>

        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="nama_hewan" className="text-success fw-semibold">Nama Hewan:</Form.Label>
            <Form.Control
              type="text"
              id="nama_hewan"
              value={nama_hewan}
              onChange={(e) => setNamaHewan(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="kategori_hewan" className="text-success fw-semibold">Kategori Hewan:</Form.Label>
            <Form.Control
              type="text"
              id="kategori_hewan"
              value={kategori_hewan}
              onChange={(e) => setKategoriHewan(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="deskripsi_hewan" className="text-success fw-soldemib">Deskripsi Hewan:</Form.Label>
            <Form.Control
              as={"textarea"}
              type="text"
              id="deskripsi_hewan"
              value={deskripsi_hewan}
              onChange={(e) => setDeskripsiHewan(e.target.value)}
              rows="5"
              required
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="gambar_hewan" className="text-success fw-soldemib">Gambar Hewan (Opsional):</Form.Label>
            <input
              type="file"
              id="gambar_hewan"
              accept="image/*"
              onChange={handleFileChange}
              style={{ ...inputStyle, border: "1px solid #ddd", padding: "10px" }}
            />
            {preview_gambar && (
              <div style={previewContainerStyle}>
                <p style={previewTextStyle}>Preview Gambar:</p>
                <img src={preview_gambar} alt="Preview" style={previewImageStyle} />
              </div>
            )}
            {!preview_gambar && !gambar_hewan && (
              <p style={optionalTextStyle}>Tidak ada gambar dipilih. Gambar lama akan dipertahankan jika tidak ada gambar baru diunggah.</p>
            )}
          </Form.Group>
          <button
            type="submit"
            disabled={submitting}
            style={submitButtonStyle(submitting)}
          >
            {submitting ? "Memperbarui..." : "Perbarui Data Hewan"}
          </button>
          {error && <div style={errorTextStyle}>{error}</div>}
        </Form>
      </Container>
    </div>
  );
}

// Inline Styles (untuk kemudahan, bisa dipindahkan ke file CSS terpisah)
const containerStyle = {
  display: "flex",
  minHeight: "100vh",
  background: "#F4F6F8",
};

const mainStyle = {
  flex: 1,
  padding: "40px 5vw",
};

const headingStyle = {
  fontSize: 28,
  fontWeight: 700,
  color: "#222",
  marginBottom: 32,
};

const formContainerStyle = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  padding: 30,
  maxWidth: 800,
  margin: "0 auto",
};

const formGroupStyle = {
  marginBottom: 20,
};

const labelStyle = {
  display: "block",
  marginBottom: 8,
  fontWeight: 600,
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  border: "1px solid #ccc",
  borderRadius: 8,
  fontSize: 16,
  boxSizing: "border-box", // Penting untuk padding
  transition: "border-color 0.2s ease",
};

const previewContainerStyle = {
  marginTop: 15,
  textAlign: "center",
};

const previewTextStyle = {
  marginBottom: 10,
  fontSize: 14,
  color: "#555",
};

const previewImageStyle = {
  maxWidth: "100%",
  maxHeight: 250,
  borderRadius: 8,
  border: "1px solid #eee",
};

const submitButtonStyle = (submitting) => ({
  background: submitting ? "#6c757d" : "#33693C",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "12px 28px",
  fontWeight: 600,
  fontSize: 18,
  cursor: submitting ? "not-allowed" : "pointer",
  width: "100%",
  transition: "background-color 0.2s ease",
  boxShadow: "0 2px 8px rgba(51,105,60,0.08)",
});

const errorTextStyle = {
  color: "red",
  textAlign: "center",
  marginTop: 20,
};

const loadingStyle = {
  textAlign: "center",
  padding: "50px 0",
  color: "#33693C",
};

const errorStyle = {
  color: "red",
  textAlign: "center",
  padding: "20px",
};

const optionalTextStyle = {
  fontSize: 13,
  color: "#888",
  marginTop: 5,
};