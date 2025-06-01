import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

function StaticNavbar() {
  const baseStyle = {
    color: '#1E1E1E',
    padding: '8px',
    borderRadius: '8px',
    textDecoration: 'none',
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand>
          <img
            src="/assets/Logo.png" // Pastikan path logo ini benar
            height="70"
            className="d-inline-block align-top"
            alt="Zoonotion Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="static-navbar-nav" />
        <Navbar.Collapse id="static-navbar-nav" className="justify-content-end">
          <Nav className="ms-auto align-items-center">
            Admin
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default StaticNavbar;