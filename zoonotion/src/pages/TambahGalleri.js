import React from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './TambahEvent.css';

function TambahGalleri(){
  return (
    <div className="bg-brown-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="bg-green-dark text-white rounded p-4 mb-4">
              <h2 className="text-center mb-4">Tambah Galeri</h2>
            </div>
            <div>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="uploadPhoto">
                      <Form.Label className="fw-bold">Upload Foto:</Form.Label>
                      <div className="border rounded p-3 d-flex justify-content-center align-items-center bg-white" style={{ height: '155px' }}>
                        <Form.Control type="file" className="form-control-file" />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="photoDescription">
                      <Form.Label className="fw-bold">Deskripsi Foto:</Form.Label>
                      <Form.Control as="textarea" rows={4} placeholder="Masukkan deskripsi foto" />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid mt-3">
                  <Button variant="success" type="submit" className="rounded-pill">
                    Simpan
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default TambahGalleri 