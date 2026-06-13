import { useAuth as useAuthContext } from '../context/AuthContext'

export function useAuth() {
  const auth = useAuthContext()
  
  const isAdmin = auth.user?.role === 'admin'
  const fullName = auth.user?.full_name || 'User'
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase()
  
  return {
    ...auth,
    isAdmin,
    fullName,
    initials,
  }
}