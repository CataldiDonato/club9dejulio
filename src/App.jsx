import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Socios from './pages/Socios';
import Noticias from './pages/Noticias';
import Deportes from './pages/Deportes';
import Instalaciones from './pages/Instalaciones';
import Historia from './pages/Historia'; // Keep Historia as it's used in routes
import NewsDetail from './pages/NewsDetail';
import AdminSports from './pages/AdminSports';
import AdminNews from './pages/AdminNews';
import ProdeJugar from './pages/ProdeJugar';
import ProdeRanking from './pages/ProdeRanking';
import AdminProde from './pages/AdminProde';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white text-black font-sans">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticias/:id" element={<NewsDetail />} />
            <Route path="/deportes" element={<Deportes />} />
            <Route path="/instalaciones" element={<Instalaciones />} />
            <Route path="/socios" element={<Socios />} />
            <Route path="/admin/news" element={<AdminNews />} />
             <Route path="/admin/sports" element={<AdminSports />} />
             <Route path="/admin/prode" element={<AdminProde />} />
             <Route path="/admin/users" element={<AdminUsers />} />
             <Route path="/prode/jugar" element={<ProdeJugar />} />
             <Route path="/prode/ranking" element={<ProdeRanking />} />
           </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
