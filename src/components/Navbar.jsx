import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { User, Settings, LogOut, LogIn } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, signInWithGoogle, signOut, isAdmin } = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('登入失敗:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('登出失敗:', error)
    }
  }

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl">Sk Trail</span>
            <span className="text-sm text-slate-300">越野跑鞋推薦</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata?.full_name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User size={20} />
                    )}
                    <span className="hidden md:inline">
                      {user.user_metadata?.full_name || 'User'}
                    </span>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 fade-in">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-slate-700 hover:bg-slate-100"
                          onClick={() => setShowMenu(false)}
                        >
                          <div className="flex items-center gap-2">
                            <Settings size={16} />
                            後台管理
                          </div>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleSignOut()
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        登出
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <LogIn size={20} />
                <span className="hidden md:inline">登入</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

