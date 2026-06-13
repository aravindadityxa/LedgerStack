import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SplashScreen() {
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()
  const { token, loading } = useAuth()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 3
      })
    }, 60)

    const timer = setTimeout(() => {
      if (!loading) {
        if (token) {
          navigate('/dashboard')
        } else {
          navigate('/login')
        }
      }
    }, 2500)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [navigate, token, loading])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center fade-in">
        <div className="mb-8">
          <img 
            src="/logo.svg" 
            alt="LedgerStack" 
            className="w-32 h-32 mx-auto"
          />
          <h1 className="text-2xl font-bold text-[#111827] mt-4 tracking-tight">
            LedgerStack
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage Invoices. Track Revenue. Grow Business.
          </p>
        </div>
        
        <div className="w-56 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
          <div 
            className="h-full bg-[#2563EB] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-slate-400 text-xs font-medium mt-3">
          {progress < 100 ? 'Preparing your workspace...' : 'Ready'}
        </p>
      </div>
    </div>
  )
}