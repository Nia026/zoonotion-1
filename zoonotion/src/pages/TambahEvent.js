import React from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './TambahEvent.css'; 

function TambahEvent(){
  return (
    <div className="bg-brown-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="bg-green-dark text-white rounded p-4 mb-4">
              <h2 className="text-center mb-4">Tambah Event</h2>
            </div>
            <div>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="eventName">
                      <Form.Label className="fw-bold">Nama Event:</Form.Label>
                      <Form.Control type="text" placeholder="Masukkan nama event" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="eventDate">
                      <Form.Label className="fw-bold">Tanggal Event:</Form.Label>
                      <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="eventDescription">
                      <Form.Label className="fw-bold">Deskripsi Event:</Form.Label>
                      <Form.Control as="textarea" rows={4} placeholder="Masukkan deskripsi event" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="eventPhoto">
                      <Form.Label className="fw-bold">Upload Foto:</Form.Label>
                      <div className="border rounded p-3 d-flex justify-content-center align-items-center bg-white" style={{ height: '146px' }}>
                        <Form.Control type="file" className="form-control-file" />
                      </div>
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

export default TambahEvent 