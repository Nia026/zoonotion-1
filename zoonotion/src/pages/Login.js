import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import styles from "./AuthStyles.module.css";

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
        email, // Anda mungkin perlu field khusus untuk admin login
        password, // Anda mungkin perlu field khusus untuk admin login
        role: "admin_login", // Atau cara lain backend membedakan login admin
      });

      const { user } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "admin"); // Set role di frontend
      navigate("/admin/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || err.message || "Login Admin gagal";
      setError(msg);
    }
  };

  return (
    <Container fluid className={`${styles.authContainer} mt-0`}> {/* mt-0 karena sudah di tengah */}
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={8} xl={12} className={styles.authCard}>
          <div className="text-center mb-4">
            <img src="/assets/Logo.png" alt="Zoonotion Logo" height="70" />
            <h3 className="mt-3">Login ke Zoonotion</h3>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
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
              Login
            </Button>
          </Form>

          <div className={styles.authLinkContainer}>
            <small>
              Belum punya akun? <Link to="/register" className={styles.authLink}>Sign up</Link>
            </small>
            <Link to="#" onClick={handleAdminLogin} className={styles.adminLink}>
              Login As Admin
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;