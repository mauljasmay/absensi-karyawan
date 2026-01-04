'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Calendar, Clock, LogOut, Scan, ArrowRight, MapPin, Mail, Phone } from 'lucide-react'

export default function EmployeeDashboard() {
  const router = useRouter()
  const [employeeData, setEmployeeData] = useState<any>(null)
  const [todayAttendance, setTodayAttendance] = useState<any>(null)
  const [recentAttendance, setRecentAttendance] = useState<any[]>([])

  // Check if employee is logged in
  useEffect(() => {
    const employee = localStorage.getItem('employee')
    if (!employee) {
      router.push('/employee/login')
    } else {
      setEmployeeData(JSON.parse(employee))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('employee')
    router.push('/employee/login')
  }

  // Load attendance data (mock)
  useEffect(() => {
    setTodayAttendance({
      date: new Date().toISOString().split('T')[0],
      checkInTime: '08:02',
      checkOutTime: null,
      status: 'Present'
    })

    setRecentAttendance([
      { id: '1', date: '2024-01-19', checkInTime: '08:02', checkOutTime: '17:30', status: 'Present' },
      { id: '2', date: '2024-01-18', checkInTime: '07:58', checkOutTime: '17:25', status: 'Present' },
      { id: '3', date: '2024-01-17', checkInTime: '08:15', checkOutTime: '17:40', status: 'Late' },
      { id: '4', date: '2024-01-16', checkInTime: '07:45', checkOutTime: '17:35', status: 'Present' },
      { id: '5', date: '2024-01-15', checkInTime: null, checkOutTime: null, status: 'Absent' },
    ])
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, string> = {
      'IT': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'HR': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'Finance': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Marketing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Operations': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Sales': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }
    return colors[dept] || 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'
  }

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Panel Karyawan</h1>
              <p className="text-xs text-slate-500">Sistem Absensi</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {employeeData && getInitials(employeeData.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">
                {employeeData?.name}
              </span>
            </div>
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
          <h2 className="text-3xl font-bold mb-2">Selamat Datang!</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Kelola absensi dan lihat profil Anda di sini
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-2 mb-6">
          <CardHeader>
            <CardTitle>Profil Karyawan</CardTitle>
            <CardDescription>Informasi pribadi dan detail pekerjaan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {employeeData && getInitials(employeeData.name)}
                  </AvatarFallback>
                </Avatar>
                <Badge className={getDepartmentColor(employeeData?.department)}>
                  {employeeData?.department}
                </Badge>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500">Nama Lengkap</label>
                    <p className="font-semibold">{employeeData?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500">Nomor Karyawan</label>
                    <p className="font-semibold font-mono">{employeeData?.employeeNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <p className="text-sm">{employeeData?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500">Telepon</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <p className="text-sm">{employeeData?.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500">Departemen</label>
                    <p>{employeeData?.department}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-500">Posisi</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <p>{employeeData?.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Attendance */}
        <Card className="border-2 mb-6">
          <CardHeader>
            <CardTitle>Absensi Hari Ini</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayAttendance ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-slate-500">Check-in</p>
                      <p className="text-2xl font-bold">{todayAttendance.checkInTime}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(todayAttendance.status)}>
                    {todayAttendance.status}
                  </Badge>
                </div>

                {todayAttendance.checkOutTime ? (
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-slate-500">Check-out</p>
                        <p className="text-2xl font-bold">{todayAttendance.checkOutTime}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href="/employee/scan">
                      <Scan className="w-4 h-4 mr-2" />
                      Scan QR Code untuk Check-out
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Scan className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500 mb-4">Anda belum melakukan check-in hari ini</p>
                <Button asChild>
                  <Link href="/employee/scan">
                    <Scan className="w-4 h-4 mr-2" />
                    Scan QR Code untuk Check-in
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="border-2 hover:border-primary transition-all cursor-pointer">
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>Scan QR code untuk absensi</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/employee/scan">
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Sekarang
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-all cursor-pointer">
            <CardHeader>
              <CardTitle>Riwayat Absensi</CardTitle>
              <CardDescription>Lihat semua riwayat kehadiran</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/employee/history">
                  <Calendar className="w-4 h-4 mr-2" />
                  Lihat Riwayat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance History */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Riwayat Absensi Terakhir</CardTitle>
            <CardDescription>5 absensi terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium">{formatDate(record.date)}</p>
                      <p className="text-sm text-slate-500">
                        {record.checkInTime && `In: ${record.checkInTime}`}
                        {record.checkInTime && record.checkOutTime && ' | '}
                        {record.checkOutTime && `Out: ${record.checkOutTime}`}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            © 2024 Sistem Absensi Karyawan. Panel Karyawan
          </p>
        </div>
      </footer>
    </div>
  )
}
