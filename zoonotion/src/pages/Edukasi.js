import React, { useState } from 'react';
import { Container, Button, Image, Row, Col } from 'react-bootstrap'; // Tambahkan Row, Col
import { useNavigate } from 'react-router-dom';

// Impor file CSS yang baru dibuat
import './Edukasi.css'; // Sesuaikan path jika file css berada di folder lain

// Base path untuk gambar aset Anda
const ASSET_PATH = '/assets'; // Jika gambar ada di public/assets

function Edukasi() {
  const navigate = useNavigate();

  // Definisi kategori hewan
  const categories = [
    {
      name: 'Aves',
      displayName: 'Aves (Burung)',
      image: `${ASSET_PATH}/buttonAves.png`,
      handler: () => {
        navigate('/aves'); // Placeholder
        console.log("Navigasi ke detail edukasi Aves.");
      }
    },
    {
      name: 'Reptil',
      displayName: 'Reptil (Bunglon)',
      image: `${ASSET_PATH}/buttonReptil.png`,
      handler: () => {
        navigate('#'); // Placeholder
        console.log("Navigasi ke detail edukasi Reptil.");
      }
    },
    {
      name: 'Amfibi',
      displayName: 'Amfibi (Katak)', // Contoh: Anda bisa sesuaikan nama display
      image: `${ASSET_PATH}/buttonAmfibi.png`,
      handler: () => {
        navigate('#'); // Placeholder
        console.log("Navigasi ke detail edukasi Amfibi.");
      }
    },
    {
      name: 'Pisces',
      displayName: 'Pisces (Ikan)', // Contoh
      image: `${ASSET_PATH}/buttonPisces.png`,
      handler: () => {
        navigate('#'); // Placeholder
        console.log("Navigasi ke detail edukasi Pisces.");
      }
    },
    {
      name: 'Mamalia',
      displayName: 'Mamalia (Hewan Menyusui)', // Contoh
      image: `${ASSET_PATH}/buttonMamalia.png`,
      handler: () => {
        navigate('#'); // Placeholder
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
      <Container className="text-center" style={{ marginTop: '100px' }}>
        <div className="edukasi-content-box d-flex flex-column align-items-center">
          <div className="pin-blue top-left"></div>
          <div className="pin-blue top-right"></div>

          <h2 className="mb-4 text-dark fw-bold">Dunia Binatang</h2>

          <div className="d-flex justify-content-center align-items-center mb-4" style={{ width: '100%' }}>
            {/* Tombol Sebelumnya */}
            <Button
              variant="link"
              onClick={goToPrevCategory}
              className="p-0 me-3" // Padding 0, margin-end
              style={{ fontSize: '2rem', color: '#33693C', textDecoration: 'none' }}
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
              />
            </Button>

            {/* Tombol Berikutnya */}
            <Button
              variant="link"
              onClick={goToNextCategory}
              className="p-0 ms-3" // Padding 0, margin-start
              style={{ fontSize: '2rem', color: '#33693C', textDecoration: 'none' }}
            >
              &#9654; {/* Karakter panah kanan */}
            </Button>
          </div>

          <h3 className="text-dark fw-bold">
            {activeCategory.displayName}
          </h3>
        </div>

        {/* Anda bisa menghapus tombol "Ganti Kategori" ini jika sudah menggunakan tombol panah */}
        {/* <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => setActiveCategory(activeCategory === 'Aves' ? 'Reptil' : 'Aves')}
          >
            Ganti Kategori ({activeCategory === 'Aves' ? 'Lihat Reptil' : 'Lihat Aves'})
          </Button>
        </div> */}
      </Container>
    </div>
  );
}

export default Edukasi;