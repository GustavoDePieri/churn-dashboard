import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { format } from 'date-fns';

interface HeaderProps {
  lastUpdated?: Date | string;
}

export default function Header({ lastUpdated }: HeaderProps) {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Loading...';
    
    const date = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
    
    if (isNaN(date.getTime())) return 'Unknown';
    
    return format(date, 'MMM dd, yyyy HH:mm:ss');
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/10 shadow-lg backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Clickable */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden transition-transform group-hover:scale-105 shadow-lg ring-2 ring-purple-main/30">
              <Image
                src="/logo.jpg"
                alt="Ontop"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">Churn Analytics</h1>
            </div>
          </Link>

          {/* Center - Last Updated Indicator */}
          <div className="hidden md:flex items-center space-x-2 glass-light px-4 py-2 rounded-xl">
            <div className="relative">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div className="text-sm">
              <p className="text-white/60 text-xs">Data Updated</p>
              <p className="text-white font-medium">{formatLastUpdated()}</p>
            </div>
          </div>

          {/* Right Side - User Info & Logout */}
          <div className="flex items-center space-x-4">
            {session?.user && (
              <div className="hidden sm:block text-right">
                <p className="text-sm text-white font-medium">{session.user.name}</p>
                <p className="text-xs text-white/60">{session.user.email}</p>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 glass-light hover:bg-white/10 rounded-xl transition-all group"
              title="Logout"
            >
              <svg className="w-5 h-5 text-white/70 group-hover:text-coral-main transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline text-white/70 group-hover:text-white transition-colors font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Last Updated */}
        <div className="md:hidden pb-3 flex items-center justify-center space-x-2 glass-light px-4 py-2 rounded-xl mb-2">
          <div className="relative">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="text-xs">
            <span className="text-white/60">Updated: </span>
            <span className="text-white font-medium">{formatLastUpdated()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

