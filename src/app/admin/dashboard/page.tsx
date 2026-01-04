'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserCheck, Users, Calendar, Clock, LogOut, Plus, TrendingUp, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    todayPresent: 0,
    todayAbsent: 0,
    todayLate: 0,
    totalAttendance: 0
  })

  const [recentAttendance, setRecentAttendance] = useState<any[]>([])

  // Check if admin is logged in
  useEffect(() => {
    const admin = localStorage.getItem('admin')
    if (!admin) {
      router.push('/admin/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    router.push('/admin/login')
  }

  // Load mock data
  useEffect(() => {
    setStats({
      totalEmployees: 24,
      todayPresent: 18,
      todayAbsent: 4,
      todayLate: 2,
      totalAttendance: 1248
    })

    setRecentAttendance([
      { id: 1, name: 'Budi Santoso', department: 'IT', checkIn: '08:02', status: 'Present' },
      { id: 2, name: 'Siti Rahayu', department: 'HR', checkIn: '08:15', status: 'Late' },
      { id: 3, name: 'Ahmad Wijaya', department: 'Finance', checkIn: '07:58', status: 'Present' },
      { id: 4, name: 'Dewi Lestari', department: 'Marketing', checkIn: '08:30', status: 'Late' },
      { id: 5, name: 'Eko Prasetyo', department: 'Operations', checkIn: '07:45', status: 'Present' },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Late':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Absent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
              <p className="text-xs text-slate-500">Sistem Absensi</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Admin Logged In
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Selamat datang kembali! Berikut ringkasan aktivitas hari ini.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Karyawan</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-slate-500 mt-1">Karyawan terdaftar</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hadir Hari Ini</CardTitle>
              <UserCheck className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.todayPresent}</div>
              <p className="text-xs text-slate-500 mt-1">Karyawan hadir</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
              <Clock className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.todayLate}</div>
              <p className="text-xs text-slate-500 mt-1">Karyawan terlambat</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Absensi</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAttendance}</div>
              <p className="text-xs text-slate-500 mt-1">Record sepanjang waktu</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Kelola Karyawan</CardTitle>
              <CardDescription>Tambah, edit, atau hapus data karyawan</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/admin/employees">
                  <Users className="w-4 h-4 mr-2" />
                  Kelola Karyawan
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Laporan Absensi</CardTitle>
              <CardDescription>Lihat semua laporan kehadiran karyawan</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/admin/attendance">
                  <Calendar className="w-4 h-4 mr-2" />
                  Lihat Laporan
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Generate QR Code</CardTitle>
              <CardDescription>Buat QR code baru untuk hari ini</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/admin/qr-code">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate QR Code
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Pengaturan</CardTitle>
              <CardDescription>Konfigurasi sistem absensi</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/admin/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Pengaturan
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Absensi Terbaru Hari Ini</CardTitle>
            <CardDescription>Karyawan yang baru saja check-in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Nama</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Departemen</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Waktu</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-medium">{record.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{record.department}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{record.checkIn}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            © 2024 Sistem Absensi Karyawan. Admin Panel
          </p>
        </div>
      </footer>
    </div>
  )
}
