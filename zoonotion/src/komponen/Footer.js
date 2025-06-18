import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer
      className="bg-white text-center text-muted"
      style={{
        padding: "16px 0",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.06)", // bayangan ke atas
        borderTop: "1px solid #eee",
        zIndex: 10,
      }}
    >
      <Container>
        <small>Made with ❤️ by Unotopia Team</small>
      </Container>
    </footer>
  );
}

export default Footer;
