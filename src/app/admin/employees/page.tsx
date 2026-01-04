'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { UserCheck, Plus, Edit, Trash2, Search, Mail, Phone, Building, Camera, Upload, CreditCard } from 'lucide-react'
import AdminSidebar from '@/components/admin/sidebar'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [formData, setFormData] = useState({
    employeeNumber: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    password: '',
    salaryDate: '',
    bankAccount: '',
    bankName: '',
    avatar: ''
  })

  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales']
  const banks = ['BCA', 'BRI', 'Mandiri', 'BNI', 'Jago', 'Muamalat', 'Danamon']

  // Load mock data
  useEffect(() => {
    setEmployees([
      { id: '1', employeeNumber: 'EMP001', name: 'Budi Santoso', email: 'budi@example.com', phone: '08123456789', department: 'IT', position: 'Software Engineer', salaryDate: '2024-01-25', bankAccount: '1234567890', bankName: 'BCA', avatar: '', createdAt: '2024-01-15' },
      { id: '2', employeeNumber: 'EMP002', name: 'Siti Rahayu', email: 'siti@example.com', phone: '08123456790', department: 'HR', position: 'HR Manager', salaryDate: '2024-01-25', bankAccount: '09876543210', bankName: 'BRI', avatar: '', createdAt: '2024-01-16' },
      { id: '3', employeeNumber: 'EMP003', name: 'Ahmad Wijaya', email: 'ahmad@example.com', phone: '08123456791', department: 'Finance', position: 'Accountant', salaryDate: '2024-01-25', bankAccount: '01234567890', bankName: 'Mandiri', avatar: '', createdAt: '2024-01-17' },
      { id: '4', employeeNumber: 'EMP004', name: 'Dewi Lestari', email: 'dewi@example.com', phone: '08123456792', department: 'Marketing', position: 'Marketing Specialist', salaryDate: '2024-01-25', bankAccount: '1357924680', bankName: 'BNI', avatar: '', createdAt: '2024-01-18' },
      { id: '5', employeeNumber: 'EMP005', name: 'Eko Prasetyo', email: 'eko@example.com', phone: '08123456793', department: 'Operations', position: 'Operations Manager', salaryDate: '2024-01-25', bankAccount: '0001234567', bankName: 'Jago', avatar: '', createdAt: '2024-01-19' },
    ])
  }, [])

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'avatar')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setFormData(prev => ({ ...prev, avatar: result.fileUrl }))
      } else {
        alert(result.error || 'Gagal mengupload foto')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Gagal mengupload foto')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddEmployee = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newEmployee = {
        id: (employees.length + 1).toString(),
        ...formData,
        avatar: formData.avatar || '',
        salaryDate: formData.salaryDate || '',
        bankAccount: formData.bankAccount || '',
        bankName: formData.bankName || '',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setEmployees([...employees, newEmployee])
      setIsAddDialogOpen(false)
      setFormData({
        employeeNumber: '',
        name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        password: '',
        salaryDate: '',
        bankAccount: '',
        bankName: '',
        avatar: ''
      })
      setIsLoading(false)
      alert('Karyawan berhasil ditambahkan!')
    }, 500)
  }

  const handleEditEmployee = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setEmployees(employees.map(emp =>
        emp.id === editingEmployee.id
          ? { ...emp, ...formData, avatar: formData.avatar || '', salaryDate: formData.salaryDate || '', bankAccount: formData.bankAccount || '', bankName: formData.bankName || '' }
          : emp
      ))
      setIsEditDialogOpen(false)
      setEditingEmployee(null)
      setFormData({
        employeeNumber: '',
        name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        password: '',
        salaryDate: '',
        bankAccount: '',
        bankName: '',
        avatar: ''
      })
      setIsLoading(false)
      alert('Data karyawan berhasil diperbarui!')
    }, 500)
  }

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
      setEmployees(employees.filter(emp => emp.id !== id))
      alert('Karyawan berhasil dihapus!')
    }
  }

  const openEditDialog = (employee: any) => {
    setEditingEmployee(employee)
    setFormData({
      employeeNumber: employee.employeeNumber,
      name: employee.name,
      email: employee.email,
      phone: employee.phone || '',
      department: employee.department,
      position: employee.position,
      password: '',
      salaryDate: employee.salaryDate || '',
      bankAccount: employee.bankAccount || '',
      bankName: employee.bankName || '',
      avatar: employee.avatar || ''
    })
    setIsEditDialogOpen(true)
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

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
        {/* Top Header */}
        <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-10 lg:ml-64">
          <div className="px-4 py-3 flex items-center justify-between lg:px-8">
            <div>
              <h1 className="text-xl font-bold text-primary">Kelola Karyawan</h1>
              <p className="text-xs text-slate-500">Total {employees.length} karyawan terdaftar</p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Karyawan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tambah Karyawan Baru</DialogTitle>
                    <DialogDescription>
                      Isi form di bawah ini untuk menambahkan karyawan baru
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="add-emp-number">Nomor Karyawan</Label>
                        <Input
                          id="add-emp-number"
                          value={formData.employeeNumber}
                          onChange={(e) => handleInputChange('employeeNumber', e.target.value)}
                          placeholder="EMP001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-name">Nama Lengkap</Label>
                        <Input
                          id="add-name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Nama Karyawan"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="add-email">Email</Label>
                      <Input
                        id="add-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="nama@perusahaan.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="add-phone">No. Telepon</Label>
                      <Input
                        id="add-phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="add-department">Departemen</Label>
                        <Select onValueChange={(value) => handleInputChange('department', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih departemen" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-position">Posisi</Label>
                        <Input
                          id="add-position"
                          value={formData.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          placeholder="Posisi karyawan"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="add-password">Password</Label>
                      <Input
                        id="add-password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Password untuk login"
                      />
                    </div>

                    <Separator className="my-4" />
                    <div className="flex items-center gap-2 mb-4">
                      <Building className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Informasi Gaji & Rekening</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="add-salary-date">Tanggal Gajian</Label>
                        <Input
                          id="add-salary-date"
                          type="date"
                          value={formData.salaryDate}
                          onChange={(e) => handleInputChange('salaryDate', e.target.value)}
                          placeholder="YYYY-MM-DD"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-bank-account">No. Rekening</Label>
                        <Input
                          id="add-bank-account"
                          value={formData.bankAccount}
                          onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                          placeholder="1234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="add-bank-name">Nama Bank</Label>
                        <Select onValueChange={(value) => handleInputChange('bankName', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih bank" />
                          </SelectTrigger>
                          <SelectContent>
                            {banks.map(bank => (
                              <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator className="my-4" />
                    <div className="flex items-center gap-2 mb-4">
                      <Camera className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Foto Profil</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="add-avatar-upload">Foto Profil (Opsional)</Label>
                          <Input
                            id="add-avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="cursor-pointer"
                          />
                          {isUploading && (
                            <p className="text-sm text-primary mt-1">Sedang mengupload...</p>
                          )}
                        </div>

                        <div className="flex-shrink-0">
                          {formData.avatar && (
                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                              <img
                                src={formData.avatar}
                                alt="Preview foto"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={handleAddEmployee} disabled={isLoading || isUploading}>
                      {isLoading ? 'Menambah...' : 'Tambah'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-8 lg:px-8 lg:ml-64">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Cari karyawan berdasarkan nama, email, nomor, atau departemen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Employee Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="border-2 hover:border-primary transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {employee.avatar ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                          <UserCheck className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{employee.name}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <span>{employee.employeeNumber}</span>
                          {employee.salaryDate && (
                            <>
                              <span>•</span>
                              <span className="text-primary font-medium">Gaji: {employee.salaryDate}</span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getDepartmentColor(employee.department)}>
                      {employee.department}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400 truncate">
                        {employee.email}
                      </span>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">
                          {employee.phone}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {employee.position}
                      </span>
                    </div>
                    {employee.bankAccount && employee.bankName && (
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">
                          {employee.bankName} - {employee.bankAccount}
                        </span>
                      </div>
                    )}
                    <div className="pt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => openEditDialog(employee)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <UserCheck className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">Tidak ada karyawan yang ditemukan</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Karyawan</DialogTitle>
            <DialogDescription>
              Perbarui informasi karyawan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-emp-number">Nomor Karyawan</Label>
                <Input
                  id="edit-emp-number"
                  value={formData.employeeNumber}
                  onChange={(e) => handleInputChange('employeeNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Lengkap</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">No. Telepon</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-department">Departemen</Label>
                <Select onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">Posisi</Label>
                <Input
                  id="edit-position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">Password (Opsional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Biarkan kosong jika tidak ingin mengubah password"
              />
            </div>

            <Separator className="my-4" />
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Informasi Gaji & Rekening</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-salary-date">Tanggal Gajian</Label>
                <Input
                  id="edit-salary-date"
                  type="date"
                  value={formData.salaryDate}
                  onChange={(e) => handleInputChange('salaryDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bank-account">No. Rekening</Label>
                <Input
                  id="edit-bank-account"
                  value={formData.bankAccount}
                  onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bank-name">Nama Bank</Label>
                <Select onValueChange={(value) => handleInputChange('bankName', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map(bank => (
                      <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-4" />
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Foto Profil</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="edit-avatar-upload">Foto Profil</Label>
                  <Input
                    id="edit-avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  {isUploading && (
                    <p className="text-sm text-primary mt-1">Sedang mengupload...</p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  {formData.avatar && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img
                        src={formData.avatar}
                        alt="Preview foto"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditEmployee} disabled={isLoading || isUploading}>
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
