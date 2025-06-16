import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      const { user } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", user.role);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || err.message || "Login gagal";
      setError(msg);
    }
  };

  const handleAdminLogin = async () => {
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
        role: "admin_login",
      });

      const { user } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "admin");
      navigate("/admin/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || err.message || "Login Admin gagal";
      setError(msg);
    }
  };

  return (
    <Container fluid className="p-0" style={{ height: '100vh' }}>
      <Row className="g-0 h-100">
        {/* Kiri - Form Login */}
        <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
          <div className="w-75">
            <div className="text-center mb-4">
              <img src="/assets/Logo.png" alt="Zoonotion Logo" height="80" />
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Control
                  type="email"
                  placeholder="Masukkan Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-3 rounded-pill shadow-sm border-0"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Masukkan Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-3 rounded-pill shadow-sm border-0"
                  required
                />
              </Form.Group>

              {/* <div className="mb-4 text-start">
                <Link to="#" className="text-decoration-none text-dark">Lupa Password</Link>
              </div> */}

              <div className="d-grid">
                <Button type="submit" className="rounded-pill py-2 fs-5" style={{ backgroundColor: '#9c7b4d', border: 'none' }}>
                  Login
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <span className="me-2 fw-semibold">Sign up</span>
              <span className="fw-bold">|</span>
              <Link to="/register" className="ms-2 text-decoration-none fw-semibold text-dark">Sign in</Link>
            </div>

            {/* <div className="text-center mt-3">
              <Link to="#" onClick={handleAdminLogin} className="fw-semibold text-dark text-decoration-none">
                Login As Admin
              </Link>
            </div> */}
          </div>
        </Col>

        {/* Kanan - Gambar Iguana */}
        <Col md={6} className="d-none d-md-block">
          <img src="/assets/loginGambar.png" alt="Login Background" className="img-fluid h-100 w-100" style={{ objectFit: 'cover' }} />
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
