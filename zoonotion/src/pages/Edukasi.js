import React, { useState } from 'react';
import { Container, Button, Image, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Impor file CSS yang baru dibuat
import './Edukasi.css';

// Base path untuk gambar aset Anda
const ASSET_PATH = '/assets';

function Edukasi() {
  const navigate = useNavigate();

  // Definisi kategori hewan
  const categories = [
    {
      name: 'Aves',
      displayName: 'Aves (Burung)',
      image: `${ASSET_PATH}/buttonAves.png`,
      handler: () => {
        navigate('/aves'); 
        console.log("Navigasi ke detail edukasi Aves.");
      }
    },
    {
      name: 'Reptil',
      displayName: 'Reptil (Bunglon)',
      image: `${ASSET_PATH}/buttonReptil.png`,
      handler: () => {
        navigate('/reptil'); // Pastikan path sesuai dengan App.js
        console.log("Navigasi ke detail edukasi Reptil.");
      }
    },
    {
      name: 'Amfibi',
      displayName: 'Amfibi (Katak)',
      image: `${ASSET_PATH}/buttonAmfibi.png`,
      handler: () => {
        navigate('/amfibi'); // Pastikan path sesuai dengan App.js
        console.log("Navigasi ke detail edukasi Amfibi.");
      }
    },
    {
      name: 'Pisces',
      displayName: 'Pisces (Ikan)',
      image: `${ASSET_PATH}/buttonPisces.png`,
      handler: () => {
        navigate('/pisces'); // Pastikan path sesuai dengan App.js
        console.log("Navigasi ke detail edukasi Pisces.");
      }
    },
    {
      name: 'Mamalia',
      displayName: 'Mamalia (Hewan Menyusui)',
      image: `${ASSET_PATH}/buttonMamalia.png`,
      handler: () => {
        navigate('/mamalia'); // Pastikan path sesuai dengan App.js
        console.log("Navigasi ke detail edukasi Mamalia.");
      }
    },
  ];

  // State untuk melacak indeks kategori yang sedang aktif
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const activeCategory = categories[currentCategoryIndex];

  // Fungsi untuk navigasi ke kategori berikutnya
  const goToNextCategory = () => {
    setCurrentCategoryIndex((prevIndex) =>
      (prevIndex + 1) % categories.length
    );
  };

  // Fungsi untuk navigasi ke kategori sebelumnya
  const goToPrevCategory = () => {
    setCurrentCategoryIndex((prevIndex) =>
      (prevIndex - 1 + categories.length) % categories.length
    );
  };

  return (
    <div className="edukasi-page-background">
      <Container className="d-flex justify-content-center align-items-center min-vh-100"> 
        <div className="edukasi-content-box d-flex flex-column align-items-center text-center"> 
          {/* <h2 className="mb-4 text-dark fw-bold edukasi-title-main">Dunia Binatang</h2>  */}
          <h1 className="text-center mb-5 zoo-main-title">
            Dunia Binatang
          </h1>

          <div className="d-flex justify-content-center align-items-center mb-4 w-100 flex-wrap"> 
            {/* Tombol Sebelumnya */}
            <Button
              variant="link"
              onClick={goToPrevCategory}
              className="p-0 mx-3 arrow-btn" // mx-3 untuk margin horizontal, arrow-btn untuk styling
            >
              &#9664; {/* Karakter panah kiri */}
            </Button>

            {/* Gambar Kategori Aktif */}
            <Button
              variant="link"
              onClick={activeCategory.handler}
              className="button-image"
            >
              <Image
                src={`${process.env.PUBLIC_URL}${activeCategory.image}`}
                alt={activeCategory.displayName}
                className="category-main-image" // Menambahkan class baru untuk gambar utama
              />
            </Button>

            {/* Tombol Berikutnya */}
            <Button
              variant="link"
              onClick={goToNextCategory}
              className="p-0 mx-3 arrow-btn" // mx-3 untuk margin horizontal, arrow-btn untuk styling
            >
              &#9654; {/* Karakter panah kanan */}
            </Button>
          </div>

          <h3 className="text-dark fw-bold edukasi-category-name"> {/* Tambah kelas untuk nama kategori */}
            {activeCategory.displayName}
          </h3>
        </div>
      </Container>
    </div>
  );
}

export default Edukasi;