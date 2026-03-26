import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Hapus atau beri komentar pada baris index.css jika kamu pakai Tailwind CDN
// import './index.css' 
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)