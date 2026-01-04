import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'

// GET - Get current settings
export async function GET(request: NextRequest) {
  try {
    // Check if admin is logged in
    const adminHeader = request.headers.get('authorization')
    if (!adminHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Read settings from JSON file (or database in production)
    const settingsPath = path.join(process.cwd(), 'settings.json')
    let settings = {
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

    // Try to read from file
    try {
      const settingsData = await fs.readFile(settingsPath, 'utf-8')
      settings = JSON.parse(settingsData.toString())
    } catch (error) {
      // File doesn't exist, use defaults
      console.log('Settings file not found, using defaults')
    }

    return NextResponse.json({
      success: true,
      settings
    })

  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// POST - Save settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if admin is logged in
    const adminHeader = request.headers.get('authorization')
    if (!adminHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate required fields
    const {
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      workingHoursStart,
      workingHoursEnd,
      lateThreshold,
      whatsappEnabled,
      whatsappServiceUrl,
      autoGenerateQR,
      qrExpiryMinutes,
      allowLateCheckIn,
      requireCheckOut,
      notificationEnabled
    } = body

    // Basic validation
    if (!companyName) {
      return NextResponse.json(
        { error: 'Nama perusahaan wajib diisi' },
        { status: 400 }
      )
    }

    if (companyPhone && !/^08[0-9][0-9]{8,11}$/.test(companyPhone) && !/^62[0-9][0-9]{8,11}$/.test(companyPhone)) {
      return NextResponse.json(
        { error: 'Format nomor telepon tidak valid. Gunakan format 08... atau 62...' },
        { status: 400 }
      )
    }

    // Validate working hours
    if (workingHoursStart && workingHoursEnd) {
      const start = new Date(`1970-01-01T${workingHoursStart}`)
      const end = new Date(`1970-01-01T${workingHoursEnd}`)
      if (start >= end) {
        return NextResponse.json(
          { error: 'Jam pulang harus lebih besar dari jam masuk' },
          { status: 400 }
        )
      }
    }

    if (lateThreshold) {
      const threshold = new Date(`1970-01-01T${lateThreshold}`)
      if (threshold.getHours() < 6 || threshold.getHours() > 12) {
        return NextResponse.json(
          { error: 'Batas terlambat harus antara jam 06:00 dan 12:00' },
          { status: 400 }
        )
      }
    }

    // Prepare settings object
    const settings = {
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      workingHoursStart,
      workingHoursEnd,
      lateThreshold,
      whatsappEnabled: whatsappEnabled || false,
      whatsappServiceUrl: whatsappServiceUrl || 'http://localhost:3001',
      autoGenerateQR: autoGenerateQR !== false,
      qrExpiryMinutes: qrExpiryMinutes || 0,
      allowLateCheckIn: allowLateCheckIn !== false,
      requireCheckOut: requireCheckOut || false,
      notificationEnabled: notificationEnabled !== false
    }

    // Save to file (in production, save to database)
    const settingsPath = path.join(process.cwd(), 'settings.json')
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8')

    // Log the save
    console.log('Settings saved:', settings)

    return NextResponse.json({
      success: true,
      message: 'Pengaturan berhasil disimpan',
      settings
    })

  } catch (error) {
    console.error('Save settings error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
