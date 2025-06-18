import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

function StaticNavbar() {
  return (
    <Navbar
      bg="white"
      expand="lg"
      className="shadow-sm border-bottom"
      style={{
        zIndex: 20,
        height: "80px",
        padding: "0 3rem",
        position: "sticky",
        top: 0,
      }}
    >
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center">
          <img
            src="/assets/Logo.png"
            height="60"
            className="d-inline-block align-middle"
            alt="Zoonotion Logo"
            style={{ objectFit: "contain" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="static-navbar-nav" />
        <Navbar.Collapse id="static-navbar-nav" className="justify-content-end">
          <Nav className="ms-auto align-items-center fw-semibold text-dark">
            Admin
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default StaticNavbar;
