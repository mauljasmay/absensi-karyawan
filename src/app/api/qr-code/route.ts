import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Generate random string for QR code
function generateQRString(date: string): string {
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `QR-${date}-${randomString}`
}

// GET - Get QR code for a specific date (default: today)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateParam = searchParams.get('date')

    const date = dateParam || new Date().toISOString().split('T')[0]

    // Try to find existing QR code for the date
    let dailyQR = await db.dailyQR.findUnique({
      where: { date }
    })

    // If not found, create a new one
    if (!dailyQR) {
      const qrCode = generateQRString(date)
      dailyQR = await db.dailyQR.create({
        data: {
          date,
          qrCode,
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      dailyQR
    })

  } catch (error) {
    console.error('Get QR code error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// POST - Generate new QR code for a date
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, forceRegenerate } = body

    const targetDate = date || new Date().toISOString().split('T')[0]

    // Check if QR code exists for the date
    const existingQR = await db.dailyQR.findUnique({
      where: { date: targetDate }
    })

    if (existingQR && !forceRegenerate) {
      return NextResponse.json({
        success: true,
        dailyQR: existingQR,
        message: 'QR code sudah ada untuk tanggal ini'
      })
    }

    // Deactivate existing QR codes for the date if force regenerate
    if (existingQR && forceRegenerate) {
      await db.dailyQR.update({
        where: { id: existingQR.id },
        data: { isActive: false }
      })
    }

    // Generate new QR code
    const qrCode = generateQRString(targetDate)

    const dailyQR = await db.dailyQR.create({
      data: {
        date: targetDate,
        qrCode,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      dailyQR,
      message: forceRegenerate ? 'QR code berhasil di-generate ulang' : 'QR code berhasil dibuat'
    }, { status: 201 })

  } catch (error) {
    console.error('Generate QR code error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

// PUT - Validate QR code
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrCode, date } = body

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code harus diisi' },
        { status: 400 }
      )
    }

    const today = date || new Date().toISOString().split('T')[0]

    // Find and validate QR code
    const dailyQR = await db.dailyQR.findFirst({
      where: {
        qrCode: qrCode,
        date: today,
        isActive: true
      }
    })

    if (!dailyQR) {
      return NextResponse.json({
        success: false,
        valid: false,
        message: 'QR code tidak valid atau kadaluarsa'
      })
    }

    return NextResponse.json({
      success: true,
      valid: true,
      dailyQR,
      message: 'QR code valid'
    })

  } catch (error) {
    console.error('Validate QR code error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
