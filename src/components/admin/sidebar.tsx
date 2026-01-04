'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Shield, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home
} from 'lucide-react'
import { useState } from 'react'

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  description?: string
  badge?: string | number
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Ringkasan statistik dan aktivitas',
  },
  {
    title: 'Kelola Karyawan',
    href: '/admin/employees',
    icon: Users,
    description: 'Tambah, edit, dan hapus karyawan',
    badge: '6',
  },
  {
    title: 'Laporan Absensi',
    href: '/admin/attendance',
    icon: Calendar,
    description: 'Lihat semua laporan kehadiran',
  },
  {
    title: 'Generate QR Code',
    href: '/admin/qr-code',
    icon: Shield,
    description: 'Buat QR code baru untuk hari ini',
  },
  {
    title: 'Pengaturan',
    href: '/admin/settings',
    icon: Settings,
    description: 'Konfigurasi sistem absensi',
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('admin')
    window.location.href = '/admin/login'
  }

  const NavItem = ({ item, isLast = false }: { item: NavItem; isLast?: boolean }) => (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-3 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${
        pathname === item.href 
          ? 'bg-primary text-primary-foreground' 
          : 'text-slate-700 dark:text-slate-300'
      }`}
    >
      <item.icon className={`w-5 h-5 ${pathname === item.href ? 'text-primary-foreground' : ''}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.title}</p>
        {item.description && !isCollapsed && (
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {item.description}
          </p>
        )}
      </div>
      {item.badge && !isCollapsed && (
        <Badge className={`ml-auto shrink-0 ${
          pathname === item.href 
            ? 'bg-primary-foreground text-primary' 
            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
        }`}>
          {item.badge}
        </Badge>
      )}
      <ChevronRight className={`w-4 h-4 shrink-0 ml-2 ${
        isCollapsed ? 'hidden' : pathname === item.href ? 'text-primary-foreground' : 'text-slate-400'
      }`} />
    </Link>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 
        border-r border-slate-200 dark:border-slate-800 
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100">Admin</h1>
                <p className="text-xs text-slate-500">Sistem Absensi</p>
              </div>
            </div>
          )}
          {!isMobileOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <div key={item.href}>
              <NavItem item={item} isLast={index === navItems.length - 1} />
              {index !== navItems.length - 1 && !isCollapsed && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </nav>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          {!isCollapsed && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}
          {isCollapsed && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </aside>
    </>
  )
}
