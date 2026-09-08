import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { TournamentProvider } from './contexts/TournamentContext'
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
          <Route path="/home" element={<HomePage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/fighters" element={<FighterNumberPage />} />
          <Route path="/tournament-setup" element={<TournamentSetupPage />} />
          <Route path="/combat" element={<CombatPage />} />
          <Route path="/combat/:combatId" element={<CombatDetailPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </TournamentProvider>
    </AuthProvider>
  )
}

export default App
