'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, Download, Search, Filter, UserCheck, UserX, AlertCircle } from 'lucide-react'

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Load mock data
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setDateFilter(today)

    setAttendanceData([
      { id: '1', date: today, name: 'Budi Santoso', employeeNumber: 'EMP001', department: 'IT', position: 'Software Engineer', checkIn: '08:02', checkOut: '17:30', status: 'Present', notes: '' },
      { id: '2', date: today, name: 'Siti Rahayu', employeeNumber: 'EMP002', department: 'HR', position: 'HR Manager', checkIn: '08:15', checkOut: '17:45', status: 'Late', notes: 'Telat 15 menit' },
      { id: '3', date: today, name: 'Ahmad Wijaya', employeeNumber: 'EMP003', department: 'Finance', position: 'Accountant', checkIn: '07:58', checkOut: '17:20', status: 'Present', notes: '' },
      { id: '4', date: today, name: 'Dewi Lestari', employeeNumber: 'EMP004', department: 'Marketing', position: 'Marketing Specialist', checkIn: '08:30', checkOut: null, status: 'Late', notes: 'Masih bekerja' },
      { id: '5', date: today, name: 'Eko Prasetyo', employeeNumber: 'EMP005', department: 'Operations', position: 'Operations Manager', checkIn: '07:45', checkOut: '17:35', status: 'Present', notes: '' },
      { id: '6', date: today, name: 'Fitri Handayani', employeeNumber: 'EMP006', department: 'Sales', position: 'Sales Representative', checkIn: null, checkOut: null, status: 'Absent', notes: 'Sakit' },
    ])
  }, [])

  const filteredData = attendanceData.filter(record => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !departmentFilter || record.department === departmentFilter
    const matchesStatus = !statusFilter || record.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
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
        return <UserCheck className="w-4 h-4" />
      case 'Late':
        return <AlertCircle className="w-4 h-4" />
      case 'Absent':
        return <UserX className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStats = () => {
    return {
      total: attendanceData.length,
      present: attendanceData.filter(r => r.status === 'Present').length,
      late: attendanceData.filter(r => r.status === 'Late').length,
      absent: attendanceData.filter(r => r.status === 'Absent').length
    }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-primary">Laporan Absensi</h1>
              <p className="text-xs text-slate-500">Sistem Absensi</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Riwayat Absensi</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Pantau kehadiran karyawan dan laporan absensi
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Karyawan</CardTitle>
              <Calendar className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hadir</CardTitle>
              <UserCheck className="w-4 h-4 text-green-600" />
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

          <Card className="border-2 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tidak Hadir</CardTitle>
              <UserX className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Pencarian</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Nama atau nomor karyawan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Departemen</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">Semua Departemen</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="Present">Hadir</option>
                  <option value="Late">Terlambat</option>
                  <option value="Absent">Tidak Hadir</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daftar Absensi</CardTitle>
                <CardDescription>
                  {filteredData.length} catatan absensi
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Karyawan</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Departemen</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Posisi</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Check-in</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Check-out</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{record.name}</div>
                          <div className="text-xs text-slate-500">{record.employeeNumber}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{record.department}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {record.position}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {record.checkIn ? (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {record.checkIn}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {record.checkOut ? (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {record.checkOut}
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

            {filteredData.length === 0 && (
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
            © 2024 Sistem Absensi Karyawan. Admin Panel
          </p>
        </div>
      </footer>
    </div>
  )
}
