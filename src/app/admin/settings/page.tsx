'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Settings, Save, RefreshCw, Bell, Shield, Database, Moon, Sun, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

type Settings = {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  workingHoursStart: string
  workingHoursEnd: string
  lateThreshold: string
  whatsappEnabled: boolean
  whatsappServiceUrl: string
  autoGenerateQR: boolean
  qrExpiryMinutes: number
  allowLateCheckIn: boolean
  requireCheckOut: boolean
  notificationEnabled: boolean
}

const defaultSettings: Settings = {
  companyName: 'PT Absensi Karyawan',
  companyAddress: 'Jl. Contoh No. 123, Jakarta',
  companyPhone: '08123456789',
  companyEmail: 'info@absensi.com',
  workingHoursStart: '08:00',
  workingHoursEnd: '17:00',
  lateThreshold: '09:00',
  whatsappEnabled: false,
  whatsappServiceUrl: 'http://localhost:3001',
  autoGenerateQR: true,
  qrExpiryMinutes: 0,
  allowLateCheckIn: true,
  requireCheckOut: false,
  notificationEnabled: true
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' })

  // Check if admin is logged in
  useEffect(() => {
    const admin = localStorage.getItem('admin')
    if (!admin) {
      router.push('/admin/login')
    }
  }, [router])

  const handleSave = async () => {
    setIsLoading(true)
    setSaveStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSaveStatus({ type: 'success', message: 'Pengaturan berhasil disimpan!' })
        // Update localStorage
        localStorage.setItem('settings', JSON.stringify(settings))
      } else {
        setSaveStatus({ type: 'error', message: data.error || 'Gagal menyimpan pengaturan' })
      }
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Terjadi kesalahan. Silakan coba lagi.' })
    } finally {
      setIsLoading(false)
      // Auto-clear status after 5 seconds
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 5000)
    }
  }

  const handleReset = async () => {
    if (confirm('Apakah Anda yakin ingin mereset pengaturan ke default?')) {
      setSettings(defaultSettings)
    }
  }

  const handleTestWhatsApp = async () => {
    try {
      const response = await fetch(settings.whatsappServiceUrl + '/health')
      const data = await response.json()

      if (response.ok && data.status === 'active') {
        alert('WhatsApp service aktif!')
      } else {
        alert('WhatsApp service tidak aktif. Cek konfigurasi dan pastikan service berjalan.')
      }
    } catch (error) {
      alert('Gagal mengecek status WhatsApp service.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin')
    router.push('/admin/login')
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
              <h1 className="text-xl font-bold text-primary">Pengaturan</h1>
              <p className="text-xs text-slate-500">Sistem Absensi</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleTestWhatsApp} title="Test WhatsApp Service">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} title="Logout">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Save Status Alert */}
          {saveStatus.type && (
            <div className={`mb-6 p-4 rounded-lg border ${
              saveStatus.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {saveStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <p className={`font-medium ${
                  saveStatus.type === 'success' 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {saveStatus.message}
                </p>
              </div>
            </div>
          )}

          <Tabs defaultValue="company" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
              <TabsTrigger value="company" className="data-[state=active]:border-primary">
                <Settings className="w-4 h-4 mr-2" />
                Perusahaan
              </TabsTrigger>
              <TabsTrigger value="attendance" className="data-[state=active]:border-primary">
                <Clock className="w-4 h-4 mr-2" />
                Absensi
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="data-[state=active]:border-primary">
                <Bell className="w-4 h-4 mr-2" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="qr" className="data-[state=active]:border-primary">
                <Shield className="w-4 h-4 mr-2" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:border-primary">
                <Database className="w-4 h-4 mr-2" />
                Sistem
              </TabsTrigger>
            </TabsList>

            {/* Company Settings */}
            <TabsContent value="company" className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Informasi Perusahaan</CardTitle>
                  <CardDescription>
                    Masukkan informasi perusahaan Anda. Informasi ini akan muncul di laporan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nama Perusahaan</Label>
                      <Input
                        id="companyName"
                        value={settings.companyName}
                        onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                        placeholder="PT Nama Perusahaan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Nomor Telepon</Label>
                      <Input
                        id="companyPhone"
                        type="tel"
                        value={settings.companyPhone}
                        onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                        placeholder="08123456789"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Alamat Perusahaan</Label>
                    <Input
                      id="companyAddress"
                      value={settings.companyAddress}
                      onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                      placeholder="Jl. Contoh No. 123, Jakarta"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email Perusahaan</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={settings.companyEmail}
                      onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                      placeholder="info@absensi.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attendance Settings */}
            <TabsContent value="attendance" className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Kebijakan Absensi</CardTitle>
                  <CardDescription>
                    Atur jam kerja, batas terlambat, dan kebijakan absensi.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workingHoursStart">Jam Masuk</Label>
                      <Input
                        id="workingHoursStart"
                        type="time"
                        value={settings.workingHoursStart}
                        onChange={(e) => setSettings({ ...settings, workingHoursStart: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHoursEnd">Jam Pulang</Label>
                      <Input
                        id="workingHoursEnd"
                        type="time"
                        value={settings.workingHoursEnd}
                        onChange={(e) => setSettings({ ...settings, workingHoursEnd: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lateThreshold">Batas Terlambat</Label>
                      <Input
                        id="lateThreshold"
                        type="time"
                        value={settings.lateThreshold}
                        onChange={(e) => setSettings({ ...settings, lateThreshold: e.target.value })}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Karyawan yang check-in setelah waktu ini akan dianggap terlambat
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allowLateCheckIn">Izinkan Terlambat</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="allowLateCheckIn"
                          checked={settings.allowLateCheckIn}
                          onCheckedChange={(checked) => setSettings({ ...settings, allowLateCheckIn: checked })}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {settings.allowLateCheckIn ? 'Karyawan dapat check-in terlambat' : 'Karyawan tidak dapat check-in terlambat'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requireCheckOut">Wajib Check-Out</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="requireCheckOut"
                        checked={settings.requireCheckOut}
                        onCheckedChange={(checked) => setSettings({ ...settings, requireCheckOut: checked })}
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {settings.requireCheckOut ? 'Karyawan wajib check-out sebelum pulang' : 'Tidak wajib check-out'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* WhatsApp Settings */}
            <TabsContent value="whatsapp" className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Notifikasi WhatsApp</CardTitle>
                      <CardDescription>
                        Atur notifikasi otomatis ke WhatsApp saat karyawan absen.
                      </CardDescription>
                    </div>
                    <Badge className={settings.whatsappEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'}>
                      {settings.whatsappEnabled ? 'Aktif' : 'Non-Aktif'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsappEnabled">Aktifkan Notifikasi WhatsApp</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="whatsappEnabled"
                        checked={settings.whatsappEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, whatsappEnabled: checked })}
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {settings.whatsappEnabled ? 'Notifikasi WhatsApp aktif' : 'Notifikasi WhatsApp non-aktif'}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="whatsappServiceUrl">URL Service WhatsApp</Label>
                    <Input
                      id="whatsappServiceUrl"
                      type="url"
                      value={settings.whatsappServiceUrl}
                      onChange={(e) => setSettings({ ...settings, whatsappServiceUrl: e.target.value })}
                      placeholder="http://localhost:3001"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      URL service WhatsApp (default: http://localhost:3001)
                    </p>
                  </div>

                  {settings.whatsappEnabled && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          <p className="font-semibold mb-1">Penting!</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Pastikan WhatsApp service berjalan pada URL yang ditentukan</li>
                            <li>Gunakan credentials WhatsApp Business API yang valid</li>
                            <li>Nomor telepon karyawan harus terdaftar di WhatsApp</li>
                            <li>Format nomor: 628123456789 atau 08123456789 (akan otomatis diubah ke 628...)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* QR Code Settings */}
            <TabsContent value="qr" className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Konfigurasi QR Code</CardTitle>
                  <CardDescription>
                    Atur bagaimana QR code dibuat dan dikelola.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="autoGenerateQR">Generate QR Code Otomatis</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoGenerateQR"
                        checked={settings.autoGenerateQR}
                        onCheckedChange={(checked) => setSettings({ ...settings, autoGenerateQR: checked })}
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {settings.autoGenerateQR ? 'QR code di-generate otomatis setiap hari' : 'QR code harus di-generate manual oleh admin'}
                      </span>
                    </div>
                  </div>

                  {settings.autoGenerateQR && (
                    <div className="space-y-2">
                      <Label htmlFor="qrExpiryMinutes">Durasi QR Code Berlaku (Menit)</Label>
                      <Input
                        id="qrExpiryMinutes"
                        type="number"
                        min="0"
                        value={settings.qrExpiryMinutes}
                        onChange={(e) => setSettings({ ...settings, qrExpiryMinutes: parseInt(e.target.value) })}
                        placeholder="0"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        QR code akan kadaluarsa setelah durasi ini (0 = hanya berlaku hari ini)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system" className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Pengaturan Sistem</CardTitle>
                  <CardDescription>
                    Konfigurasi sistem dan notifikasi.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notificationEnabled">Aktifkan Notifikasi Sistem</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notificationEnabled"
                        checked={settings.notificationEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, notificationEnabled: checked })}
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {settings.notificationEnabled ? 'Notifikasi sistem aktif' : 'Notifikasi sistem non-aktif'}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Status Aplikasi
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            Database
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {process.env.DATABASE_URL?.startsWith('file:') ? 'SQLite' : 'MySQL'}
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            WhatsApp Service
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {settings.whatsappEnabled ? 'Aktif' : 'Non-Aktif'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Perubahan pengaturan akan berlaku segera
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      Versi 2.1
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSave} disabled={isLoading} className="flex-1" size="lg">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Pengaturan
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset ke Default
            </Button>
          </div>

          {/* Important Notes */}
          <Card className="border-2 mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Catatan Penting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p>• Perubahan pengaturan akan segera diterapkan ke sistem</p>
              <p>• Pastikan untuk menguji pengaturan baru dengan satu karyawan sebelum berlaku ke semua karyawan</p>
              <p>• Perubahan pengaturan WhatsApp membutuhkan service WhatsApp yang aktif</p>
              <p>• QR code yang sudah digunakan tidak akan terpengaruh oleh perubahan pengaturan QR</p>
              <p>• Pengaturan ini disimpan di localStorage browser admin</p>
              <p>• Reset ke default akan menghapus semua customisasi yang telah dilakukan</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            © 2024 Sistem Absensi Karyawan. Admin Panel - Pengaturan
          </p>
        </div>
      </footer>
    </div>
  )
}
