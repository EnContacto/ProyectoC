import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { MainLayout } from '@/layouts/MainLayout'
import { LoginPage } from '@/pages/LoginPage'
import { ActivosPage } from '@/pages/ActivosPage'
import { DepreciacionesPage } from '@/pages/DepreciacionesPage'
import { ReportesPage } from '@/pages/ReportesPage'
import { RevisionManualPage } from '@/pages/RevisionManualPage'
import { HistorialImportacionesPage } from '@/pages/HistorialImportacionesPage'
import { BusquedaGlobalPage } from '@/pages/BusquedaGlobalPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/activos" replace />} />
          <Route path="/activos" element={<ActivosPage />} />
          <Route path="/depreciaciones" element={<DepreciacionesPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/revision-manual" element={<RevisionManualPage />} />
          <Route path="/historial-importaciones" element={<HistorialImportacionesPage />} />
          <Route path="/busqueda" element={<BusquedaGlobalPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}