import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setIsLoggedIn(!!userData); // true jika ada user
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const baseStyle = {
    color: '#1E1E1E',
    padding: '8px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    textDecoration: 'none'
  };

  const activeStyle = {
    backgroundColor: '#A2845E',
    color: 'white'
  };

  const getLinkStyle = (path) => {
    return location.pathname === path
      ? { ...baseStyle, ...activeStyle }
      : baseStyle;
  };

  const links = [
    { to: "/", label: "HOME" },
    { to: "/education", label: "EDUCATION" },
    { to: "/community", label: "COMMUNITY" },
    { to: "/ticket", label: "ZOO" },
    { to: "/article", label: "ARTICLE" },
  ];

  // Tambahkan PROFILE hanya jika sudah login
  if (isLoggedIn) {
    links.push({ to: "/profiles", label: "PROFILE" });
  }

  return (
    <Navbar bg="white" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/assets/Logo.png"
            height="70"
            className="d-inline-block align-top"
            alt="Zoonotion Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ms-auto align-items-center">
            {links.map((link) => (
              <Nav.Item key={link.to}>
                <Nav.Link
                  as={Link}
                  to={link.to}
                  style={getLinkStyle(link.to)}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.to) {
                      e.target.style.backgroundColor = '#A2845E';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.to) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#1E1E1E';
                    }
                  }}
                >
                  {link.label}
                </Nav.Link>
              </Nav.Item>
            ))}
            <Nav.Item className="ms-3">
              {isLoggedIn ? (
                <Button
                  variant="outline-danger"
                  onClick={handleLogout}
                  style={{ borderRadius: '8px', padding: '6px 16px' }}
                >
                  LOGOUT
                </Button>
              ) : (
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-dark"
                  style={{ borderRadius: '8px', padding: '6px 16px' }}
                >
                  LOGIN
                </Button>
              )}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
