import { Navigate, Route, Routes } from 'react-router-dom'
import SlideshowPage from './pages/SlideshowPage'
import WeddingInvitePage from './pages/WeddingInvitePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/aakashvijiweddinginvite" replace />} />
      <Route path="/aakashvijiweddinginvite" element={<WeddingInvitePage />} />
      <Route path="/aakashvijislideshow" element={<SlideshowPage />} />
    </Routes>
  )
}

export default App
