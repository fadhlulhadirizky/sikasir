import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
// @ts-ignore
import Login from './pages/Login';

const globalStyles = `
  body, html, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
`;

// Komponen Layout untuk Dashboard
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // Tambahkan w-full dan h-screen, pastikan tidak ada kontainer pembungkus lagi di luar ini
    <div className="flex w-full h-screen bg-[#F8FAFC] font-['Poppins'] overflow-hidden">
      <style>{globalStyles}</style>

      {/* 1. Sidebar (Tetap di kiri) */}
      <Sidebar />

      {/* 2. Area Kanan (Header + Content) */}
      <div className="flex-grow flex flex-col min-w-0">
        <Header />

        {/* Main content: p-8 memberikan jarak konten putih dari header & sidebar */}
        <main className="flex-grow p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Login (Tampilan Penuh) */}
        <Route path="/" element={<Login />} />

        {/* Route Dashboard Kasir (Menggunakan Layout Full Screen) */}
        <Route
          path="/kasir"
          element={
            <DashboardLayout>
              {/* Box Putih Konten Utama */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[calc(100vh-160px)]">
                <h1 className="text-gray-800 font-bold text-xl">Konten Kasir / POS akan tampil di sini</h1>
                <p className="text-gray-400 text-sm italic mt-2">Sedang dalam pengerjaan branch fe-kasir-pos...</p>
              </div>
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;