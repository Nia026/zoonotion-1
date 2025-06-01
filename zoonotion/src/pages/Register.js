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
    <Container fluid className={`${styles.registerContainer} mt-0`}>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={8} xl={12} className={styles.authCard}>
          <div className="text-center mb-4">
            <img src="/assets/Logo.png" alt="Zoonotion Logo" height="70" />
            <h3 className="mt-3">Daftar Akun Baru</h3>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && !verificationSuccess && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className={`mb-3 ${styles.formGroup}`}>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className={`mb-3 ${styles.formGroup}`}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.formControl}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className={`mb-4 ${styles.formGroup}`}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.formControl}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className={styles.authButton}>
              Register
            </Button>
          </Form>

          <div className={styles.authLinkContainer}>
            <small>
              Sudah punya akun? <Link to="/login" className={styles.authLink}>Sign in</Link>
            </small>
          </div>
        </Col>
      </Row>

      {/* OTP Verification Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Body className={styles.otpModalBody}>
          <img src="/assets/email_verification.png" alt="Email Verification" height="80" className="mb-3" />
          <p>Kami telah mengirimkan kode verifikasi ke alamat email <strong>{pendingEmail}</strong></p>
          <p>Silakan masukkan kode dan verifikasi akun Anda</p>
          <Form onSubmit={handleVerifyOtp} className="mt-3">
            <div className={styles.otpInputContainer}>
              {[...Array(6)].map((_, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  maxLength="1"
                  className={`${styles.otpInput}`}
                  value={otp[index] || ""}
                  onChange={(e) => {
                    const newOtp = otp.split("");
                    newOtp[index] = e.target.value;
                    setOtp(newOtp.join(""));
                  }}
                  required
                />
              ))}
            </div>
            <Button variant="success" type="submit" className={styles.verifyButton}>
              Verifikasi
            </Button>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Form>
        </Modal.Body>
      </Modal>

      {/* Verification Success Modal */}
      <Modal show={verificationSuccess} onHide={() => {}} centered>
        <Modal.Body className={styles.successModalBody}>
          <img src="/assets/verification_success.png" alt="Verification Success" height="80" className="mb-3" />
          <h4 className="mb-3">Selamat! Verifikasi akun berhasil</h4>
          <p>Welcome to Zoo Notion</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Register;