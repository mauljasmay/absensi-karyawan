'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Camera, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string>('')
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error' | 'scanning'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Reset scan status when component mounts
    setScanStatus('idle')
    setScanResult('')
    setErrorMessage('')
  }, [])

  const startScan = async () => {
    setIsScanning(true)
    setScanStatus('scanning')
    setErrorMessage('')

    // Simulate camera access and QR scanning
    // In a real app, this would use a QR code scanning library like react-qr-reader
    setTimeout(() => {
      // Simulate successful scan with today's QR code
      const today = new Date().toISOString().split('T')[0]
      const simulatedQR = `QR-${today}-ABC123`

      // Randomly simulate success or error for demo purposes
      const isSuccess = Math.random() > 0.2 // 80% success rate

      if (isSuccess) {
        setScanResult(simulatedQR)
        setScanStatus('success')
      } else {
        setErrorMessage('QR code tidak valid atau kadaluarsa')
        setScanStatus('error')
      }
      setIsScanning(false)
    }, 2000)
  }

  const resetScan = () => {
    setScanStatus('idle')
    setScanResult('')
    setErrorMessage('')
    setIsScanning(false)
  }

  const handleCheckIn = () => {
    // In a real app, this would call the API to record check-in
    alert('Check-in berhasil! Waktu: ' + new Date().toLocaleTimeString('id-ID'))
    // Navigate back to dashboard
    window.location.href = '/employee/dashboard'
  }

  const handleCheckOut = () => {
    // In a real app, this would call the API to record check-out
    alert('Check-out berhasil! Waktu: ' + new Date().toLocaleTimeString('id-ID'))
    // Navigate back to dashboard
    window.location.href = '/employee/dashboard'
  }

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
              <h1 className="text-xl font-bold text-primary">Scan QR Code</h1>
              <p className="text-xs text-slate-500">Sistem Absensi</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Absensi QR Code</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Scan QR code yang tersedia untuk melakukan check-in atau check-out
            </p>
          </div>

          {/* Scanner Card */}
          <Card className="border-2 mb-6">
            <CardHeader>
              <CardTitle>Scanner</CardTitle>
              <CardDescription>Arahkan kamera ke QR code absensi</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Camera/Scanner Area */}
              <div className="relative aspect-square bg-slate-900 dark:bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center">
                {scanStatus === 'idle' && (
                  <div className="text-center space-y-4">
                    <Camera className="w-24 h-24 mx-auto text-slate-500" />
                    <div>
                      <p className="text-white text-lg font-medium mb-2">Kamera Belum Aktif</p>
                      <p className="text-slate-400 text-sm">Tekan tombol Mulai Scan untuk mengaktifkan kamera</p>
                    </div>
                  </div>
                )}

                {scanStatus === 'scanning' && (
                  <div className="text-center space-y-4">
                    <RefreshCw className="w-24 h-24 mx-auto text-primary animate-spin" />
                    <div>
                      <p className="text-white text-lg font-medium mb-2">Scanning...</p>
                      <p className="text-slate-400 text-sm">Arahkan kamera ke QR code</p>
                    </div>
                  </div>
                )}

                {scanStatus === 'success' && (
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-lg font-medium mb-2">QR Code Terdeteksi!</p>
                      <p className="text-slate-400 text-sm font-mono">{scanResult}</p>
                    </div>
                  </div>
                )}

                {scanStatus === 'error' && (
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                      <XCircle className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-lg font-medium mb-2">Gagal!</p>
                      <p className="text-red-400 text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Scan overlay */}
                {(scanStatus === 'scanning' || scanStatus === 'success') && (
                  <div className="absolute inset-4 border-2 border-primary rounded-lg pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary -mt-2 -ml-2" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary -mt-2 -mr-2" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary -mb-2 -ml-2" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary -mb-2 -mr-2" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {scanStatus === 'idle' && (
                  <Button className="flex-1" onClick={startScan}>
                    <Camera className="w-4 h-4 mr-2" />
                    Mulai Scan
                  </Button>
                )}

                {(scanStatus === 'scanning' || scanStatus === 'error') && (
                  <>
                    <Button variant="outline" className="flex-1" onClick={resetScan}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Ulangi
                    </Button>
                  </>
                )}

                {scanStatus === 'success' && (
                  <>
                    <Button variant="outline" className="flex-1" onClick={resetScan}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Scan Ulang
                    </Button>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleCheckIn}>
                      <Clock className="w-4 h-4 mr-2" />
                      Check-In
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleCheckOut}>
                      <Clock className="w-4 h-4 mr-2" />
                      Check-Out
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Cara Menggunakan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <p>Pastikan QR code yang akan di-scan adalah QR code hari ini</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <p>Arahkan kamera ke QR code dengan pencahayaan yang cukup</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <p>Tunggu sampai QR code terdeteksi oleh sistem</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <p>Pilih Check-In saat masuk atau Check-Out saat pulang</p>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="border-2 border-amber-200 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Penting!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p>• QR code berubah setiap hari, pastikan menggunakan QR code yang benar</p>
              <p>• Check-in maksimal pukul 09:00 untuk tidak dianggap terlambat</p>
              <p>• Pastikan lokasi Anda berada di area kantor saat melakukan absensi</p>
              <p>• Sistem akan mencatat waktu check-in dan check-out secara otomatis</p>
            </CardContent>
          </Card>
        </div>
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
