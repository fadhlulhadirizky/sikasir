import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// @ts-ignore
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Nanti route untuk dashboard admin/kasir taruh di sini */}
      </Routes>
    </Router>
  );
}

export default App;