import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage     from "./pages/Homepage";
import Community    from "./pages/Community";
import Tiket        from "./pages/Tiket";
import Artikel      from "./pages/Artikel";
import TambahEvent  from "./Admin/TambahEvent";
import DetailArtikel from "./pages/DetailArtikel";
import DashboardAdmin from "./Admin/DashboardAdmin";
import ProtectedRoute from "./komponen/ProtectedRoute";
import Login         from "./pages/Login";
import Register from "./pages/Register";
import ManajemenEvent from "./Admin/ManajemenEvent";
import ManajemenZoo from "./Admin/ManajemenZoo";
import ManajemenCommunity from "./Admin/ManajemenCommunity";
import ManajemenGaleri from "./Admin/ManajemenGaleri";
import KelolaHewan from "./Admin/KelolaHewan";
import KelolaArtikel from "./Admin/KelolaArtikel";
import Informasi from "./Admin/Informasi";
import TambahArtikel from "./Admin/TambahArtikel"; 
import TambahHewan from "./Admin/TambahHewan"; 
import Profiles from "./pages/Profiles";
import UserLayout from "./komponen/UserLayout";
import AdminLayout from "./komponen/AdminLayout";
import Edukasi from "./pages/Edukasi";
import Aves from "./pages/Aves";
import Reptil from "./pages/Reptil";
import Amfibi from "./pages/Amfibi";
import Pisces from "./pages/Pisces";
import Mamalia from "./pages/Mamalia";
import EditArtikel from "./Admin/EditArtikel";
import EditHewan from "./Admin/EditHewan";
import KelolaZoo from "./Admin/KelolaZoo";
import EditZoo from "./Admin/EditZoo";
import EditEvent from "./Admin/EditEvent";

function App() {
  return (
    <Router>
      {/* <NavigationBar /> */}
      <Routes>
        <Route path="/" element={<UserLayout><HomePage /></UserLayout> } />
        <Route path="/community" element={<UserLayout><Community /></UserLayout>} />
        <Route path="/ticket" element={<UserLayout><Tiket /></UserLayout>} />
        <Route path="/article" element={<UserLayout><Artikel /></UserLayout>} />
        <Route path="/detail-artikel/:id" element={<UserLayout><DetailArtikel /></UserLayout>} />
        <Route path="/profiles" element={<UserLayout><Profiles /></UserLayout>} />
        <Route path="/education" element={<UserLayout><Edukasi /></UserLayout>} /> 
        <Route path="/aves" element={<UserLayout><Aves /></UserLayout>} />
        <Route path="/reptil" element={<UserLayout><Reptil /></UserLayout>} /> 
        <Route path="/amfibi" element={<UserLayout><Amfibi /></UserLayout>} />  
        <Route path="/pisces" element={<UserLayout><Pisces /></UserLayout>} /> 
        <Route path="/mamalia" element={<UserLayout><Mamalia /></UserLayout>} /> 

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <DashboardAdmin />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/admin/manajemen-event" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <ManajemenEvent />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/admin/manajemen-zoo" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <ManajemenZoo />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/admin/manajemen-community" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <ManajemenCommunity />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/admin/manajemen-galeri" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <ManajemenGaleri />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/admin/kelola-hewan" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <KelolaHewan />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/tambah-event" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <TambahEvent />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/admin/kelola-artikel" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <KelolaArtikel />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/admin/informasi" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <Informasi />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/tambah-artikel" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <TambahArtikel />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/tambah-hewan" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <TambahHewan />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/edit-artikel/:id" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <EditArtikel />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/edit-hewan/:id" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <EditHewan />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/admin/kelolaZoo" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <KelolaZoo />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/edit-zoo/:id" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <EditZoo />
              </AdminLayout>
            </ProtectedRoute>} />
        <Route path="/edit-event/:id" element={<ProtectedRoute isAdmin={true}>
              <AdminLayout>
                <EditEvent />
              </AdminLayout>
            </ProtectedRoute>} />

        {/* fallback 404 */}
        <Route path="*" element={<h2>404 — Halaman tidak ditemukan</h2>} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
