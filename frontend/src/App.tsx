import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// @ts-ignore
import Sidebar from './components/Sidebar';
// @ts-ignore
import Header from './components/Header';
// @ts-ignore
import Login from './pages/Login';
// @ts-ignore
import Kasir from './pages/kasir/Kasir'; // Panggil halaman Kasir

const globalStyles = `
  body, html, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: #F8FAFC;
  }
`;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full h-screen bg-[#F8FAFC] font-['Poppins'] overflow-hidden">
      <style>{globalStyles}</style>
      <Sidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <Header />
        <main className="flex-grow p-6 overflow-y-auto">
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
        <Route path="/" element={<Login />} />

        {/* Sekarang route /kasir isinya jauh lebih simpel */}
        <Route
          path="/kasir"
          element={
            <DashboardLayout>
              <Kasir />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;