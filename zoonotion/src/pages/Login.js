import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Modal } from "react-bootstrap";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sesuai mode
    if (isRegister) {
      if (!email || !username || !password) {
        return setError("Semua field wajib diisi.");
      }
    } else {
      if ((!username && !email) || !password) {
        return setError("Username/email dan password wajib diisi.");
      }
    }

    try {
      if (isRegister) {
        // REGISTER
        const response = await axios.post("http://localhost:5000/api/users/register", {
          email,
          username,
          password,
        });

        setSuccess(response.data.message || "Registrasi berhasil, silakan cek email untuk OTP.");
        setError("");
        setPendingEmail(email); // simpan email untuk verifikasi OTP
        setShowOtp(true); // tampilkan popup OTP
        // Jangan resetForm di sini, biar email tetap ada untuk OTP
      } else {
        // LOGIN
        const response = await axios.post("http://localhost:5000/api/users/login", {
          email,
          username,
          password,
        });

        const { user } = response.data;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", user.role);

        // Redirect sesuai role
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setSuccess("");
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Terjadi kesalahan";
      setError(msg);
    }
  };

  // Handler verifikasi OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/verify-otp", {
        email: pendingEmail,
        otp_code: otp,
      });
      setShowOtp(false);
      setSuccess("Verifikasi berhasil! Silakan login.");
      setIsRegister(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "OTP salah");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3 className="text-center mb-4">
            {isRegister ? "Daftar Akun Baru" : "Login ke Zoonotion"}
          </h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100">
              {isRegister ? "Daftar" : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>
              {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
              <Button
                variant="link"
                className="p-0"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                  setSuccess("");
                }}
              >
                {isRegister ? "Login di sini" : "Daftar di sini"}
              </Button>
            </small>
          </div>
        </Col>
      </Row>

      {/* Modal/Popup OTP */}
      <Modal show={showOtp} onHide={() => setShowOtp(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verifikasi OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleOtpSubmit}>
            <Form.Group>
              <Form.Label>Masukkan Kode OTP dari Email</Form.Label>
              <Form.Control
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="mt-3" variant="success" block>
              Verifikasi
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Login;
