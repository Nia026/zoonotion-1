// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./komponen/Navbar";
import Footer       from "./komponen/Footer";
import HomePage     from "./pages/Homepage";
import Community    from "./pages/Community";
import Tiket        from "./pages/Tiket";
import Artikel      from "./pages/Artikel";
import TambahEvent  from "./Admin/TambahEvent";
import TambahGalleri from "./pages/TambahGalleri";
import DetailArtikel from "./pages/DetailArtikel";
import DashboardAdmin from "./Admin/DashboardAdmin";
import ProtectedRoute from "./komponen/ProtectedRoute";
import Login         from "./pages/Login";
import ManajemenEvent from "./Admin/ManajemenEvent";
import ManajemenZoo from "./Admin/ManajemenZoo";
import ManajemenCommunity from "./Admin/ManajemenCommunity";
import ManajemenGaleri from "./Admin/ManajemenGaleri";
import KelolaHewan from "./Admin/KelolaHewan";
import KelolaArtikel from "./Admin/KelolaArtikel";
import Informasi from "./Admin/Informasi";
import TambahArtikel from "./Admin/TambahArtikel"; // Tambahkan import ini
import TambahHewan from "./Admin/TambahHewan"; // Import komponen form tambah hewan
import Profiles from "./pages/Profiles"; // Tambahkan import ini

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/community" element={<Community />} />
        <Route path="/ticket" element={<Tiket />} />
        <Route path="/article" element={<Artikel />} />
        <Route path="/tambah-event" element={<TambahEvent />} />
        <Route path="/tambah-galleri" element={<TambahGalleri />} />
        <Route path="/detail-artikel/:id" element={<DetailArtikel />} />
        <Route path="/login" element={<Login />} />

        <Route path="/profiles" element={<Profiles />} /> {/* Tambahkan route ini */}

        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/manajemen-event" element={<ManajemenEvent />} />
        <Route path="/admin/manajemen-zoo" element={<ManajemenZoo />} />
        <Route path="/admin/manajemen-community" element={<ManajemenCommunity />} />
        <Route path="/admin/manajemen-galeri" element={<ManajemenGaleri />} />
        <Route path="/admin/kelola-hewan" element={<KelolaHewan />} />
        <Route path="/admin/kelola-artikel" element={<KelolaArtikel />} />
        <Route path="/admin/informasi" element={<Informasi />} />
        <Route path="/tambah-artikel" element={<TambahArtikel />} />
        <Route path="/tambah-hewan" element={<TambahHewan />} />

        {/* fallback 404 */}
        <Route path="*" element={<h2>404 — Halaman tidak ditemukan</h2>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
