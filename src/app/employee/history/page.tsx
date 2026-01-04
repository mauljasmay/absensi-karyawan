'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter, TrendingUp } from 'lucide-react'

export default function HistoryPage() {
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [monthFilter, setMonthFilter] = useState('')

  // Load mock data
  useEffect(() => {
    const today = new Date()
    const data = []
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue

      const status = Math.random()
      let recordStatus = 'Present'
      let checkIn = '08:00'
      let checkOut = '17:00'

      if (status > 0.85) {
        recordStatus = 'Absent'
        checkIn = null
        checkOut = null
      } else if (status > 0.7) {
        recordStatus = 'Late'
        checkIn = `08:${Math.floor(Math.random() * 30 + 15).toString().padStart(2, '0')}`
        checkOut = '17:30'
      } else {
        checkIn = `07:${Math.floor(Math.random() * 30 + 30).toString().padStart(2, '0')}`
        checkOut = `17:${Math.floor(Math.random() * 30 + 15).toString().padStart(2, '0')}`
      }

      data.push({
        id: i.toString(),
        date: date.toISOString().split('T')[0],
        checkInTime: checkIn,
        checkOutTime: checkOut,
        status: recordStatus,
        notes: recordStatus === 'Absent' ? 'Sakit' : ''
      })
    }

    setAttendanceHistory(data)
  }, [])

  const filteredHistory = attendanceHistory.filter(record => {
    const matchesSearch =
      record.date.includes(searchTerm) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="w-4 h-4" />
      case 'Late':
        return <AlertCircle className="w-4 h-4" />
      case 'Absent':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const calculateStats = () => {
    const total = attendanceHistory.length
    const present = attendanceHistory.filter(r => r.status === 'Present').length
    const late = attendanceHistory.filter(r => r.status === 'Late').length
    const absent = attendanceHistory.filter(r => r.status === 'Absent').length
    const attendanceRate = total > 0 ? Math.round((present + late) / total * 100) : 0

    return { total, present, late, absent, attendanceRate }
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employee/dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-primary">Riwayat Absensi</h1>
              <p className="text-xs text-slate-500">Sistem Absensi</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Riwayat Kehadiran</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Lihat semua riwayat absensi Anda
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hari</CardTitle>
              <Calendar className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hadir Tepat Waktu</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
              <AlertCircle className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tingkat Kehadiran</CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="border-2 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pencarian</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Cari berdasarkan tanggal atau status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bulan</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                >
                  <option value="">Semua Bulan</option>
                  <option value="01">Januari</option>
                  <option value="02">Februari</option>
                  <option value="03">Maret</option>
                  <option value="04">April</option>
                  <option value="05">Mei</option>
                  <option value="06">Juni</option>
                  <option value="07">Juli</option>
                  <option value="08">Agustus</option>
                  <option value="09">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daftar Kehadiran</CardTitle>
                <CardDescription>
                  {filteredHistory.length} catatan absensi
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white dark:bg-slate-950">
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Tanggal</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Check-in</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Check-out</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{formatDate(record.date)}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {record.checkInTime ? (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {record.checkInTime}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {record.checkOutTime ? (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {record.checkOutTime}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(record.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(record.status)}
                            {record.status}
                          </span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {record.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredHistory.length === 0 && (
              <div className="py-12 text-center">
                <Filter className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">Tidak ada data absensi yang ditemukan</p>
              </div>
            )}
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
