import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './komponen/Navbar';
import Footer from './komponen/Footer';
import Hompage from './pages/Homepage'; 
import Community from './pages/Community';
import Tiket from './pages/Tiket'; 
import Artikel from './pages/Artikel';
import TambahEvent from './pages/TambahEvent';
import TambahGalleri from './pages/TambahGalleri';
import DetailArtikel from './pages/DetailArtikel';

function App() {
  return (
    <Router>
      <NavigationBar/>
      <Routes>
        <Route path='/' element={<Hompage/>} />
        <Route path='/community' element={<Community/>} />
        <Route path='/ticket' element={<Tiket/>} />
        <Route path='/article' element={<Artikel/>} /> 
        <Route path='/tambah-event' element={<TambahEvent/>} /> 
        <Route path='/tambah-galleri' element={<TambahGalleri/>} /> 
        <Route path='/detail-artikel/:id' element={<DetailArtikel/>} /> 
      </Routes>
      <Footer/> 
    </Router>
  );
}

export default App;
