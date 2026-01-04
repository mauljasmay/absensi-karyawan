'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck, Shield, Clock, Users, ArrowRight, Building2 } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-primary hidden sm:block">Sistem Absensi</h1>
            <h1 className="text-xl font-bold text-primary sm:hidden">Absensi</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-slate-900 dark:text-white">
            Sistem Absensi Karyawan Cerdas
          </h2>
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
            Kelola kehadiran karyawan dengan mudah dan efisien menggunakan teknologi QR Code
          </p>
        </div>

        {/* Login Options */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Admin Card */}
          <Card className="border-2 hover:border-primary transition-all hover:shadow-xl cursor-pointer group">
            <CardHeader className="text-center py-6 md:py-8">
              <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="w-8 h-8 md:w-12 md:h-12 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl md:text-3xl mb-2">Admin</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Akses panel admin untuk mengelola sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-3 text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-6">
                <li className="flex items-center justify-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Kelola data karyawan</span>
                  <span className="sm:hidden">Kelola karyawan</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Generate QR Code harian</span>
                  <span className="sm:hidden">Generate QR Code</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Lihat laporan absensi</span>
                  <span className="sm:hidden">Lihat laporan</span>
                </li>
              </ul>
              <Button className="w-full" size="lg" asChild>
                <Link href="/admin/login">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span className="hidden sm:inline">Login Admin</span>
                  <span className="sm:hidden">Login</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Employee Card */}
          <Card className="border-2 hover:border-primary transition-all hover:shadow-xl cursor-pointer group">
            <CardHeader className="text-center py-6 md:py-8">
              <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <UserCheck className="w-8 h-8 md:w-12 md:h-12 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl md:text-3xl mb-2">Karyawan</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Akses panel karyawan untuk absensi
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-3 text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-6">
                <li className="flex items-center justify-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Scan QR Code absensi</span>
                  <span className="sm:hidden">Scan QR Code</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Lihat riwayat kehadiran</span>
                  <span className="sm:hidden">Riwayat kehadiran</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Kelola profil pribadi</span>
                  <span className="sm:hidden">Profil pribadi</span>
                </li>
              </ul>
              <Button className="w-full" size="lg" asChild>
                <Link href="/employee/login">
                  <UserCheck className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span className="hidden sm:inline">Login Karyawan</span>
                  <span className="sm:hidden">Login</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 text-slate-900 dark:text-white">
            Fitur Utama
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader className="py-6 md:py-8">
                <Clock className="w-10 h-10 md:w-12 md:h-12 text-primary mb-2" />
                <CardTitle className="text-lg md:text-xl">Real-time Absensi</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Catat kehadiran karyawan secara instan dengan scan QR Code
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader className="py-6 md:py-8">
                <Shield className="w-10 h-10 md:w-12 md:h-12 text-primary mb-2" />
                <CardTitle className="text-lg md:text-xl">QR Code Harian</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  QR code berubah setiap hari untuk keamanan maksimal
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader className="py-6 md:py-8">
                <Users className="w-10 h-10 md:w-12 md:h-12 text-primary mb-2" />
                <CardTitle className="text-lg md:text-xl">Manajemen Karyawan</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Kelola data karyawan dan laporan absensi dengan mudah
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <p className="text-center text-xs md:text-sm text-slate-600 dark:text-slate-400">
            © 2024 Sistem Absensi Karyawan. Dibuat dengan Next.js, TypeScript, dan Prisma.
          </p>
        </div>
      </footer>
    </div>
  )
}
