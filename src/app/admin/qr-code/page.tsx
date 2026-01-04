'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, QrCode, RefreshCw, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default function QRCodePage() {
  const [currentDate, setCurrentDate] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrHistory, setQrHistory] = useState<any[]>([])

  useEffect(() => {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    setCurrentDate(dateStr)

    // Generate QR code for today
    generateQRCode(dateStr)

    // Load QR history
    setQrHistory([
      { id: '1', date: dateStr, qrCode: 'QR-TODAY-123456', isActive: true },
      { id: '2', date: '2024-01-19', qrCode: 'QR-YESTERDAY-789012', isActive: false },
      { id: '3', date: '2024-01-18', qrCode: 'QR-20240118-345678', isActive: false },
    ])
  }, [])

  const generateQRCode = (date: string = currentDate) => {
    setIsGenerating(true)

    // Simulate API call to generate QR code
    setTimeout(() => {
      const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
      const newQR = `QR-${date}-${randomString}`
      setQrCode(newQR)
      setIsGenerating(false)
    }, 1000)
  }

  const handleRegenerate = () => {
    if (confirm('Apakah Anda yakin ingin membuat QR code baru? QR code yang lama akan tidak berlaku.')) {
      generateQRCode()
    }
  }

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
              <h1 className="text-xl font-bold text-primary">QR Code Harian</h1>
              <p className="text-xs text-slate-500">Sistem Absensi</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Generate QR Code</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Buat QR code baru untuk absensi harian
          </p>
        </div>

        {/* Current QR Code Card */}
        <Card className="border-2 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>QR Code Hari Ini</CardTitle>
                <CardDescription>
                  {formatDisplayDate(currentDate)}
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircle className="w-4 h-4 mr-1" />
                Aktif
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              {/* QR Code Display */}
              <div className="relative">
                <div className="w-64 h-64 bg-white dark:bg-slate-900 border-4 border-primary rounded-lg flex items-center justify-center shadow-lg">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-12 h-12 text-primary animate-spin" />
                      <span className="text-sm text-slate-500">Generating...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <QrCode className="w-32 h-32 text-primary" />
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary font-mono tracking-wider">
                          {qrCode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center space-y-2 max-w-md">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Karyawan dapat menggunakan QR code ini untuk melakukan check-in dan check-out absensi hari ini.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>QR code ini hanya berlaku untuk hari ini</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  variant="outline"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  Generate Baru
                </Button>
                <Button
                  onClick={() => {
                    const element = document.getElementById('qr-print')
                    if (element) {
                      window.print()
                    }
                  }}
                  disabled={!qrCode}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Cetak QR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code History */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Riwayat QR Code</CardTitle>
            <CardDescription>
              QR code yang telah dibuat sebelumnya
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qrHistory.map((qr) => (
                <div
                  key={qr.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <div className="font-mono text-lg font-semibold">{qr.qrCode}</div>
                      <div className="text-sm text-slate-500">{formatDisplayDate(qr.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {qr.isActive ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aktif
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-500">
                        <Clock className="w-4 h-4 mr-1" />
                        Kadaluarsa
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Cara Menggunakan QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p>1. Generate QR code baru setiap hari</p>
              <p>2. Tampilkan QR code di area yang mudah diakses</p>
              <p>3. Karyawan scan QR code menggunakan aplikasi</p>
              <p>4. Sistem akan mencatat waktu check-in dan check-out</p>
              <p>5. QR code hanya berlaku untuk tanggal yang ditentukan</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Keamanan QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p>• QR code berubah setiap hari secara otomatis</p>
              <p>• QR code yang lama tidak dapat digunakan lagi</p>
              <p>• Setiap QR code bersifat unik per tanggal</p>
              <p>• Admin dapat regenerate QR code jika diperlukan</p>
              <p>• Log penggunaan QR code tersimpan di sistem</p>
            </CardContent>
          </Card>
        </div>
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
