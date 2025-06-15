import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa'; // Untuk ikon kamera di foto profil

import './Profiles.css'; // Pastikan Anda memiliki file CSS ini
import axios from 'axios';

const API_BASE_URL = "http://localhost:5000"; // Sesuaikan jika API Anda di domain/port berbeda

function Profile() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null); // Menyimpan data profil yang dimuat
  const [isEditing, setIsEditing] = useState(false);   // Mode edit profil
  const [formData, setFormData] = useState({           // Data yang akan di-edit/dikirim
    username: '',
    email: '',
    foto_profil: null, // Bisa berupa string URL atau objek File (saat diupload)
    tanggal_lahir: '',
    alamat: '',
    noted: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null); // Ref untuk input file tersembunyi

  useEffect(() => {
    fetchProfile();
  }, []); // Hanya dijalankan sekali saat komponen di-mount

  const getUserDataFromLocalStorage = () => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const user = JSON.parse(userDataString);
        if (user && user.id) {
          return { userId: user.id, username: user.username, email: user.email };
        }
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        localStorage.removeItem("user"); // Hapus data yang rusak
        navigate('/login');
        return null;
      }
    }
    return null;
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const userData = getUserDataFromLocalStorage();

    if (!userData || !userData.userId) {
      setError("Anda harus login untuk melihat halaman profil.");
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      // Mengambil data profil dari backend
      const response = await axios.get(`${API_BASE_URL}/api/profile/${userData.userId}`);
      const data = response.data;

      // Set userProfile untuk tampilan
      setUserProfile(data);

      // Inisialisasi formData dengan data dari backend
      // Username dan email diambil dari userData (localStorage) karena backend tidak mengizinkan update via profile endpoint
      setFormData({
        username: userData.username || '', // Selalu ambil dari localStorage untuk konsistensi
        email: userData.email || '',       // Selalu ambil dari localStorage untuk konsistensi
        foto_profil: data.foto_profil || null,
        tanggal_lahir: data.tanggal_lahir || '', // Jika null, akan jadi string kosong
        alamat: data.alamat || '',
        noted: data.noted || ''
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response && err.response.status === 404) {
        // Jika profil di database belum ada (404), inisialisasi dengan data dari localStorage user
        setError("Profil pengguna belum dibuat. Silakan lengkapi data Anda.");
        setFormData(prev => ({
          ...prev,
          username: userData.username || '',
          email: userData.email || ''
        }));
        setUserProfile({ // Set userProfile juga agar tampilan tidak loading terus
          user_id: userData.userId,
          username: userData.username,
          email: userData.email,
          foto_profil: null, // Default placeholder
          tanggal_lahir: null,
          alamat: null,
          noted: null,
        });
      } else {
        setError("Gagal memuat profil. Silakan coba lagi nanti.");
      }
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setError(null);
    setMessage(null);
    // Reset form data ke userProfile terakhir yang dimuat
    setFormData({
      username: userProfile.username || '',
      email: userProfile.email || '',
      foto_profil: userProfile.foto_profil || null, // Kembali ke foto profil yang sudah ada (path)
      tanggal_lahir: userProfile.tanggal_lahir || '',
      alamat: userProfile.alamat || '',
      noted: userProfile.noted || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    // Simpan objek File, bukan hanya nama atau path
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, foto_profil: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const userData = getUserDataFromLocalStorage();

    if (!userData || !userData.userId) {
      setError("User ID tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const data = new FormData();
      data.append('tanggal_lahir', formData.tanggal_lahir);
      data.append('alamat', formData.alamat);
      data.append('noted', formData.noted);

      if (formData.foto_profil instanceof File) {
        data.append('foto_profil', formData.foto_profil);
      }

      await axios.put(`${API_BASE_URL}/api/profile/${userData.userId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage("Profil berhasil diperbarui!");
      setIsEditing(false);
      fetchProfile(); // Refresh data setelah update untuk menampilkan data terbaru
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Gagal memperbarui profil. Silakan coba lagi nanti.");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-page-container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="success" />
        <p className="ms-3 text-success">Memuat profil...</p>
      </div>
    );
  }

  // Tentukan URL foto profil yang akan ditampilkan
  let displayedFotoProfil = `${process.env.PUBLIC_URL}/placeholder-profile.png`; // Default placeholder
  if (isEditing && formData.foto_profil instanceof File) {
    displayedFotoProfil = URL.createObjectURL(formData.foto_profil); // Preview file baru
  } else if (userProfile && userProfile.foto_profil) {
    displayedFotoProfil = `${API_BASE_URL}${userProfile.foto_profil}`; // URL dari backend
  }

  return (
    <div className="profile-page-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="profile-card-custom">
              <h1 className="text-center mb-5 zoo-main-title">
                Profile Pengguna 
              </h1>
              <Row>
                {/* Kiri: Foto profil, nama, email */}
                <Col md={4} className="text-center">
                  <div className="profile-avatar-wrapper mx-auto mb-3">
                    <img src={displayedFotoProfil} alt="Foto Profil" className="profile-avatar" />
                    {isEditing && (
                      <>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <div className="profile-camera-icon" onClick={() => fileInputRef.current.click()}>
                          <FaCamera />
                        </div>
                      </>
                    )}
                  </div>
                  <h5 className="profile-name mt-3">{formData.username}</h5>
                  <p className="profile-email">{formData.email}</p>
                </Col>

                {/* Kanan: Form edit */}
                <Col md={8}>
                  <Form onSubmit={handleSubmit} className="profile-form-custom">
                    <Form.Group>
                      <Form.Label>Tanggal Lahir</Form.Label>
                      {isEditing ? (
                        <Form.Control
                          type="date"
                          name="tanggal_lahir"
                          value={formData.tanggal_lahir}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="profile-static-text">{userProfile?.tanggal_lahir || 'Belum diisi'}</div>
                      )}
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Alamat</Form.Label>
                      {isEditing ? (
                        <Form.Control
                          as="textarea"
                          name="alamat"
                          value={formData.alamat}
                          onChange={handleChange}
                          rows={3}
                        />
                      ) : (
                        <div className="profile-static-text">{userProfile?.alamat || 'Belum diisi'}</div>
                      )}
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Noted</Form.Label>
                      {isEditing ? (
                        <Form.Control
                          as="textarea"
                          name="noted"
                          value={formData.noted}
                          onChange={handleChange}
                          rows={3}
                        />
                      ) : (
                        <div className="profile-static-text">{userProfile?.noted || 'Belum ada catatan'}</div>
                      )}
                    </Form.Group>

                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <div className="d-flex justify-content-center gap-2 mt-4">
                      {isEditing ? (
                        <>
                          <Button variant="danger" onClick={handleCancelClick}>Batal</Button>
                          <Button variant="success" type="submit">Simpan</Button>
                        </>
                      ) : (
                        <Button variant="warning" onClick={handleEditClick}>Edit Profil</Button>
                      )}
                    </div>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Profile;