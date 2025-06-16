import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import styles from "./AuthStyles.module.css"; // Import file CSS khusus untuk Auth

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !username || !password) {
      return setError("Semua field wajib diisi.");
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", {
        email,
        username,
        password,
      });
      setSuccess("Registrasi berhasil! Silakan cek email Anda untuk kode verifikasi.");
      setPendingEmail(email);
      setShowOtpModal(true);
      resetForm(); // Kosongkan form setelah berhasil request OTP
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || err.message || "Registrasi gagal";
      setError(msg);
    }
  };

  const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setVerificationSuccess(false);
        try {
          const response = await axios.post("http://localhost:5000/api/users/verify-otp", {
            email: pendingEmail,
            otp_code: otp,
          });
          setVerificationSuccess(true);
          setSuccess("Verifikasi berhasil! Selamat datang di Zoonotion.");
          // Tidak perlu reset form di sini, modal sukses akan muncul
    
          // Pindahkan kode ini ke dalam blok try setelah mendapatkan response
          const { user } = response.data;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userRole", user.role);
    
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } catch (err) {
          const msg = err.response?.data?.message || "Kode OTP salah.";
          setError(msg);
        }
      };

  useEffect(() => {
    if (verificationSuccess) {
      const timer = setTimeout(() => {
        navigate("/"); // Navigasi ke halaman user setelah 3 detik
      }, 3000);
      return () => clearTimeout(timer); // Clean up timer
    }
  }, [verificationSuccess, navigate]);

  return (
    <Container fluid className="p-0" style={{ height: '100vh' }}>
      <Row className="g-0 h-100">
        {/* Left Image */}
        <Col md={6} className="d-none d-md-block">
          <img src="/assets/registerGambar.png" alt="Zoo Register" className="img-fluid h-100 w-100" style={{ objectFit: 'cover' }} />
        </Col>

        {/* Right Form */}
        <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
          <div className="w-75">
            <div className="text-center mb-4">
              <img src="/assets/Logo.png" alt="Zoonotion Logo" height="80" />
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && !verificationSuccess && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Control
                  type="text"
                  placeholder="Masukkan Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="py-3 rounded-pill shadow-sm border-0"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Control
                  type="email"
                  placeholder="Masukkan Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-3 rounded-pill shadow-sm border-0"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Control
                  type="password"
                  placeholder="Masukkan Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-3 rounded-pill shadow-sm border-0"
                />
              </Form.Group>

              <div className="d-grid">
                <Button type="submit" className="rounded-pill py-2 fs-5" style={{ backgroundColor: '#9c7b4d', border: 'none' }}>
                  Register
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <span className="me-2">Sign up</span>
              <span className="fw-bold">|</span>
              <Link to="/login" className="ms-2 text-decoration-none fw-semibold text-dark">Sign in</Link>
            </div>
          </div>
        </Col>
      </Row>

      {/* OTP Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Body className="text-center p-4">
          <img src="/assets/email_verification.png" alt="Verifikasi Email" height="80" className="mb-3" />
          <h5>Verifikasi Email</h5>
          <p className="mb-3">Kode verifikasi dikirim ke <strong>{pendingEmail}</strong></p>

          <Form onSubmit={handleVerifyOtp}>
            <div className="d-flex justify-content-center gap-2 mb-3">
              {[...Array(6)].map((_, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index] || ""}
                  onChange={(e) => {
                    const newOtp = otp.split("");
                    newOtp[index] = e.target.value;
                    setOtp(newOtp.join(""));
                  }}
                  className="text-center"
                  style={{ width: '40px', height: '45px', fontSize: '18px' }}
                />
              ))}
            </div>

            <Button type="submit" className="rounded-pill px-4" variant="success">
              Verifikasi
            </Button>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Form>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal show={verificationSuccess} onHide={() => {}} backdrop="static" centered>
        <Modal.Body className="text-center p-4">
          <img src="/assets/verification_success.png" alt="Berhasil" height="80" className="mb-3" />
          <h4 className="mb-2">Selamat!</h4>
          <p>Verifikasi akun berhasil. Welcome to Zoo Notion</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Register;