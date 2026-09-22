import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { TournamentProvider } from './contexts/TournamentContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import OTPPage from './pages/OTPPage'
import FighterNumberPage from './pages/FighterNumberPage'
import TournamentSetupPage from './pages/TournamentSetupPage'
import CombatPage from './pages/CombatPage'
import CombatDetailPage from './pages/CombatDetailPage'
import StatsPage from './pages/StatsPage'

function App() {
  return (
    <AuthProvider>
      <TournamentProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/otp" element={<ProtectedRoute><OTPPage /></ProtectedRoute>} />
          <Route path="/fighters" element={<ProtectedRoute><FighterNumberPage /></ProtectedRoute>} />
          <Route path="/tournament-setup" element={<ProtectedRoute><TournamentSetupPage /></ProtectedRoute>} />
          <Route path="/combat" element={<ProtectedRoute><CombatPage /></ProtectedRoute>} />
          <Route path="/combat/:combatId" element={<ProtectedRoute><CombatDetailPage /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </TournamentProvider>
    </AuthProvider>
  )
}

export default App
