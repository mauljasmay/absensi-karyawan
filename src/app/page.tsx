'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck, Shield, Clock, Users, ArrowRight, Building2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-primary">Sistem Absensi</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            Sistem Absensi Karyawan Cerdas
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Kelola kehadiran karyawan dengan mudah dan efisien menggunakan teknologi QR Code
          </p>
        </div>

        {/* Login Options */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* Admin Card */}
          <Card className="border-2 hover:border-primary transition-all hover:shadow-xl cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-12 h-12 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl mb-2">Admin</CardTitle>
              <CardDescription className="text-base">
                Akses panel admin untuk mengelola sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 mb-6">
                <li className="flex items-center justify-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Kelola data karyawan
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Generate QR Code harian
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  Lihat laporan absensi
                </li>
              </ul>
              <Button className="w-full" size="lg" asChild>
                <Link href="/admin/login">
                  <Shield className="w-5 h-5 mr-2" />
                  Login Admin
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Employee Card */}
          <Card className="border-2 hover:border-primary transition-all hover:shadow-xl cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="w-12 h-12 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl mb-2">Karyawan</CardTitle>
              <CardDescription className="text-base">
                Akses panel karyawan untuk absensi
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 mb-6">
                <li className="flex items-center justify-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Scan QR Code absensi
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Lihat riwayat kehadiran
                </li>
                <li className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  Kelola profil pribadi
                </li>
              </ul>
              <Button className="w-full" size="lg" asChild>
                <Link href="/employee/login">
                  <UserCheck className="w-5 h-5 mr-2" />
                  Login Karyawan
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-slate-900 dark:text-white">
            Fitur Utama
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mb-2" />
                <CardTitle>Real-time Absensi</CardTitle>
                <CardDescription>
                  Catat kehadiran karyawan secara instan dengan scan QR Code
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-2" />
                <CardTitle>QR Code Harian</CardTitle>
                <CardDescription>
                  QR code berubah setiap hari untuk keamanan maksimal
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-2" />
                <CardTitle>Manajemen Karyawan</CardTitle>
                <CardDescription>
                  Kelola data karyawan dan laporan absensi dengan mudah
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-slate-600 dark:text-slate-400">
            © 2024 Sistem Absensi Karyawan. Dibuat dengan Next.js, TypeScript, dan Prisma.
          </p>
        </div>
      </footer>
    </div>
  )
}
